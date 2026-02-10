import React from 'react';
import { LogOut } from 'lucide-react';

const Header = ({ isDark, setIsDark, onLogout }) => {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Just logo image, no object container */}
            <img
              src="/download-removebg-preview (1).png"
              alt="Dabba AI Logo"
              className="w-12 h-12 sm:w-14 sm:h-14"
            />
            <div className="text-left">
              <h1 className="text-2xl sm:text-4xl font-bold text-white mb-1 flex items-center gap-2">
                Dabba AI
                <span className="bg-yellow-400 text-blue-900 px-2 py-1 rounded-full text-xs font-semibold">
                  Brainware University
                </span>
              </h1>
              <p className="text-blue-100 text-xs sm:text-base mb-2">
                Your AI-powered study assistant
              </p>
              <div className="flex items-center gap-2 text-blue-200 text-xs">
                <span className="bg-white/20 px-2 py-1 rounded-full">🏛️ Brainware University</span>
                <span className="bg-white/20 px-2 py-1 rounded-full">🤖 AI Assistant</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsDark(v => !v)}
              aria-pressed={isDark}
              title="Toggle dark mode"
              className="shrink-0 inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm px-3 py-2 text-xs sm:text-sm text-white hover:bg-white/20 transition-all duration-200"
            >
              {isDark ? '🌙' : '☀️'}
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                title="Switch Role"
                className="shrink-0 inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm px-3 py-2 text-xs sm:text-sm text-white hover:bg-red-500/20 hover:border-red-400/50 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Switch Role</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
