'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface MarkdownEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
}

const MAX_HEIGHT = 400;
const MIN_HEIGHT = 120;

export function MarkdownEditor({
  value,
  onChange,
  readOnly = false,
  placeholder = 'Write markdown here…',
}: MarkdownEditorProps) {
  const [tab, setTab] = useState<'write' | 'preview'>(readOnly ? 'preview' : 'write');
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-lg overflow-hidden border border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#2d2d2d]">
        <div className="flex items-center gap-1">
          {!readOnly && (
            <button
              type="button"
              onClick={() => setTab('write')}
              className={`text-xs px-2.5 py-1 rounded transition-colors ${
                tab === 'write'
                  ? 'bg-white/15 text-[#cccccc]'
                  : 'text-[#858585] hover:text-[#cccccc]'
              }`}
            >
              Write
            </button>
          )}
          <button
            type="button"
            onClick={() => setTab('preview')}
            className={`text-xs px-2.5 py-1 rounded transition-colors ${
              tab === 'preview'
                ? 'bg-white/15 text-[#cccccc]'
                : 'text-[#858585] hover:text-[#cccccc]'
            }`}
          >
            Preview
          </button>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-[#858585] hover:text-[#cccccc] transition-colors px-1.5 py-0.5 rounded hover:bg-white/10"
          title="Copy to clipboard"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Write tab */}
      {tab === 'write' && !readOnly && (
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          style={{ minHeight: MIN_HEIGHT, maxHeight: MAX_HEIGHT }}
          className="w-full resize-y bg-[#1e1e1e] text-[#cccccc] text-sm font-mono p-3 outline-none placeholder:text-[#555] overflow-auto"
        />
      )}

      {/* Preview tab */}
      {tab === 'preview' && (
        <div
          style={{ minHeight: MIN_HEIGHT, maxHeight: MAX_HEIGHT }}
          className="overflow-auto bg-[#1e1e1e] p-3"
        >
          {value.trim() ? (
            <div className="markdown-preview">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-[#555] text-sm italic">Nothing to preview.</p>
          )}
        </div>
      )}
    </div>
  );
}
