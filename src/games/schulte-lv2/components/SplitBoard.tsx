/**
 * SplitBoard.tsx
 * 좌/우 분할 보드 컴포넌트
 */

import { useEffect, useState } from 'react';
import type { SplitNumber, CellFeedback, LevelConfig } from '../types';

interface SplitBoardProps {
  leftNumbers: SplitNumber[];
  rightNumbers: SplitNumber[];
  cellFeedbacks: Record<string, CellFeedback>;
  levelConfig: LevelConfig;
  onNumberClick: (num: number, side: 'left' | 'right') => void;
  disabled?: boolean;
}

interface NumberCellProps {
  number: SplitNumber;
  fontSize: string;
  feedback: CellFeedback;
  onClick: () => void;
  disabled?: boolean;
}

function NumberCell({
  number,
  fontSize,
  feedback,
  onClick,
  disabled,
}: NumberCellProps) {
  const isFound = number.found;

  // 피드백 스타일
  const feedbackStyles = {
    correct: 'bg-green-100 border-green-500 scale-90 opacity-0',
    wrong: 'bg-red-100 border-red-500 animate-shake',
    null: '',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isFound}
      className={`
        w-14 h-14 md:w-16 md:h-16 flex items-center justify-center
        rounded-xl border-2 font-bold transition-all duration-200
        ${isFound
          ? 'bg-gray-100 border-gray-200 text-transparent cursor-default'
          : feedback
          ? feedbackStyles[feedback]
          : 'bg-white border-gray-200 hover:border-[#E87C63] hover:bg-[#FEF2F0] text-gray-800'
        }
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer active:scale-95'}
      `}
      style={{ fontSize }}
    >
      {isFound ? '' : number.value}
    </button>
  );
}

function CenterFocusPoint() {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* 중앙 점 */}
      <div className="relative">
        <div className="w-6 h-6 bg-red-500 rounded-full animate-pulse" />
        <div className="absolute inset-0 w-6 h-6 bg-red-400 rounded-full animate-ping opacity-75" />
      </div>
      <p className="mt-2 text-xs text-gray-500 text-center">
        여기에<br />집중
      </p>
    </div>
  );
}

export function SplitBoard({
  leftNumbers,
  rightNumbers,
  cellFeedbacks,
  levelConfig,
  onNumberClick,
  disabled,
}: SplitBoardProps) {
  const [screenShake, setScreenShake] = useState(false);

  // 오답 시 화면 흔들림 효과
  useEffect(() => {
    const hasWrongFeedback = Object.values(cellFeedbacks).includes('wrong');
    if (hasWrongFeedback) {
      setScreenShake(true);
      const timer = setTimeout(() => setScreenShake(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cellFeedbacks]);

  // 간격 계산 (화면 너비의 %를 px로 변환하지 않고 CSS로 처리)
  const gapStyle = {
    width: `${levelConfig.gapPercent}%`,
  };

  return (
    <div
      className={`
        w-full flex items-center justify-center
        ${screenShake ? 'animate-shake' : ''}
      `}
    >
      {/* 왼쪽 열 */}
      <div className="flex flex-col gap-2 items-center">
        {leftNumbers.map((num) => (
          <NumberCell
            key={`left-${num.value}`}
            number={num}
            fontSize={levelConfig.fontSize}
            feedback={cellFeedbacks[`left-${num.value}`] ?? null}
            onClick={() => onNumberClick(num.value, 'left')}
            disabled={disabled}
          />
        ))}
      </div>

      {/* 중앙 간격 (빨간 점 포함) */}
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={gapStyle}
      >
        <CenterFocusPoint />
      </div>

      {/* 오른쪽 열 */}
      <div className="flex flex-col gap-2 items-center">
        {rightNumbers.map((num) => (
          <NumberCell
            key={`right-${num.value}`}
            number={num}
            fontSize={levelConfig.fontSize}
            feedback={cellFeedbacks[`right-${num.value}`] ?? null}
            onClick={() => onNumberClick(num.value, 'right')}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}
