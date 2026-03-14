import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import type { HTMLAttributes } from 'react';

interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'secondary' | 'white';
  fullScreen?: boolean;
  text?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

const variantClasses = {
  default: 'text-gray-400',
  primary: 'text-blue-500',
  secondary: 'text-purple-500',
  white: 'text-white'
};

export function LoadingSpinner({
  size = 'md',
  variant = 'default',
  fullScreen = false,
  text,
  className,
  ...props
}: LoadingSpinnerProps) {
  const spinner = (
    <div 
      className={clsx(
        'flex flex-col items-center justify-center gap-2',
        fullScreen && 'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm',
        className
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
      {...props}
    >
      <Loader2 
        className={clsx('animate-spin', sizeClasses[size], variantClasses[variant])} 
      />
      {text && (
        <span className={clsx('text-sm', variantClasses[variant])}>
          {text}
        </span>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );

  return spinner;
}

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingOverlay({ 
  isLoading, 
  children, 
  fallback,
  text = 'Loading...',
  size = 'md'
}: LoadingOverlayProps) {
  if (!isLoading) return <>{children}</>;

  return (
    <>
      {fallback || <LoadingSpinner size={size} text={text} fullScreen />}
      <div 
        aria-hidden="true" 
        className={clsx(
          'pointer-events-none transition-opacity duration-300',
          isLoading ? 'opacity-50' : 'opacity-100'
        )}
      >
        {children}
      </div>
    </>
  );
}

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  className,
  ...props
}: SkeletonProps) {
  const variantStyles = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md'
  };

  return (
    <div
      className={clsx(
        'animate-pulse bg-gray-600/50',
        variantStyles[variant],
        className
      )}
      style={{
        width: width ?? (variant === 'circular' ? 40 : '100%'),
        height: height ?? (variant === 'text' ? 16 : variant === 'circular' ? 40 : 'auto')
      }}
      role="presentation"
      aria-label="Loading content..."
      {...props}
    />
  );
}

interface LoadingButtonProps extends HTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export function LoadingButton({
  isLoading = false,
  loadingText,
  children,
  className,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <button
      className={clsx(
        'relative inline-flex items-center justify-center gap-2',
        isLoading && 'cursor-not-allowed opacity-70',
        className
      )}
      disabled={disabled || isLoading}
      aria-disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {isLoading && loadingText ? loadingText : children}
    </button>
  );
}

interface PageLoaderProps {
  text?: string;
}

export function PageLoader({ text = 'Loading page...' }: PageLoaderProps) {
  return (
    <div 
      className="flex flex-col items-center justify-center min-h-[50vh] gap-4"
      role="status"
      aria-live="polite"
    >
      <LoadingSpinner size="xl" variant="primary" />
      <p className="text-gray-400">{text}</p>
    </div>
  );
}
