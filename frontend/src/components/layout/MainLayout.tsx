import { useState, useCallback, useRef, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import useChatStore from '../../store/useChatStore';
import type { UploadedFile, ToastData, UserRole } from '../../types';
import Scene3DBackground from '../Scene3DBackground';

const API_BASE_URL = 'http://localhost:8000';

interface MainLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  appBar: React.ReactNode;
  floatingChatButton?: React.ReactNode;
  globalSearch?: React.ReactNode;
  toast?: ToastData;
  onToastClose?: () => void;
}

export function MainLayout({
  children,
  sidebar,
  appBar,
  floatingChatButton,
  globalSearch,
  toast,
  onToastClose
}: MainLayoutProps) {
  const showBackground = useChatStore(state => state.showBackground);

  return (
    <div className="app-reveal">
      {appBar}
      
      <div className="relative flex z-10 w-full overflow-hidden">
        {sidebar}
        <main 
          className="flex-1 transition-all duration-300"
          style={{ marginLeft: 'var(--sidebar-w, 0)', height: 'calc(100vh - 4rem)', overflow: 'auto' }}
        >
          <style>{`
            @media (min-width: 1024px) {
              :root { --sidebar-w: 256px; }
            }
            @media (max-width: 1023px) {
              :root { --sidebar-w: 0px; }
            }
          `}</style>
          {children}
        </main>
      </div>
      
      {floatingChatButton}
      {globalSearch}
      
      {toast && (
        <div
          role="alert"
          aria-live="polite"
          className="fixed bottom-4 right-4 z-50"
        >
          {/* Toast component would go here */}
        </div>
      )}
    </div>
  );
}

interface FileUploadAreaProps {
  uploadedFiles: UploadedFile[];
  isUploading: boolean;
  onUpload: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  onToast: (toast: ToastData) => void;
}

export function FileUploadArea({
  uploadedFiles,
  isUploading,
  onUpload,
  onToast
}: FileUploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div 
      className="space-y-4"
      role="region"
      aria-label="File upload section"
    >
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isUploading 
            ? 'border-gray-600 bg-gray-800/50 cursor-not-allowed' 
            : 'border-gray-600 hover:border-blue-500 hover:bg-gray-800/30'
          }
        `}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={isUploading ? 'Uploading files, please wait' : 'Click to upload files, or drag and drop'}
        aria-disabled={isUploading}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt"
          onChange={onUpload}
          className="hidden"
          aria-hidden="true"
          disabled={isUploading}
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center gap-2" role="status" aria-live="polite">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <svg 
              className="w-12 h-12 text-gray-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-gray-400">
              Click to upload PDF or TXT files
            </p>
            <p className="text-sm text-gray-500">
              Maximum file size: 10MB
            </p>
          </div>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <section aria-label="Uploaded files list">
          <h3 className="text-lg font-medium mb-3">Uploaded Files</h3>
          <ul className="space-y-2" role="list">
            {uploadedFiles.map((file, index) => (
              <li 
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg"
                role="listitem"
              >
                <svg 
                  className="w-5 h-5 text-blue-500 flex-shrink-0" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {file.type} • {file.chunks} chunks • {file.uploadTime}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  isLoading?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  placeholder = 'Type your message...',
  disabled = false
}: ChatInputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled && !isLoading) {
        onSubmit(e as unknown as FormEvent);
      }
    }
  };

  return (
    <form 
      onSubmit={onSubmit}
      className="flex items-end gap-2 p-4 border-t border-gray-700"
      role="form"
      aria-label="Chat message form"
    >
      <div className="flex-1 relative">
        <textarea
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          rows={1}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Message input"
          aria-describedby="chat-hint"
          aria-busy={isLoading}
        />
        <span id="chat-hint" className="sr-only">
          Press Enter to send, Shift+Enter for new line
        </span>
      </div>
      
      <button
        type="submit"
        disabled={disabled || isLoading || !value.trim()}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors duration-200 flex items-center gap-2"
        aria-label={isLoading ? 'Sending message...' : 'Send message'}
      >
        {isLoading ? (
          <div 
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" 
            aria-hidden="true"
          />
        ) : (
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        )}
        <span className="sr-only md:not-sr-only">Send</span>
      </button>
    </form>
  );
}

interface TabContentProps {
  activeTab: string;
  children: (tab: string) => React.ReactNode;
}

export function TabContent({ activeTab, children }: TabContentProps) {
  return (
    <div role="tabpanel" aria-live="polite">
      {children(activeTab)}
    </div>
  );
}
