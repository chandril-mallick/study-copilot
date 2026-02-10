// CodeBlock Component - Syntax highlighted code with copy button

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

const CodeBlock = ({ language, value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4">
      {/* Language Label */}
      <div className="flex items-center justify-between bg-slate-800 px-4 py-2 rounded-t-lg border-b border-slate-700">
        <span className="text-xs font-mono text-slate-400 uppercase">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <SyntaxHighlighter
        language={language || 'text'}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: '0 0 0.5rem 0.5rem',
          fontSize: '0.875rem',
          lineHeight: '1.5'
        }}
        showLineNumbers
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
