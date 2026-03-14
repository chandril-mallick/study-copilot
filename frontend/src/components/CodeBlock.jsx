// CodeBlock Component - Syntax highlighted code with copy button

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Terminal } from 'lucide-react';

const CodeBlock = ({ language, value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-6 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#282c34]/80 backdrop-blur-md px-4 py-2.5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-widest leading-none pt-0.5">
            {language || 'code'}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-md transition-all duration-200 border border-white/5"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-green-400" />
              <span>COPIED</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-cyan-400" />
              <span>COPY</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="text-sm">
        <SyntaxHighlighter
          language={language || 'text'}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: '1.25rem',
            background: '#1e2127',
            fontSize: '0.85rem',
            lineHeight: '1.6',
            fontFamily: '"Fira Code", "JetBrains Mono", monospace'
          }}
          showLineNumbers={true}
          lineNumberStyle={{
            minWidth: '2.5em',
            paddingRight: '1em',
            color: '#4b5263',
            textAlign: 'right',
            userSelect: 'none'
          }}
          wrapLongLines={true}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock;
