import React, { useState } from 'react';
import { MessageCircle, X, Minimize2 } from 'lucide-react';
import { cn } from '../lib/utils';

const FloatingChatButton = ({ onToggle, isOpen }) => {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[55]",
        "w-12 h-12 sm:w-14 sm:h-14 rounded-full",
        "bg-gradient-to-br from-neon-blue to-emerald-DEFAULT",
        "shadow-neon hover:shadow-neon-emerald",
        "flex items-center justify-center",
        "transition-all duration-300",
        "hover:scale-110 active:scale-95",
        "group",
        isOpen && "rotate-90"
      )}
      aria-label="Toggle AI Chat"
    >
      {isOpen ? (
        <X className="h-6 w-6 text-white transition-transform" />
      ) : (
        <MessageCircle className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
      )}
      {!isOpen && (
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-DEFAULT border-2 border-onyx animate-pulse-neon" />
      )}
    </button>
  );
};

export default FloatingChatButton;

