/**
 * ConverterTab.tsx
 * 변환기 대시보드 - 4개의 기능 카드
 */

import { useState, useMemo } from 'react';
import { Hash, Type, ListOrdered, Link2, ChevronRight } from 'lucide-react';
import { useMajorSystemStore } from '../useMajorSystemStore';

// Coral 테마 색상
const CORAL = {
  primary: '#E87C63',
  light: '#FEF2F0',
  hover: '#D66B53',
  border: '#FADAD4',
};

/**
 * 카드 컨테이너 컴포넌트
 */
function FeatureCard({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: CORAL.light }}
        >
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-gray-800">{title}</h3>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

/**
 * 1. 숫자 → 단어 변환
 */
function NumberToWordCard() {
  const [input, setInput] = useState('');
  const { findWordsByNumber } = useMajorSystemStore();

  const results = useMemo(() => {
    const cleaned = input.replace(/\D/g, '');
    if (!cleaned) return [];
    return findWordsByNumber(cleaned).slice(0, 10);
  }, [input, findWordsByNumber]);

  return (
    <FeatureCard
      title="숫자 → 단어"
      description="숫자를 입력하면 매칭되는 단어를 찾습니다"
      icon={<Hash className="w-5 h-5" style={{ color: CORAL.primary }} />}
    >
      <div className="space-y-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="숫자 입력 (예: 14)"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E87C63] focus:ring-2 focus:ring-[#E87C63]/20 transition-all"
        />
        {input && (
          <div className="bg-gray-50 rounded-xl p-3">
            {results.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {results.map((entry) => (
                  <span
                    key={entry.id}
                    className="px-3 py-1.5 bg-white rounded-lg border border-gray-200 text-sm font-medium"
                  >
                    {entry.word}
                    <span className="ml-1 text-xs text-gray-400">
                      ({entry.numberCode})
                    </span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-2">
                매칭되는 단어가 없습니다
              </p>
            )}
          </div>
        )}
      </div>
    </FeatureCard>
  );
}

/**
 * 2. 단어 → 숫자 변환
 */
function WordToNumberCard() {
  const [input, setInput] = useState('');
  const { calculateNumberCode } = useMajorSystemStore();

  const numberCode = useMemo(() => {
    if (!input.trim()) return '';
    return calculateNumberCode(input);
  }, [input, calculateNumberCode]);

  return (
    <FeatureCard
      title="단어 → 숫자"
      description="한글 단어의 초성을 숫자로 변환합니다"
      icon={<Type className="w-5 h-5" style={{ color: CORAL.primary }} />}
    >
      <div className="space-y-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="한글 단어 입력 (예: 고래)"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E87C63] focus:ring-2 focus:ring-[#E87C63]/20 transition-all"
        />
        {input && numberCode && (
          <div
            className="rounded-xl p-4 text-center"
            style={{ backgroundColor: CORAL.light }}
          >
            <p className="text-xs text-gray-500 mb-1">변환 결과</p>
            <p
              className="text-3xl font-bold tracking-wider"
              style={{ color: CORAL.primary }}
            >
              {numberCode}
            </p>
          </div>
        )}
      </div>
    </FeatureCard>
  );
}

/**
 * 3. 숫자열 분할 생성기
 */
function SequenceGeneratorCard() {
  const [input, setInput] = useState('');
  const [segmentLength, setSegmentLength] = useState(2);
  const { findWordsByNumber } = useMajorSystemStore();

  const segments = useMemo(() => {
    const cleaned = input.replace(/\D/g, '');
    if (!cleaned) return [];

    const result: { segment: string; words: string[] }[] = [];
    for (let i = 0; i < cleaned.length; i += segmentLength) {
      const segment = cleaned.slice(i, i + segmentLength);
      const matches = findWordsByNumber(segment)
        .filter((e) => e.numberCode === segment)
        .slice(0, 5)
        .map((e) => e.word);
      result.push({ segment, words: matches });
    }
    return result;
  }, [input, segmentLength, findWordsByNumber]);

  return (
    <FeatureCard
      title="숫자열 분할"
      description="긴 숫자를 분할하여 각 구간의 단어를 찾습니다"
      icon={<ListOrdered className="w-5 h-5" style={{ color: CORAL.primary }} />}
    >
      <div className="space-y-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="숫자열 입력 (예: 141592)"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E87C63] focus:ring-2 focus:ring-[#E87C63]/20 transition-all"
        />

        {/* 분할 길이 선택 */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">분할 길이:</span>
          <div className="flex gap-1">
            {[2, 3].map((len) => (
              <button
                key={len}
                onClick={() => setSegmentLength(len)}
                className={`
                  px-3 py-1 rounded-lg text-sm font-medium transition-all
                  ${
                    segmentLength === len
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
                style={
                  segmentLength === len
                    ? { backgroundColor: CORAL.primary }
                    : undefined
                }
              >
                {len}자리
              </button>
            ))}
          </div>
        </div>

        {/* 결과 표시 */}
        {segments.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {segments.map((seg, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
              >
                <span
                  className="w-12 text-center font-mono font-bold text-sm px-2 py-1 rounded"
                  style={{ backgroundColor: CORAL.light, color: CORAL.primary }}
                >
                  {seg.segment}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-300" />
                <div className="flex-1 flex flex-wrap gap-1">
                  {seg.words.length > 0 ? (
                    seg.words.map((word, wIdx) => (
                      <span
                        key={wIdx}
                        className="px-2 py-0.5 bg-white rounded border border-gray-200 text-sm"
                      >
                        {word}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">매칭 없음</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </FeatureCard>
  );
}

/**
 * 4. 단어 체인 (여러 단어 → 숫자열)
 */
function WordChainCard() {
  const [input, setInput] = useState('');
  const { calculateNumberCode } = useMajorSystemStore();

  const result = useMemo(() => {
    if (!input.trim()) return { words: [], codes: [], combined: '' };

    const words = input
      .split(/[,\s]+/)
      .map((w) => w.trim())
      .filter(Boolean);
    const codes = words.map((w) => calculateNumberCode(w));
    const combined = codes.join('');

    return { words, codes, combined };
  }, [input, calculateNumberCode]);

  return (
    <FeatureCard
      title="단어 체인"
      description="여러 단어를 입력하면 연결된 숫자열을 생성합니다"
      icon={<Link2 className="w-5 h-5" style={{ color: CORAL.primary }} />}
    >
      <div className="space-y-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="단어 입력 (쉼표 또는 공백으로 구분)"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E87C63] focus:ring-2 focus:ring-[#E87C63]/20 transition-all"
        />

        {result.words.length > 0 && (
          <div className="space-y-3">
            {/* 각 단어별 변환 */}
            <div className="flex flex-wrap gap-2">
              {result.words.map((word, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm font-medium">{word}</span>
                  <span className="text-gray-400">→</span>
                  <span
                    className="font-mono font-bold text-sm"
                    style={{ color: CORAL.primary }}
                  >
                    {result.codes[idx]}
                  </span>
                </div>
              ))}
            </div>

            {/* 결합된 결과 */}
            <div
              className="rounded-xl p-4 text-center"
              style={{ backgroundColor: CORAL.light }}
            >
              <p className="text-xs text-gray-500 mb-1">결합된 숫자열</p>
              <p
                className="text-2xl font-bold tracking-widest font-mono"
                style={{ color: CORAL.primary }}
              >
                {result.combined}
              </p>
            </div>
          </div>
        )}
      </div>
    </FeatureCard>
  );
}

/**
 * 변환기 탭 메인 컴포넌트
 */
export function ConverterTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <NumberToWordCard />
      <WordToNumberCard />
      <SequenceGeneratorCard />
      <WordChainCard />
    </div>
  );
}
