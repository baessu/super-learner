/**
 * DictionaryTab.tsx
 * 단어 사전 관리 UI
 */

import { useState, useMemo } from 'react';
import { Plus, Trash2, Search, RotateCcw, AlertCircle, Check } from 'lucide-react';
import { useMajorSystemStore } from '../useMajorSystemStore';

// Coral 테마 색상
const CORAL = {
  primary: '#E87C63',
  light: '#FEF2F0',
  hover: '#D66B53',
  border: '#FADAD4',
};

/**
 * 단어 추가 폼 컴포넌트
 */
function AddWordForm() {
  const [word, setWord] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { addWord, calculateNumberCode } = useMajorSystemStore();

  const previewCode = useMemo(() => {
    if (!word.trim()) return '';
    return calculateNumberCode(word);
  }, [word, calculateNumberCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim()) return;

    const success = addWord(word);
    if (success) {
      setMessage({ type: 'success', text: `"${word}" 추가됨` });
      setWord('');
    } else {
      setMessage({ type: 'error', text: '이미 존재하는 단어입니다' });
    }

    setTimeout(() => setMessage(null), 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="새 단어 입력"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E87C63] focus:ring-2 focus:ring-[#E87C63]/20 transition-all pr-20"
          />
          {previewCode && (
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 font-mono font-bold text-sm px-2 py-0.5 rounded"
              style={{ backgroundColor: CORAL.light, color: CORAL.primary }}
            >
              → {previewCode}
            </span>
          )}
        </div>
        <button
          type="submit"
          disabled={!word.trim()}
          className="flex items-center justify-center gap-2 px-5 py-2.5 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: CORAL.primary }}
        >
          <Plus className="w-4 h-4" />
          추가
        </button>
      </div>

      {/* 메시지 표시 */}
      {message && (
        <div
          className={`
            mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-sm
            ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}
          `}
        >
          {message.type === 'success' ? (
            <Check className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {message.text}
        </div>
      )}
    </form>
  );
}

/**
 * 사전 탭 메인 컴포넌트
 */
export function DictionaryTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const { dictionary, removeWord, clearDictionary, resetDictionaryToDefault } =
    useMajorSystemStore();

  // 검색 필터링
  const filteredDictionary = useMemo(() => {
    if (!searchQuery.trim()) return dictionary;

    const query = searchQuery.trim().toLowerCase();
    const isNumberSearch = /^\d+$/.test(query);

    return dictionary.filter((entry) => {
      if (isNumberSearch) {
        return entry.numberCode.includes(query);
      }
      return entry.word.includes(query);
    });
  }, [dictionary, searchQuery]);

  const handleClear = () => {
    if (window.confirm('모든 단어를 삭제하시겠습니까?')) {
      clearDictionary();
    }
  };

  const handleReset = () => {
    if (window.confirm('사전을 기본값으로 복원하시겠습니까?\n현재 추가한 단어들이 삭제됩니다.')) {
      resetDictionaryToDefault();
    }
  };

  const handleDelete = (id: string, word: string) => {
    if (window.confirm(`"${word}"를 삭제하시겠습니까?`)) {
      removeWord(id);
    }
  };

  return (
    <div className="space-y-4">
      {/* 단어 추가 폼 */}
      <AddWordForm />

      {/* 검색 및 액션 바 */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* 검색 */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="단어 또는 숫자로 검색"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E87C63] focus:ring-2 focus:ring-[#E87C63]/20 transition-all"
          />
        </div>

        {/* 액션 버튼들 */}
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            기본값
          </button>
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            전체 삭제
          </button>
        </div>
      </div>

      {/* 통계 */}
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>총 {dictionary.length}개 단어</span>
        {searchQuery && (
          <span style={{ color: CORAL.primary }}>
            {filteredDictionary.length}개 검색됨
          </span>
        )}
      </div>

      {/* 단어 목록 테이블 */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* 테이블 헤더 */}
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-3 text-center">숫자코드</div>
          <div className="col-span-6">단어</div>
          <div className="col-span-2 text-center">삭제</div>
        </div>

        {/* 단어 목록 */}
        <div className="max-h-[400px] overflow-y-auto">
          {filteredDictionary.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 mb-1">
                {searchQuery ? '검색 결과가 없습니다' : '단어가 없습니다'}
              </p>
              <p className="text-sm text-gray-400">
                {searchQuery ? '다른 검색어를 시도해보세요' : '새 단어를 추가해보세요'}
              </p>
            </div>
          ) : (
            filteredDictionary.map((entry, index) => (
              <div
                key={entry.id}
                className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors items-center"
              >
                <div className="col-span-1 text-center text-sm text-gray-400">
                  {index + 1}
                </div>
                <div className="col-span-3 text-center">
                  <span
                    className="inline-block px-3 py-1 rounded-lg font-mono font-bold text-sm"
                    style={{ backgroundColor: CORAL.light, color: CORAL.primary }}
                  >
                    {entry.numberCode || '-'}
                  </span>
                </div>
                <div className="col-span-6 font-medium text-gray-800">
                  {entry.word}
                </div>
                <div className="col-span-2 text-center">
                  <button
                    onClick={() => handleDelete(entry.id, entry.word)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
