export const googleTtsService = {
  speak: async (text) => {
    try {
      if (!text) return null;
      
      // Basic Markdown and Symbol Stripping for cleaner TTS
      const cleanText = text
        .substring(0, 200) // Google TTS limit
        .replace(/[*_#`~]/g, '') // Remove markdown symbols
        .trim();

      if (!cleanText) return null;

      // Use the correct Google TTS endpoint for audio
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=en-IN&client=tw-ob&ttsspeed=1`;
      
      const audio = new Audio(ttsUrl);
      
      return new Promise((resolve) => {
        audio.oncanplaythrough = () => resolve(audio);
        audio.onerror = () => resolve(null); // Silent fail to trigger fallback
        // Safety timeout
        setTimeout(() => resolve(null), 2500);
      });
    } catch (error) {
      console.error("Google TTS Service Error:", error);
      return null;
    }
  }
};
