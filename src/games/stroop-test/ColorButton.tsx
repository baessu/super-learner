/**
 * ColorButton.tsx
 * 색상 선택 버튼 컴포넌트
 *
 * - 큰 터치 영역
 * - 키보드 힌트 표시
 * - 접근성을 위한 대비 텍스트
 */

import { memo } from 'react';
import type { ColorDef } from './useStroopLogic';

interface ColorButtonProps {
  color: ColorDef;
  onClick: () => void;
  disabled?: boolean;
}

/**
 * 배경색에 따른 텍스트 색상 결정
 * 노랑 계열은 어두운 텍스트 사용
 */
function getContrastText(colorId: string): string {
  return colorId === 'yellow' ? '#1F2937' : '#FFFFFF';
}

export const ColorButton = memo(function ColorButton({
  color,
  onClick,
  disabled = false,
}: ColorButtonProps) {
  const textColor = getContrastText(color.id);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative h-20 sm:h-24 rounded-2xl font-bold text-xl sm:text-2xl
        transition-all duration-100
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
        shadow-lg
      `}
      style={{
        backgroundColor: color.hex,
        color: textColor,
      }}
      aria-label={`${color.label} 버튼 (${color.key} 키)`}
    >
      {/* 색상 라벨 */}
      <span className="block">{color.label}</span>

      {/* 키보드 힌트 */}
      <span
        className="absolute bottom-1 right-2 text-xs sm:text-sm opacity-70 font-mono"
        style={{ color: textColor }}
      >
        {color.key}
      </span>
    </button>
  );
});
