import React from 'react';

const Footer = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 rounded-xl shadow-lg p-4 sm:p-6 mt-6 sm:mt-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-2xl">🎓</span>
          <h3 className="text-lg sm:text-xl font-bold text-white">Brainware University</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="text-blue-100 text-sm font-medium">🏛️ Institution</p>
            <p className="text-white text-xs">Brainware University</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="text-blue-100 text-sm font-medium">🤖 AI Assistant</p>
            <p className="text-white text-xs">Dabba AI</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="text-blue-100 text-sm font-medium">⚡ Powered By</p>
            <p className="text-white text-xs">Ollama (gemma3:1b)</p>
          </div>
        </div>
        <div className="border-t border-white/20 pt-3">
          <p className="text-blue-100 text-xs sm:text-sm">
            Built with Dabba AI × Brainware University © ABOUT TECH 
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
