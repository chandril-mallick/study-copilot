import { useRef, useCallback } from "react";

// Singleton AudioContext to avoid "Too many AudioContexts" errors
let sharedAudioCtx = null;

/**
 * Plays audio through Web Audio API and exposes real-time amplitude
 * for lip-sync / mouth animation. Returns { amplitudeRef, playWithAmplitude }.
 * amplitudeRef.current is 0–1, updated every frame while audio plays.
 */
export function useAudioAmplitude() {
  const amplitudeRef = useRef(0);

  const playWithAmplitude = useCallback(async (audioElement) => {
    if (!audioElement) return false;

    if (!sharedAudioCtx) {
      sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const ctx = sharedAudioCtx;
    if (ctx.state === 'suspended') {
      await ctx.resume().catch(() => {});
    }

    try {
      const source = ctx.createMediaElementSource(audioElement);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.75;
      source.connect(analyser);
      analyser.connect(ctx.destination);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let rafId;

      const update = () => {
        rafId = requestAnimationFrame(update);
        analyser.getByteFrequencyData(dataArray);
        const sum = dataArray.reduce((s, v) => s + v * v, 0);
        const rms = Math.sqrt(sum / dataArray.length) / 128;
        amplitudeRef.current = Math.min(1, rms * 2.5);
      };
      update();

      const cleanup = () => {
        cancelAnimationFrame(rafId);
        amplitudeRef.current = 0;
        try {
          source.disconnect();
          analyser.disconnect();
        } catch (e) {
          // Ignore disconnection errors if context state changed
        }
        audioElement.removeEventListener("ended", cleanup);
        audioElement.removeEventListener("pause", cleanup);
      };

      audioElement.addEventListener("ended", cleanup);
      audioElement.addEventListener("pause", cleanup);

      return true;
    } catch (error) {
      console.warn("Web Audio binding failed (likely already connected):", error);
      // Fallback: just play the audio without amplitude tracking if binding fails
      return false;
    }
  }, []);

  return { amplitudeRef, playWithAmplitude };
}
