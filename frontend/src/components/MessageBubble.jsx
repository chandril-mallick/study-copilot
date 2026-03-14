// MessageBubble Component - Premium glassmorphism message display with markdown support

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { User, Copy, Check, FileText } from 'lucide-react';
import CodeBlock from './CodeBlock';
import DabbaBotLogo from './DabbaBotLogo';

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
      className={`flex gap-3 animate-fade-in-up ${isUser ? 'justify-end' : ''}`}
      style={{ animationDelay: `${index * 45}ms` }}
    >
      {!isUser && (
        /* AI Avatar - left of bubble */
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-[#161b22] border border-white/10">
          <DabbaBotLogo iconOnly className="scale-75" />
        </div>
      )}

      {/* Message Content */}
      <div className={`flex flex-col ${isUser ? 'items-end max-w-[85%] sm:max-w-[75%]' : 'min-w-0 max-w-[90%] sm:max-w-[85%]'}`}>
        {/* Message Bubble */}
        <div
          className={`group relative px-5 py-4 rounded-2xl transition-all duration-300 shadow-[0_18px_45px_rgba(15,23,42,0.85)] ${
            isUser
              ? 'bg-gradient-to-br from-[#1d4ed8] via-[#2563eb] to-[#38bdf8] text-white rounded-br-md border border-blue-400/40 hover:shadow-[0_22px_60px_rgba(37,99,235,0.9)] hover:-translate-y-0.5'
              : 'bg-[#020617]/90 backdrop-blur-2xl border border-white/8 text-gray-100 rounded-bl-md hover:border-white/20 hover:-translate-y-0.5'
          }`}
        >
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-xl bg-black/30 hover:bg-black/50 border border-white/10 shadow-lg backdrop-blur-md"
            title="Copy message"
          >
            {copied ? (
              <Check className="w-3 h-3 text-emerald-300" />
            ) : (
              <Copy className="w-3 h-3 text-white/80" />
            )}
          </button>

          {/* Message Content with Markdown */}
          <div className="prose prose-invert prose-sm max-w-none">
            {isAI ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  code({ inline, className, children, ...props }) {
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
                  p: ({ children }) => <p className="mb-3 last:mb-0 leading-[1.65] text-[15px] text-gray-100">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-outside mb-4 ml-5 space-y-1.5 [&_ul]:ml-5 [&_ul]:mt-1.5 [&_ul]:space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-outside mb-4 ml-5 space-y-1.5 [&_ol]:ml-5 [&_ol]:mt-1.5 [&_ol]:space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="pl-0.5 leading-[1.6]">{children}</li>,
                  h1: ({ children }) => <h1 className="text-xl font-semibold mb-3 mt-5 first:mt-0 text-white border-b border-white/10 pb-2">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-semibold mb-2.5 mt-5 first:mt-0 text-white/95">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base font-semibold mb-2 mt-4 first:mt-0 text-white/90">{children}</h3>,
                  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                  em: ({ children }) => <em className="italic text-gray-300">{children}</em>,
                  hr: () => <hr className="my-5 border-white/10" />,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-cyan-500 bg-cyan-500/5 px-4 py-2 italic my-4 rounded-r-lg">{children}</blockquote>
                  ),
                  table: ({ children }) => (
                    <div className="my-6 overflow-x-auto rounded-xl border border-white/10 shadow-lg bg-black/20">
                      <table className="w-full text-sm border-collapse">{children}</table>
                    </div>
                  ),
                  thead: ({ children }) => <thead className="bg-white/5">{children}</thead>,
                  th: ({ children }) => <th className="px-4 py-3 text-left font-bold text-cyan-400 border-b border-white/10">{children}</th>,
                  td: ({ children }) => <td className="px-4 py-3 border-b border-white/5 text-gray-300">{children}</td>,
                  tr: ({ children }) => <tr className="hover:bg-white/5 transition-colors">{children}</tr>,
                  a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline font-medium">
                      {children}
                    </a>
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

        {/* Avatar + Timestamp: User = below bubble (avatar + time right-aligned); AI = timestamp only below */}
        <div className={`flex items-center gap-2 mt-1.5 ${isUser ? 'justify-end' : ''}`}>
          {isUser && (
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-600 shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
          )}
          <span className="text-[10px] text-gray-500">
            {formatTime()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
