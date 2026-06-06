'use client';

import { useState } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  readOnly?: boolean;
}

const LANGUAGE_MAP: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  jsx: 'javascript',
  py: 'python',
  rb: 'ruby',
  sh: 'shell',
  bash: 'shell',
  zsh: 'shell',
  yml: 'yaml',
  yaml: 'yaml',
  md: 'markdown',
  rs: 'rust',
  go: 'go',
  java: 'java',
  cs: 'csharp',
  cpp: 'cpp',
  c: 'c',
  php: 'php',
  sql: 'sql',
  json: 'json',
  html: 'html',
  css: 'css',
  scss: 'scss',
};

function resolveLanguage(lang?: string): string {
  if (!lang) return 'plaintext';
  const normalized = lang.toLowerCase().trim();
  return LANGUAGE_MAP[normalized] ?? normalized;
}

const MAX_HEIGHT = 400;
const MIN_HEIGHT = 120;

export function CodeEditor({ value, onChange, language, readOnly = false }: CodeEditorProps) {
  const [copied, setCopied] = useState(false);
  const [editorHeight, setEditorHeight] = useState(MIN_HEIGHT);

  const monacoLanguage = resolveLanguage(language);
  const displayLanguage = language?.trim() || 'plaintext';

  function handleCopy() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  }

  const handleMount: OnMount = (editor) => {
    const updateHeight = () => {
      const contentHeight = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, editor.getContentHeight() + 16));
      setEditorHeight(contentHeight);
    };
    updateHeight();
    editor.onDidContentSizeChange(updateHeight);
  };

  return (
    <div className="rounded-lg overflow-hidden border border-border">
      <div className="flex items-center justify-between px-3 py-2 bg-[#1e1e1e]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-xs text-[#858585] font-medium">{displayLanguage}</span>
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
      <Editor
        height={editorHeight}
        language={monacoLanguage}
        value={value}
        theme="vs-dark"
        onChange={(v) => onChange?.(v ?? '')}
        onMount={handleMount}
        loading={<div className="bg-[#1e1e1e]" style={{ height: MIN_HEIGHT }} />}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          padding: { top: 8, bottom: 8 },
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
            verticalScrollbarSize: 6,
            horizontalScrollbarSize: 6,
            useShadows: false,
          },
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          renderLineHighlight: readOnly ? 'none' : 'line',
          contextmenu: false,
          folding: false,
          lineDecorationsWidth: 8,
          automaticLayout: true,
        }}
      />
    </div>
  );
}
