import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../lib/utils';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const colors = {
    success: 'bg-emerald-DEFAULT/20 border-emerald-DEFAULT/50 text-emerald-DEFAULT',
    error: 'bg-red-500/20 border-red-500/50 text-red-400',
    warning: 'bg-amber-500/20 border-amber-500/50 text-amber-500',
    info: 'bg-neon-blue/20 border-neon-blue/50 text-neon-blue',
  };

  const Icon = icons[type];

  return (
    <div
      className={cn(
        "fixed top-20 right-4 z-[65] min-w-[300px] max-w-md",
        "glass-card rounded-card-lg p-4 border",
        colors[type],
        "animate-slide-in-right shadow-lg"
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;

