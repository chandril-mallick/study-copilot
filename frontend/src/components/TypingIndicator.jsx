// TypingIndicator Component - Animated dots for AI thinking state

import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-3">
      {/* AI Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>

      {/* Typing Animation */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl rounded-tl-sm">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <span className="text-sm text-gray-300 ml-2">AI is thinking...</span>
      </div>
    </div>
  );
};

export default TypingIndicator;
