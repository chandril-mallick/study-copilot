import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

const GlobalSearch = ({ isOpen, onClose, onSearch }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsSearching(true);
    // Simulate search
    setTimeout(() => {
      setIsSearching(false);
      if (onSearch) {
        onSearch(query);
      }
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Search Modal */}
      <div className="relative w-full max-w-2xl glass-card rounded-card-lg p-6 animate-fade-in">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-2 rounded-lg bg-neon-blue/20">
            <Sparkles className="h-5 w-5 text-neon-blue" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-heading font-semibold text-white">
              Ask Dabba AI
            </h2>
            <p className="text-sm text-gray-400">
              Search across all courses, materials, and knowledge base
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-charcoal-light/50 transition-colors"
            aria-label="Close search"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about your courses, assignments, or materials..."
              className={cn(
                "w-full pl-12 pr-4 py-4 rounded-card",
                "bg-charcoal-light/50 border border-charcoal-light/30",
                "text-white placeholder-gray-500",
                "focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-neon-blue",
                "transition-all"
              )}
            />
            {isSearching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader2 className="h-5 w-5 text-neon-blue animate-spin" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-400">Quick searches:</span>
            {['Assignment due dates', 'Course materials', 'Study groups', 'Grades'].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setQuery(suggestion)}
                className="px-3 py-1 text-xs rounded-full glass hover:bg-neon-blue/20 hover:text-neon-blue transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
};

export default GlobalSearch;

