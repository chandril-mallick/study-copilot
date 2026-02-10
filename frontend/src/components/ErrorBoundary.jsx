import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[400px] p-6">
          <div className="glass-card rounded-card-lg p-8 max-w-md w-full text-center">
            <div className="mb-4 flex justify-center">
              <div className="p-4 rounded-full bg-red-500/20">
                <AlertCircle className="h-12 w-12 text-red-400" />
              </div>
            </div>
            <h2 className="text-xl font-heading font-bold text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-400 mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-card",
                "bg-neon-blue hover:bg-neon-blue-dark text-white",
                "transition-colors font-medium"
              )}
            >
              <RefreshCw className="h-4 w-4" />
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

