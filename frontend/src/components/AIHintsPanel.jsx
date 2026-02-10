import React, { useState } from 'react';
import { Lightbulb, Loader2, Sparkles, X, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { studentService } from '../services/studentService';
import { handleApiError } from '../utils/errorHandler';

const AIHintsPanel = ({ assignmentId, question, context, onClose }) => {
  const [hints, setHints] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hintLevel, setHintLevel] = useState(1); // Progressive hint levels

  const fetchHints = async () => {
    if (!question.trim()) {
      setError('Please enter a question to get hints');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await studentService.getAssignmentHints(
        assignmentId,
        question,
        context
      );
      setHints(response.hints || response);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressiveHint = () => {
    if (!hints) return null;
    
    // Split hints into levels (simple implementation)
    const hintText = typeof hints === 'string' ? hints : hints.toString();
    const sentences = hintText.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    if (hintLevel === 1) {
      return sentences.slice(0, 2).join('. ') + '.';
    } else if (hintLevel === 2) {
      return sentences.slice(0, 4).join('. ') + '.';
    } else {
      return hintText;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="glass-card rounded-card-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-card bg-neon-blue/20">
              <Sparkles className="h-5 w-5 text-neon-blue" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-semibold text-white">
                AI Hints Assistant
              </h3>
              <p className="text-sm text-gray-400">
                Get plagiarism-safe guidance (not direct answers)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-charcoal-light/50 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Question Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            What do you need help with?
          </label>
          <textarea
            value={question}
            onChange={(e) => {
              // Controlled by parent, but we can show placeholder
            }}
            placeholder="Enter your question or describe what you're stuck on..."
            className={cn(
              "w-full px-4 py-3 rounded-card",
              "bg-charcoal-light/50 border border-charcoal-light/30",
              "text-white placeholder-gray-500",
              "focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-neon-blue",
              "resize-none"
            )}
            rows={3}
            readOnly
          />
        </div>

        {/* Context (if provided) */}
        {context && (
          <div className="mb-4 p-3 rounded-card bg-charcoal-light/30 border border-charcoal-light/20">
            <p className="text-xs text-gray-400 mb-1">Your current understanding:</p>
            <p className="text-sm text-gray-300">{context}</p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 rounded-card bg-red-500/20 border border-red-500/30 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Get Hints Button */}
        {!hints && (
          <button
            onClick={fetchHints}
            disabled={isLoading || !question.trim()}
            className={cn(
              "w-full py-3 rounded-card font-medium",
              "bg-gradient-to-r from-neon-blue to-emerald-DEFAULT",
              "text-white hover:shadow-neon",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-all duration-200",
              "flex items-center justify-center gap-2"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Getting hints...</span>
              </>
            ) : (
              <>
                <Lightbulb className="h-5 w-5" />
                <span>Get AI Hints</span>
              </>
            )}
          </button>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-3">
            <div className="shimmer h-4 rounded w-full" />
            <div className="shimmer h-4 rounded w-5/6" />
            <div className="shimmer h-4 rounded w-4/6" />
          </div>
        )}

        {/* Hints Display */}
        {hints && !isLoading && (
          <div className="space-y-4">
            <div className="p-4 rounded-card bg-emerald-DEFAULT/10 border border-emerald-DEFAULT/20">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-emerald-DEFAULT flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-2">AI-Generated Hints</h4>
                  <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {getProgressiveHint()}
                  </div>
                </div>
              </div>
            </div>

            {/* Progressive Hint Levels */}
            {typeof hints === 'string' && hints.split(/[.!?]+/).filter(s => s.trim().length > 10).length > 2 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Hint Level:</span>
                <div className="flex gap-2">
                  {[1, 2, 3].map((level) => (
                    <button
                      key={level}
                      onClick={() => setHintLevel(level)}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                        hintLevel === level
                          ? "bg-neon-blue text-white"
                          : "bg-charcoal-light/30 text-gray-400 hover:bg-charcoal-light/50"
                      )}
                    >
                      Level {level}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Reminder */}
            <div className="p-3 rounded-card bg-amber-500/10 border border-amber-500/20">
              <p className="text-xs text-amber-400 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Remember:</strong> These hints guide your thinking. Write your answer in your own words to avoid plagiarism.
                </span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={fetchHints}
                className="flex-1 py-2 rounded-card bg-charcoal-light/30 hover:bg-charcoal-light/50 text-white text-sm font-medium transition-colors"
              >
                Get More Hints
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2 rounded-card bg-neon-blue hover:bg-neon-blue-dark text-white text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIHintsPanel;

