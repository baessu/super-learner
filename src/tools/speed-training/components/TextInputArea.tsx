/**
 * TextInputArea.tsx
 * 텍스트 입력 영역 컴포넌트
 */

import { useState, useRef } from 'react';
import { Upload, FileText, Sparkles } from 'lucide-react';
import { SAMPLE_TEXT } from '../constants';

interface TextInputAreaProps {
  onTextSubmit: (text: string) => void;
}

export function TextInputArea({ onTextSubmit }: TextInputAreaProps) {
  const [text, setText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setText(content);
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleUseSample = () => {
    setText(SAMPLE_TEXT);
  };

  const handleSubmit = () => {
    if (text.trim()) {
      onTextSubmit(text);
    }
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="w-full space-y-4">
      {/* Textarea */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="훈련할 텍스트를 붙여넣으세요..."
          className="w-full h-64 p-4 text-gray-800 bg-white border-2 border-gray-200 rounded-2xl resize-none focus:outline-none focus:border-amber-400 transition-colors"
        />
        <div className="absolute bottom-3 right-3 text-sm text-gray-400">
          {wordCount.toLocaleString()} 단어
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        {/* File upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.md"
          onChange={handleFileUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>파일 업로드</span>
        </button>

        {/* Sample text */}
        <button
          onClick={handleUseSample}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
        >
          <FileText className="w-4 h-4" />
          <span>샘플 텍스트</span>
        </button>

        {/* Start button */}
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-medium rounded-xl transition-all disabled:cursor-not-allowed"
        >
          <Sparkles className="w-4 h-4" />
          <span>훈련 시작</span>
        </button>
      </div>
    </div>
  );
}
