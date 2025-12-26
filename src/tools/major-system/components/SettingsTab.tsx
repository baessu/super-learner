/**
 * SettingsTab.tsx
 * 숫자-초성 매핑 설정 UI
 */

import { useState } from 'react';
import { Plus, X, RotateCcw, AlertCircle } from 'lucide-react';
import { useMajorSystemStore } from '../useMajorSystemStore';
import { CHOSUNG_LIST, type Chosung } from '../hangulUtils';

// Coral 테마 색상
const CORAL = {
  primary: '#E87C63',
  light: '#FEF2F0',
  hover: '#D66B53',
  border: '#FADAD4',
};

// 사용 가능한 모든 초성 목록
const ALL_CHOSUNGS = CHOSUNG_LIST;

/**
 * 개별 숫자 매핑 행 컴포넌트
 */
function MappingRow({
  digit,
  consonants,
  onAdd,
  onRemove,
  usedConsonants,
}: {
  digit: number;
  consonants: Chosung[];
  onAdd: (consonant: Chosung) => void;
  onRemove: (consonant: Chosung) => void;
  usedConsonants: Set<Chosung>;
}) {
  const [isAdding, setIsAdding] = useState(false);

  // 추가 가능한 초성 (이미 다른 숫자에 할당되지 않은 것)
  const availableConsonants = ALL_CHOSUNGS.filter(
    (c) => !usedConsonants.has(c) || consonants.includes(c)
  );

  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-b-0">
      {/* 숫자 */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
        style={{ backgroundColor: CORAL.primary }}
      >
        {digit}
      </div>

      {/* 할당된 초성들 */}
      <div className="flex-1 flex flex-wrap items-center gap-2">
        {consonants.map((consonant) => (
          <div
            key={consonant}
            className="group flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <span className="font-medium text-gray-700">{consonant}</span>
            <button
              onClick={() => onRemove(consonant)}
              className="w-4 h-4 rounded-full bg-gray-300 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-400"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {consonants.length === 0 && (
          <span className="text-sm text-gray-400 italic">매핑 없음</span>
        )}

        {/* 추가 버튼 */}
        {isAdding ? (
          <div className="flex flex-wrap gap-1 p-2 bg-gray-50 rounded-lg">
            {availableConsonants
              .filter((c) => !consonants.includes(c))
              .map((consonant) => (
                <button
                  key={consonant}
                  onClick={() => {
                    onAdd(consonant);
                    setIsAdding(false);
                  }}
                  className="px-2 py-1 text-sm bg-white rounded border border-gray-200 hover:border-[#E87C63] hover:bg-[#FEF2F0] transition-colors"
                >
                  {consonant}
                </button>
              ))}
            <button
              onClick={() => setIsAdding(false)}
              className="px-2 py-1 text-sm text-gray-400 hover:text-gray-600"
            >
              취소
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-8 h-8 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-[#E87C63] hover:text-[#E87C63] transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * 설정 탭 메인 컴포넌트
 */
export function SettingsTab() {
  const { mapping, addConsonantToDigit, removeConsonantFromDigit, resetMappingToDefault } =
    useMajorSystemStore();

  // 현재 사용 중인 모든 초성 수집
  const usedConsonants = new Set<Chosung>(
    Object.values(mapping).flat() as Chosung[]
  );

  // 미사용 초성 확인
  const unusedConsonants = ALL_CHOSUNGS.filter((c) => !usedConsonants.has(c));

  const handleReset = () => {
    if (window.confirm('매핑을 기본값으로 되돌리시겠습니까?\n사전의 모든 숫자코드가 재계산됩니다.')) {
      resetMappingToDefault();
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800">숫자-초성 매핑</h2>
          <p className="text-sm text-gray-500">
            각 숫자에 대응하는 한글 초성을 설정합니다
          </p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          기본값 복원
        </button>
      </div>

      {/* 미사용 초성 경고 */}
      {unusedConsonants.length > 0 && (
        <div
          className="flex items-start gap-3 p-4 rounded-xl border"
          style={{ backgroundColor: CORAL.light, borderColor: CORAL.border }}
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: CORAL.primary }} />
          <div>
            <p className="text-sm font-medium text-gray-700">
              매핑되지 않은 초성이 있습니다
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {unusedConsonants.join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* 매핑 테이블 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <MappingRow
            key={digit}
            digit={digit}
            consonants={mapping[digit] ?? []}
            onAdd={(c) => addConsonantToDigit(digit, c)}
            onRemove={(c) => removeConsonantFromDigit(digit, c)}
            usedConsonants={usedConsonants}
          />
        ))}
      </div>

      {/* 도움말 */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="font-medium text-gray-700 mb-2">기본 매핑 규칙</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm">
          <div className="bg-white px-3 py-2 rounded-lg border border-gray-100">
            <span className="font-mono font-bold" style={{ color: CORAL.primary }}>0</span>
            <span className="text-gray-500 ml-2">ㅎ</span>
          </div>
          <div className="bg-white px-3 py-2 rounded-lg border border-gray-100">
            <span className="font-mono font-bold" style={{ color: CORAL.primary }}>1</span>
            <span className="text-gray-500 ml-2">ㄱ,ㅋ,ㄲ</span>
          </div>
          <div className="bg-white px-3 py-2 rounded-lg border border-gray-100">
            <span className="font-mono font-bold" style={{ color: CORAL.primary }}>2</span>
            <span className="text-gray-500 ml-2">ㄴ</span>
          </div>
          <div className="bg-white px-3 py-2 rounded-lg border border-gray-100">
            <span className="font-mono font-bold" style={{ color: CORAL.primary }}>3</span>
            <span className="text-gray-500 ml-2">ㄷ,ㅌ,ㄸ</span>
          </div>
          <div className="bg-white px-3 py-2 rounded-lg border border-gray-100">
            <span className="font-mono font-bold" style={{ color: CORAL.primary }}>4</span>
            <span className="text-gray-500 ml-2">ㄹ</span>
          </div>
          <div className="bg-white px-3 py-2 rounded-lg border border-gray-100">
            <span className="font-mono font-bold" style={{ color: CORAL.primary }}>5</span>
            <span className="text-gray-500 ml-2">ㅁ</span>
          </div>
          <div className="bg-white px-3 py-2 rounded-lg border border-gray-100">
            <span className="font-mono font-bold" style={{ color: CORAL.primary }}>6</span>
            <span className="text-gray-500 ml-2">ㅂ,ㅍ,ㅃ</span>
          </div>
          <div className="bg-white px-3 py-2 rounded-lg border border-gray-100">
            <span className="font-mono font-bold" style={{ color: CORAL.primary }}>7</span>
            <span className="text-gray-500 ml-2">ㅅ,ㅆ</span>
          </div>
          <div className="bg-white px-3 py-2 rounded-lg border border-gray-100">
            <span className="font-mono font-bold" style={{ color: CORAL.primary }}>8</span>
            <span className="text-gray-500 ml-2">ㅇ</span>
          </div>
          <div className="bg-white px-3 py-2 rounded-lg border border-gray-100">
            <span className="font-mono font-bold" style={{ color: CORAL.primary }}>9</span>
            <span className="text-gray-500 ml-2">ㅈ,ㅊ,ㅉ</span>
          </div>
        </div>
      </div>
    </div>
  );
}
