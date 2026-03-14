// TypingIndicator Component - Animated dots for AI thinking state

import React from 'react';
import DabbaBotLogo from './DabbaBotLogo';

const TypingIndicator = () => {
  return (
    <div className="flex items-start gap-3">
      {/* AI Avatar - matches MessageBubble */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-[#161b22] border border-white/10">
        <DabbaBotLogo iconOnly className="scale-75" />
      </div>

      {/* Typing Animation - matches AI bubble style */}
      <div className="flex items-center gap-2 px-5 py-4 bg-[#21262d] border border-white/5 rounded-2xl rounded-bl-md">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
