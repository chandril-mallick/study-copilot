import React, { useState, useRef, useEffect, Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, User, Sparkles, BookOpen, Baby, GraduationCap, Volume2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { studentService } from "../../../services/studentService";
import { googleTtsService } from "../../../services/googleTtsService";
import { useAudioAmplitude } from "../../../hooks/useAudioAmplitude";
import Priya3DAvatar from "../../../components/Priya3DAvatar";
import useChatStore from "../../../store/useChatStore";

const AITutorMode = () => {
  const setShowBackground = useChatStore(state => state.setShowBackground);
  const [avatarVisible, setAvatarVisible] = useState(false);

  useEffect(() => {
    // Disable global background when 3D Tutor is active to save WebGL resources
    setShowBackground(false);
    
    // Higher delay (300ms) before showing avatar to ensure background is detached
    const timer = setTimeout(() => setAvatarVisible(true), 300);
    
    return () => {
      setShowBackground(true);
      clearTimeout(timer);
    };
  }, [setShowBackground]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "ai",
      text:
        "Namaste! I'm Priya, your personal AI Tutor. I'm here to help you understand complex concepts with ease. What shall we explore today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("explain");
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showTutor, setShowTutor] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const scrollRef = useRef(null);
  const { amplitudeRef, playWithAmplitude } = useAudioAmplitude();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Preload voices
  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", text: userText }
    ]);

    setInput("");
    setIsTyping(true);

    try {
      const result = await studentService.chatWithTutor(
        userText,
        mode,
        currentSessionId
      );

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          text: result.response
        }
      ]);

      if (result.session_id) {
        setCurrentSessionId(result.session_id);
      }
    } catch (error) {
      console.error("AI Tutor Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          text: "⚠️ I'm having trouble right now. Please try again later.",
          isError: true
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const speakText = async (text) => {
    try {
      setIsSpeaking(true);
      const googleAudio = await googleTtsService.speak(text);
      if (googleAudio) {
        googleAudio.onended = () => setIsSpeaking(false);
        googleAudio.onerror = () => {
          setIsSpeaking(false);
          speakTextFallback(text);
        };
        
        const bound = await playWithAmplitude(googleAudio);
        if (!bound) {
          // If we can't bind for amplitude, still play the audio
          console.warn("Amplitude tracking failed, playing audio only.");
        }
        
        await googleAudio.play();
        return;
      }
    } catch (err) {
      console.warn("Google TTS initiation failed:", err);
    }
    speakTextFallback(text);
  };

  const speakTextFallback = (text) => {
    // 2. Fallback to Browser TTS (Robotic System Voice)
    // 2. Fallback to Browser TTS (Robotic System Voice) - silent log
    // console.log("Google TTS failed. Falling back to Browser TTS");
    if (!('speechSynthesis' in window)) return;
    
    // Cancel any ongoing speech and wait a tiny bit to avoid 'interrupted' error
    window.speechSynthesis.cancel();
    
    setTimeout(() => {
      // Basic Markdown Stripping
      const cleanText = text
        .replace(/(\*\*|__)(.*?)\1/g, "$2")
        .replace(/(\*|_)(.*?)\1/g, "$2")
        .replace(/#+\s+(.*)/g, "$1")
        .replace(/`{1,3}([\s\S]*?)`{1,3}/g, " Code sequence ")
        .replace(/\[(.*?)\]\(.*?\)/g, "$1")
        .replace(/\\\((.*?)\\\)/g, "$1")
        .replace(/\\\[([\s\S]*?)\\\]/g, "$1")
        .replace(/&nbsp;/g, " ")
        .replace(/>/g, "");

      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      const getIndianFemaleVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length === 0) return null;

        // Strict male name blacklist - expand this to be as safe as possible
        const maleNames = [
          "Rishi", "Alex", "Fred", "Daniel", "Marcus", "Junior", "Albert", 
          "Ravi", "David", "Arthur", "Thomas", "Gordon", "Oliver"
        ];
        
        // 1. Clear Indian Female voices (Priya's style)
        const indianFemaleNames = ["Veena", "Lekha", "Google हिन्दी", "Rhea", "Heera"];
        let bestVoice = voices.find(v => 
          (v.lang.includes("en-IN") || v.lang.includes("hi-IN")) && 
          indianFemaleNames.some(name => v.name.includes(name))
        );

        // 2. Any en-IN voice that is NOT in our male list and NOT the first default if it's suspicious
        if (!bestVoice) {
          bestVoice = voices.find(v => 
            v.lang.includes("en-IN") && 
            !maleNames.some(m => v.name.includes(m))
          );
        }

        // 3. Clear Female voices (Global) - Crucial for "WOMAN" voice requirement
        if (!bestVoice) {
          const femaleNames = ["Samantha", "Victoria", "Google UK English Female", "Google US English", "Microsoft Zira", "Microsoft Hazel", "Female"];
          bestVoice = voices.find(v => 
            femaleNames.some(name => v.name.includes(name)) || 
            v.name.toLowerCase().includes("female")
          );
        }

        // 4. Last resort: The most common "clear" female voice on many systems
        if (!bestVoice) {
           bestVoice = voices.find(v => v.name.includes("Samantha"));
        }

        return bestVoice || voices[0];
      };

      const selectedVoice = getIndianFemaleVoice();
      if (selectedVoice) utterance.voice = selectedVoice;

      utterance.pitch = 1.2; // Slightly higher for a "younger girl" tone
      utterance.rate = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
        if (e.error === 'interrupted') return; // Ignore expected interruptions
        console.error("Speech error:", e);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    }, 100);
  };

  const handleVoice = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const aiMessages = [...messages].reverse().find(m => m.role === "ai");
    if (aiMessages) {
      speakText(aiMessages.text);
    }
  };

  const modes = [
    { id: "eli5", label: "Explain like I'm 5", short: "ELI5", icon: Baby },
    { id: "explain", label: "Standard Tutor", short: "Standard", icon: BookOpen },
    { id: "advanced", label: "Advanced / Deep Dive", short: "Advanced", icon: GraduationCap }
  ];

  const inputRef = useRef(null);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#030712]">
      {/* Video-call layout: Priya dominant, chat overlay */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Left: 3D Tutor — main focus */}
        <div
          className={`relative flex-1 min-h-[280px] lg:min-h-0 transition-all duration-500 ${showTutor ? "lg:flex-[1.4]" : "lg:flex-[0.6]"}`}
          onClick={() => inputRef.current?.focus()}
        >
          <div className="absolute inset-0 rounded-2xl lg:rounded-3xl overflow-hidden border border-cyan-500/30 shadow-[0_0_60px_rgba(6,182,212,0.15)] bg-[#020617]">
            <div className="avatar-container">
              <div className={`avatar-glow ${isSpeaking ? "speaking" : ""}`}></div>
              {avatarVisible && (
                <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center text-white/20 font-mono text-[10px] tracking-widest uppercase">Initializing Priya...</div>}>
                  <Priya3DAvatar isSpeaking={isSpeaking} amplitudeRef={amplitudeRef} />
                </Suspense>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />
            {/* Top status bar */}
            <div className="absolute top-3 left-3 right-3 z-20 flex justify-between items-center">
              <div className="flex items-center gap-2 px-2.5 py-1 bg-red-500/25 backdrop-blur-md border border-red-500/50 rounded-full text-[10px] font-bold text-red-400 tracking-wider uppercase">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                Live
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-white/90 text-sm font-semibold">Priya</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>
            </div>
            {/* Bottom controls — overlay on video */}
            <div className="absolute bottom-0 left-0 right-0 p-4 z-20 flex items-center justify-between gap-4">
              <div>
                <p className="text-cyan-400/90 text-xs font-medium">Quest Learning Specialist</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); handleVoice(); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                    isSpeaking
                      ? "bg-red-500/90 text-white"
                      : "bg-white/15 text-white hover:bg-white/25 backdrop-blur-md"
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  {isSpeaking ? "Mute" : "Voice"}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowTutor(!showTutor); }}
                  className="px-3 py-2 rounded-xl bg-white/10 text-white/80 hover:bg-white/20 text-sm"
                >
                  {showTutor ? "Mini" : "Expand"}
                </button>
              </div>
            </div>
            {isSpeaking && (
              <div className="absolute bottom-16 right-4 flex gap-1 items-end h-6 z-20">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-cyan-400 rounded-full animate-pulse"
                    style={{
                      height: `${30 + Math.sin(Date.now() / 200 + i) * 20}%`,
                      animationDelay: `${i * 0.08}s`
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Chat panel */}
        <div className="flex flex-col w-full lg:w-[420px] lg:min-w-[380px] lg:max-w-[480px] shrink-0 border-t lg:border-t-0 lg:border-l border-white/10">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40">
            <div className="flex gap-1.5 p-1 bg-white/5 rounded-lg">
              {modes.map((m) => {
                const Icon = m.icon;
                const active = mode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    title={m.label}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition ${
                      active ? "bg-cyan-500/20 text-cyan-400" : "text-white/60 hover:text-white"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    {m.short}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-2.5 max-w-[92%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <Avatar className="w-8 h-8 shrink-0 border border-white/20">
                    {msg.role === "user" ? (
                      <AvatarFallback className="bg-cyan-500/30 text-cyan-300 text-xs">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    ) : (
                      <img
                        src="/assets/tutor/indian_lady_tutor.png"
                        alt="Priya"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </Avatar>
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-cyan-500/90 text-white"
                        : msg.isError
                        ? "bg-red-500/20 text-red-300 border border-red-500/40"
                        : "bg-white/10 text-white/95 border border-white/10"
                    }`}
                  >
                    {msg.role === "ai" ? (
                      <div className="prose prose-invert max-w-none prose-p:my-1 prose-ul:my-2 prose-li:my-0">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2.5">
                <Avatar className="w-8 h-8 shrink-0">
                  <img src="/assets/tutor/indian_lady_tutor.png" alt="" className="w-full h-full object-cover rounded-full" />
                </Avatar>
                <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-white/10 border border-white/10">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/10 bg-black/40 space-y-3">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-2"
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isTyping}
                placeholder="Ask Priya anything…"
                className="flex-1 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isTyping}
                className="h-11 w-11 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {["Simple Harmonic Motion", "Neural Networks", "Essay Writing"].map((topic) => (
                <button
                  key={topic}
                  onClick={() => setInput(topic)}
                  className="shrink-0 px-3 py-1.5 rounded-full text-xs bg-white/10 text-white/80 hover:bg-white/20 border border-white/10 transition"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pro tip banner */}
      <div className="px-4 py-2 bg-cyan-500/10 border-t border-cyan-500/20 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
        <p className="text-sm text-cyan-300/90">
          Click on Priya to focus the input • Switch to ELI5 mode for simpler explanations
        </p>
      </div>
    </div>
  );
};

export default AITutorMode;
