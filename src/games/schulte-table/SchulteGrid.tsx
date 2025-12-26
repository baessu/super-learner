/**
 * SchulteGrid.tsx
 * 슐테 테이블의 5x5 숫자 격자판 UI 컴포넌트
 * - 정답 클릭 시 초록색 강조
 * - 오답 클릭 시 빨간색 + 흔들림 애니메이션
 * - 이미 맞춘 숫자는 비활성화 표시
 */

import type { CellFeedback } from './useSchulteLogic';

interface SchulteGridProps {
  numbers: number[];
  nextNum: number;
  cellFeedbacks: Record<number, CellFeedback>;
  onCellClick: (num: number) => void;
  disabled?: boolean;
}

export function SchulteGrid({
  numbers,
  nextNum,
  cellFeedbacks,
  onCellClick,
  disabled = false,
}: SchulteGridProps) {
  return (
    <div className="grid grid-cols-5 gap-2 sm:gap-3 w-full max-w-md mx-auto aspect-square">
      {numbers.map((num, index) => {
        const feedback = cellFeedbacks[num] || 'none';
        const isCleared = num < nextNum; // 이미 맞춘 숫자

        return (
          <button
            key={index}
            onClick={() => onCellClick(num)}
            disabled={disabled || isCleared}
            className={`
              relative flex items-center justify-center
              min-h-12 min-w-12 sm:min-h-14 sm:min-w-14
              text-xl sm:text-2xl font-bold
              rounded-xl transition-all duration-150
              select-none touch-manipulation
              ${
                isCleared
                  ? // 이미 맞춘 숫자: 비활성화 스타일
                    'bg-gray-100 text-gray-300 cursor-default'
                  : feedback === 'correct'
                  ? // 정답: 초록색 강조
                    'bg-emerald-500 text-white scale-95 shadow-lg shadow-emerald-200'
                  : feedback === 'wrong'
                  ? // 오답: 빨간색 + 흔들림
                    'bg-red-500 text-white animate-shake'
                  : // 기본 상태
                    'bg-white text-gray-800 shadow-sm border border-gray-200 hover:bg-gray-50 hover:border-gray-300 active:scale-95'
              }
              ${disabled ? 'cursor-not-allowed opacity-60' : ''}
            `}
          >
            {num}
          </button>
        );
      })}
    </div>
  );
}
