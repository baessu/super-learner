/**
 * ControlBar.tsx
 * 레벨 선택 컴포넌트
 */

import type { LevelNumber, LevelConfig } from '../types';
import { LEVEL_LIST } from '../levelData';

interface ControlBarProps {
  currentLevel: LevelNumber;
  onLevelChange: (level: LevelNumber) => void;
  disabled?: boolean;
}

/** 레벨별 색상 */
const LEVEL_COLORS: Record<LevelNumber, { bg: string; border: string; text: string }> = {
  1: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700' },
  2: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700' },
  3: { bg: 'bg-yellow-50', border: 'border-yellow-400', text: 'text-yellow-700' },
  4: { bg: 'bg-orange-50', border: 'border-orange-400', text: 'text-orange-700' },
  5: { bg: 'bg-red-50', border: 'border-red-400', text: 'text-red-700' },
};

/** 선택된 레벨 스타일 */
const SELECTED_STYLE = {
  bg: 'bg-[#FEF2F0]',
  border: 'border-[#E87C63]',
  text: 'text-[#E87C63]',
};

function LevelChip({
  config,
  isSelected,
  onClick,
  disabled,
}: {
  config: LevelConfig;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  const colors = isSelected ? SELECTED_STYLE : LEVEL_COLORS[config.level];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex flex-col items-center px-4 py-3 rounded-xl border-2 transition-all
        ${colors.bg} ${colors.border}
        ${isSelected ? 'shadow-md scale-105' : 'hover:scale-102'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <span className={`text-lg font-bold ${colors.text}`}>Lv.{config.level}</span>
      <span className="text-xs text-gray-600">{config.name}</span>
    </button>
  );
}

export function ControlBar({ currentLevel, onLevelChange, disabled }: ControlBarProps) {
  const selectedConfig = LEVEL_LIST.find((l) => l.level === currentLevel)!;

  return (
    <div className="w-full space-y-4">
      {/* 레벨 선택 칩 */}
      <div className="flex flex-wrap justify-center gap-2">
        {LEVEL_LIST.map((config) => (
          <LevelChip
            key={config.level}
            config={config}
            isSelected={config.level === currentLevel}
            onClick={() => onLevelChange(config.level)}
            disabled={disabled}
          />
        ))}
      </div>

      {/* 선택된 레벨 설명 */}
      <div className="text-center p-3 bg-gray-50 rounded-xl">
        <p className="text-sm text-gray-700">
          <span className="font-bold text-[#E87C63]">Lv.{selectedConfig.level}</span>
          {' · '}
          <span>{selectedConfig.description}</span>
          {' · '}
          <span className="text-gray-500">
            폰트: {selectedConfig.fontSize} / 간격: {selectedConfig.gapPercent}%
          </span>
        </p>
      </div>
    </div>
  );
}
