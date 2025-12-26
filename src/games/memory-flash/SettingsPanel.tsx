/**
 * SettingsPanel.tsx
 * 레벨 선택 UI 컴포넌트
 */

import { LEVEL_CONFIGS, TIER_INFO, type LevelConfig } from './levelData';

// Coral 테마 색상
const CORAL = {
  primary: '#E87C63',
  light: '#FEF2F0',
  hover: '#D66B53',
};

interface LevelCardProps {
  config: LevelConfig;
  isSelected: boolean;
  bestTier?: string | null;
  onSelect: () => void;
}

/**
 * 레벨 카드 컴포넌트
 */
function LevelCard({ config, isSelected, bestTier, onSelect }: LevelCardProps) {
  const tierInfo = bestTier ? TIER_INFO[bestTier] : null;

  return (
    <button
      onClick={onSelect}
      className={`
        relative p-4 rounded-2xl border-2 transition-all duration-200
        ${isSelected
          ? 'border-[#E87C63] bg-[#FEF2F0] shadow-lg scale-105'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
        }
      `}
    >
      {/* 레벨 배지 */}
      <div
        className={`
          absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center
          text-sm font-bold shadow-md
          ${isSelected ? 'bg-[#E87C63] text-white' : 'bg-gray-100 text-gray-600'}
        `}
      >
        Lv.{config.level}
      </div>

      {/* 레벨 이름 */}
      <div className="text-left mb-3 mt-2">
        <h3 className={`text-lg font-bold ${isSelected ? 'text-[#E87C63]' : 'text-gray-800'}`}>
          {config.name}
        </h3>
        <p className="text-xs text-gray-500">{config.nameKo}</p>
      </div>

      {/* 설명 */}
      <div className="text-left space-y-1 text-sm text-gray-600">
        <p>
          <span className="font-medium">글자:</span> {config.letterCount}개
        </p>
        <p>
          <span className="font-medium">시간:</span> {config.flashDuration}초
        </p>
        <p>
          <span className="font-medium">종류:</span> {config.letterTypes.join(', ')}
        </p>
      </div>

      {/* 최고 티어 배지 */}
      {tierInfo && (
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md"
          style={{ backgroundColor: tierInfo.color }}
        >
          {tierInfo.emoji} {tierInfo.grade}
        </div>
      )}

      {/* 선택 표시 */}
      {isSelected && (
        <div className="absolute top-2 left-2">
          <svg className="w-5 h-5 text-[#E87C63]" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </button>
  );
}

interface SettingsPanelProps {
  selectedLevel: number;
  onSelectLevel: (level: number) => void;
  onStart: () => void;
  bestTiers?: Record<number, string>;
}

/**
 * 레벨 선택 패널
 */
export function SettingsPanel({
  selectedLevel,
  onSelectLevel,
  onStart,
  bestTiers = {},
}: SettingsPanelProps) {
  return (
    <div className="flex flex-col items-center py-6">
      {/* 설명 */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">레벨 선택</h3>
        <p className="text-sm text-gray-500">
          난이도를 선택하고 순간적으로 나타나는 글자들을 기억하세요!
        </p>
      </div>

      {/* 레벨 카드 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8 w-full max-w-4xl px-4">
        {LEVEL_CONFIGS.map((config) => (
          <LevelCard
            key={config.level}
            config={config}
            isSelected={selectedLevel === config.level}
            bestTier={bestTiers[config.level]}
            onSelect={() => onSelectLevel(config.level)}
          />
        ))}
      </div>

      {/* 시작 버튼 */}
      <button
        onClick={onStart}
        className="px-8 py-4 rounded-2xl text-white text-lg font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg"
        style={{ backgroundColor: CORAL.primary }}
      >
        게임 시작
      </button>

      {/* 게임 설명 */}
      <div className="mt-8 max-w-md text-center">
        <div className="bg-gray-50 rounded-2xl p-4">
          <h4 className="font-bold text-gray-800 mb-2">게임 방법</h4>
          <ol className="text-sm text-gray-600 text-left space-y-1">
            <li>1. 레벨을 선택하고 시작 버튼을 누르세요</li>
            <li>2. 화면에 잠깐 나타나는 글자들을 기억하세요</li>
            <li>3. 각 글자가 몇 개였는지 입력하세요</li>
            <li>4. 100% 정확해야 티어를 획득합니다!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
