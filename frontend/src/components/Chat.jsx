import React, { useRef, useEffect, useState } from "react";
import useChatStore from "../store/useChatStore";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { 
  Send, 
  Download, 
  Zap, 
  Bot, 
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sigma
} from "lucide-react";
import { cn } from "../lib/utils";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import MathKeyboard from "./MathKeyboard";
import DabbaBotLogo from "./DabbaBotLogo";

// Define Flat UI Colors - Mimicking Google/Gemini Aesthetic
const GEMINI_BLUE = "text-blue-600";
const BORDER_LIGHT = "border-gray-200";

const Chat = ({
  messages,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  isLoading,
}) => {
  const { useContext, setUseContext, mathMode, setMathMode } = useChatStore();
  
  // Voice Mode State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const messagesEndRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const textAreaRef = useRef(null);
  const recognitionRef = useRef(null);
  
  // Robust auto-scroll logic
  useEffect(() => {
    const scrollContainer = scrollAreaRef.current;
    if (!scrollContainer) return;

    const isNearBottom = 
      scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight < 150;

    if (isNearBottom || messages.length > 0 && messages[messages.length - 1].type === 'user') {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(prev => prev + (prev ? " " : "") + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [setInputMessage]);

  // Handle Text-to-Speech for AI responses
  useEffect(() => {
    if (voiceEnabled && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.type === 'ai' && !lastMessage.hasBeenRead) {
         speakText(lastMessage.content);
      }
    }
  }, [messages, voiceEnabled]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleVoiceOutput = () => {
    if (voiceEnabled) {
      window.speechSynthesis.cancel();
      setVoiceEnabled(false);
      setIsSpeaking(false);
    } else {
      setVoiceEnabled(true);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Chat Conversation - DABBA AI", 14, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Exported on: ${new Date().toLocaleString()}`, 14, 30);

    let yPos = 50;
    messages.forEach((message, index) => {
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.setFont("helvetica", "bold");
      doc.text(
        `${message.type === "user" ? "You" : "AI Assistant"} - ${new Date().toLocaleTimeString()}`,
        14,
        yPos
      );

      doc.setFont("helvetica", "normal");
      const splitText = doc.splitTextToSize(message.content, 180);
      doc.text(splitText, 14, yPos + 7);

      if (message.sources?.length > 0) {
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 255);
        doc.text("Sources:", 14, yPos + 17 + splitText.length * 6);
        message.sources.forEach((source, i) => {
          doc.text(
            `• ${source.text}`,
            20,
            yPos + 27 + i * 5 + splitText.length * 6
          );
        });
        yPos += 20 + message.sources.length * 5 + splitText.length * 6;
      } else {
        yPos += 20 + splitText.length * 6;
      }

      if (yPos > 250 && index < messages.length - 1) {
        doc.addPage();
        yPos = 20;
      }
    });

    doc.save("chat_conversation.pdf");
  };

  return (
    <div className="absolute inset-0 flex flex-col w-full h-full bg-[#0A0A0A] overflow-hidden">
      {/* Header (STICKY) */}
      <div 
        className={cn(
          "flex-shrink-0 sticky top-0 w-full p-3 sm:p-4 border-b border-white/5 bg-[#0f1117]/95 backdrop-blur-md", 
          "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 z-20 h-auto sm:h-16 transition-all duration-300"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg",
              isSpeaking 
                ? "bg-gradient-to-br from-red-500 to-pink-500 animate-pulse" 
                : "bg-gradient-to-br from-purple-500 to-blue-500"
            )}>
              <DabbaBotLogo iconOnly className="scale-75" />
            </div>
            {isSpeaking && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-black"></div>
            )}
          </div>
          <div>
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
               DABBA AI
              <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
            </h3>
            <p className="text-gray-400 text-xs font-medium">Brainware University's own AI</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
           {/* Voice Toggle */}
           <button
            onClick={toggleVoiceOutput}
            className={cn(
               "p-2.5 rounded-full transition-all duration-300 shadow-lg",
               voiceEnabled 
                 ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white" 
                 : "bg-white/10 text-gray-400 hover:bg-white/20"
            )}
            title={voiceEnabled ? "Mute AI Voice" : "Enable AI Voice"}
          >
            {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          <button
            onClick={exportToPDF}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all duration-300 shadow-lg"
            title="Export PDF"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Chat Area (SCROLLABLE - fills space, only this scrolls like ChatGPT/Cursor) */}
      <div 
        ref={scrollAreaRef}
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-3 sm:px-6 py-4 sm:py-6 relative z-10 scrollbar-thin"
      >
        <div className={cn("max-w-3xl mx-auto", messages.length === 0 ? "min-h-full flex flex-col" : "space-y-6")}>
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center min-h-[60vh] px-2 sm:px-0 animate-fade-in">
              <div className="relative w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5/80 bg-[#020617]/80 backdrop-blur-2xl shadow-[0_24px_80px_rgba(15,23,42,0.95)] overflow-hidden">
                {/* Soft radial glow background */}
                <div className="pointer-events-none absolute -inset-32 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.22),transparent_60%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.18),transparent_55%)] opacity-80" />

                <div className="relative z-10 flex flex-col items-center text-center px-6 py-8 sm:px-10 sm:py-10 gap-6">
                  <div className="relative mb-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00FF88]/20 via-[#00D9FF]/10 to-purple-500/20 blur-3xl rounded-full" />
                    <DabbaBotLogo
                      iconOnly
                      className="scale-[1.8] relative z-10 drop-shadow-[0_0_24px_rgba(0,255,136,0.45)]"
                    />
                  </div>

                  <div className="space-y-3 max-w-xl">
                    <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight bg-gradient-to-r from-[#00F5A0] via-[#00D9FF] to-[#A855F7] bg-clip-text text-transparent">
                      How can I help with your studies today?
                    </h3>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                      Ask a question, paste an assignment, or describe what you are working on and DABBA AI will turn it into clear, step‑by‑step guidance.
                    </p>
                  </div>

                  <div className="mt-4 grid w-full gap-3 sm:gap-4 sm:grid-cols-3">
                    <button
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() =>
                        setInputMessage("Explain Quantum Mechanics like I'm 10 years old ")
                      }
                      className="group relative flex flex-col items-start text-left w-full rounded-2xl border border-white/10 bg-white/5/80 bg-black/40 px-4 py-3 sm:px-5 sm:py-4 hover:-translate-y-0.5 hover:border-[#00D9FF]/60 hover:bg-[#020617]/90 transition-all duration-300 shadow-[0_10px_35px_rgba(15,23,42,0.7)]"
                    >
                      <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-cyan-300/80 mb-1">
                        Concept clarity
                      </span>
                      <p className="text-sm sm:text-[15px] text-white">
                         Explain Quantum Mechanics simply
                      </p>
                    </button>

                    <button
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() =>
                        setInputMessage("Create a 5-day study plan for my upcoming exam on: ")
                      }
                      className="group relative flex flex-col items-start text-left w-full rounded-2xl border border-white/10 bg-white/5/80 bg-black/40 px-4 py-3 sm:px-5 sm:py-4 hover:-translate-y-0.5 hover:border-emerald-400/60 hover:bg-[#020617]/90 transition-all duration-300 shadow-[0_10px_35px_rgba(15,23,42,0.7)]"
                    >
                      <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-300/80 mb-1">
                        Study planning
                      </span>
                      <p className="text-sm sm:text-[15px] text-white">
                         Generate a 5-day study plan
                      </p>
                    </button>

                    <button
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() =>
                        setInputMessage("Summarize this research paper and highlight key findings: ")
                      }
                      className="group relative flex flex-col items-start text-left w-full rounded-2xl border border-white/10 bg-white/5/80 bg-black/40 px-4 py-3 sm:px-5 sm:py-4 hover:-translate-y-0.5 hover:border-purple-400/70 hover:bg-[#020617]/90 transition-all duration-300 shadow-[0_10px_35px_rgba(15,23,42,0.7)]"
                    >
                      <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-purple-300/80 mb-1">
                        Research help
                      </span>
                      <p className="text-sm sm:text-[15px] text-white">
                         Summarize a research paper
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <MessageBubble key={index} message={message} index={index} />
              ))}
              {isLoading && <TypingIndicator />}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area (FIXED AT BOTTOM - never scrolls) */}
      <div 
        className="flex-shrink-0 w-full p-4 border-t border-white/5 bg-[#0f1117]/95 backdrop-blur-xl z-20 transition-all duration-300"
      >
        <form onSubmit={handleSendMessage} className="relative max-w-4xl mx-auto flex items-end gap-3">
          
          <div className="relative flex-1">
            {mathMode ? (
              <MathKeyboard
                value={inputMessage}
                onChange={setInputMessage}
                onSend={() => handleSendMessage({ preventDefault: () => {} })}
                className="w-full pr-[96px]" // Add padding to avoid button overlap
              />
            ) : (
              <textarea
                rows={1}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={isListening ? "🎤 Listening..." : "Ask anything about your studies..."}
                className={cn(
                    "w-full resize-none pl-5 pr-24 py-4 rounded-2xl border text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all text-sm sm:text-base shadow-lg",
                    isListening 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/50 bg-red-500/10" 
                        : "border-white/20 focus:border-neon-blue focus:ring-[#00D9FF]/30 bg-white/5"
                )}
                onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = (e.target.scrollHeight) + 'px';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
            )}
             <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {/* Math Mode Toggle */}
              <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setMathMode(!mathMode)}
                  className={cn(
                      "p-2 rounded-full transition-all duration-300",
                      mathMode 
                          ? "text-[#00D9FF] bg-[#00D9FF]/20" 
                          : "text-gray-400 hover:text-[#00D9FF] hover:bg-[#00D9FF]/20"
                  )}
                  title={mathMode ? "Disable Math Mode" : "Enable Math Mode"}
              >
                  <Sigma className="h-5 w-5" />
              </button>

              {/* Mic Button */}
              <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={toggleListening}
                  className={cn(
                      "p-2 rounded-full transition-all duration-300",
                      isListening 
                          ? "text-red-400 bg-red-500/20 animate-pulse" 
                          : "text-gray-400 hover:text-[#00D9FF] hover:bg-[#00D9FF]/20"
                  )}
                  title={isListening ? "Stop Listening" : "Start Voice Input"}
              >
                  {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Send Button */}
          <button
            type="submit"
            onMouseDown={(e) => e.preventDefault()}
            disabled={!inputMessage.trim() || isLoading}
            className="p-3.5 rounded-full bg-[#00D9FF] text-black hover:bg-[#33E0FF] disabled:bg-gray-700 disabled:opacity-50 transition-all duration-300 shadow-[0_0_12px_rgba(0,217,255,0.4)]"
            title="Send Message"
          >
            {isLoading ? (
              <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="h-6 w-6" />
            )}
          </button>
        </form>
        <div className="text-center mt-2">
            {isListening && <span className="text-xs text-red-400 animate-pulse font-medium">● Recording... Speak now</span>}
            {!isListening && <p className="text-[10px] text-gray-500">
                Press Enter to send • Shift+Enter for new line
            </p>}
        </div>
      </div>
    </div>
  );
};

export default Chat;