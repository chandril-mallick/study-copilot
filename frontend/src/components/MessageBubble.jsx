// MessageBubble Component - Premium glassmorphism message display with markdown support

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { User, Bot, Copy, Check, FileText } from 'lucide-react';
import CodeBlock from './CodeBlock';

const MessageBubble = ({ message, index }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.type === 'user';
  const isAI = message.type === 'ai';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = () => {
    const date = message.timestamp ? new Date(message.timestamp) : new Date();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={`flex gap-3 animate-fade-in-up ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
          isUser
            ? 'bg-gradient-to-br from-blue-500 to-blue-600'
            : 'bg-gradient-to-br from-purple-500 to-purple-600'
        }`}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Message Bubble */}
        <div
          className={`group relative px-4 py-3 rounded-2xl backdrop-blur-lg border transition-all duration-300 hover:shadow-lg ${
            isUser
              ? 'bg-gradient-to-br from-blue-500/90 to-blue-600/90 border-blue-400/30 text-white rounded-br-sm shadow-blue-500/20'
              : 'bg-white/10 border-white/20 text-white rounded-tl-sm shadow-purple-500/10'
          }`}
        >
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={`absolute top-2 ${isUser ? 'left-2' : 'right-2'} opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-black/20 hover:bg-black/30`}
            title="Copy message"
          >
            {copied ? (
              <Check className="w-3 h-3 text-green-300" />
            ) : (
              <Copy className="w-3 h-3 text-white/70" />
            )}
          </button>

          {/* Message Content with Markdown */}
          <div className="prose prose-invert prose-sm max-w-none">
            {isAI ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <CodeBlock
                        language={match[1]}
                        value={String(children).replace(/\n$/, '')}
                        {...props}
                      />
                    ) : (
                      <code className="px-1.5 py-0.5 bg-black/30 rounded text-sm font-mono" {...props}>
                        {children}
                      </code>
                    );
                  },
                  p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="ml-2">{children}</li>,
                  h1: ({ children }) => <h1 className="text-xl font-bold mb-2 mt-4 first:mt-0">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base font-bold mb-2 mt-2 first:mt-0">{children}</h3>,
                  strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-purple-400 pl-4 italic my-2">{children}</blockquote>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            ) : (
              <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
            )}
          </div>

          {/* Sources */}
          {isAI && message.sources?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="text-xs font-semibold text-purple-300 mb-2 flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Sources
              </p>
              <div className="space-y-1">
                {message.sources.map((src, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                    <span className="text-purple-400">•</span>
                    <span>{src.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-gray-400 mt-1 px-2">
          {formatTime()}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
