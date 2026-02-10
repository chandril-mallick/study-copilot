import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Bot,
  Send,
  User,
  Sparkles,
  BookOpen,
  Baby,
  GraduationCap
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { studentService } from "../../../services/studentService";

const AITutorMode = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "ai",
      text:
        "Hello! I'm your AI Tutor. I can explain concepts simply, go step-by-step, or deep dive into advanced topics. What are we learning today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("explain");
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

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

  const modes = [
    { id: "eli5", label: "Explain like I'm 5", icon: Baby },
    { id: "explain", label: "Standard Tutor", icon: BookOpen },
    { id: "advanced", label: "Advanced / Deep Dive", icon: GraduationCap }
  ];

  return (
    <div className="h-full flex flex-col p-4 md:p-6 gap-4">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Bot className="w-8 h-8 text-blue-600" />
            AI Tutor Mode
          </h2>
          <p className="text-gray-500">
            Adaptive learning with context-aware explanations
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
          {modes.map((m) => {
            const Icon = m.icon;
            const active = mode === m.id;

            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition
                  ${
                    active
                      ? "bg-white dark:bg-gray-700 text-blue-600 shadow ring-1 ring-blue-500/20"
                      : "text-gray-500 hover:text-gray-900 dark:text-gray-400"
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Card */}
      <Card className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-800 border shadow-xl rounded-2xl">

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div className="flex gap-3 max-w-[80%]">
                <Avatar className="w-9 h-9">
                  <AvatarFallback
                    className={
                      msg.role === "user"
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-blue-100 text-blue-600"
                    }
                  >
                    {msg.role === "user" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                  </AvatarFallback>
                </Avatar>

                <div
                  className={`p-4 rounded-2xl text-sm shadow-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
                      : msg.isError
                      ? "bg-red-50 text-red-600 border"
                      : "bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border"
                  }`}
                >
                  {msg.role === "ai" ? (
                    <div className="prose dark:prose-invert max-w-none">
                      <ReactMarkdown>
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <Avatar>
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  <Sparkles className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 border rounded-2xl p-4">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75" />
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-gray-50/80 dark:bg-gray-900/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-3 max-w-4xl mx-auto"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
              placeholder={`Ask using ${
                modes.find((m) => m.id === mode)?.label
              } mode…`}
              className="h-12 text-base"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isTyping}
              className="h-12 w-12 bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>

          {/* Quick Prompts */}
          <div className="flex gap-2 mt-3 justify-center overflow-x-auto">
            <button
              onClick={() =>
                setInput("Explain simple harmonic motion")
              }
              className="px-3 py-1.5 rounded-full border bg-white dark:bg-gray-800 text-xs"
            >
              ⚛️ Simple Harmonic Motion
            </button>
            <button
              onClick={() =>
                setInput("How does a neural network learn?")
              }
              className="px-3 py-1.5 rounded-full border bg-white dark:bg-gray-800 text-xs"
            >
              🧠 Neural Networks
            </button>
            <button
              onClick={() =>
                setInput("Tips for writing a great essay")
              }
              className="px-3 py-1.5 rounded-full border bg-white dark:bg-gray-800 text-xs"
            >
              ✍️ Essay Writing
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AITutorMode;
