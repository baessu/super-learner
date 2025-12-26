/**
 * GridBoard.tsx
 * 듀얼 엔백 게임의 3x3 격자판 컴포넌트
 *
 * - 9개의 셀로 구성된 정사각형 그리드
 * - 활성화된 위치에 파란색 사각형 표시
 * - 피드백에 따른 테두리 색상 변경
 */

import type { FeedbackType } from './useDualNBackLogic';

interface GridBoardProps {
  activePosition: number | null;
  positionFeedback: FeedbackType;
}

export function GridBoard({ activePosition, positionFeedback }: GridBoardProps) {
  // 피드백에 따른 테두리 스타일
  const getBorderStyle = () => {
    switch (positionFeedback) {
      case 'correct':
        return 'ring-4 ring-emerald-400';
      case 'wrong':
        return 'ring-4 ring-red-400';
      default:
        return '';
    }
  };

  return (
    <div
      className={`
        grid grid-cols-3 gap-2 sm:gap-3
        w-64 h-64 sm:w-80 sm:h-80
        p-3 sm:p-4
        bg-gray-800 rounded-2xl
        transition-all duration-150
        ${getBorderStyle()}
      `}
    >
      {Array.from({ length: 9 }).map((_, index) => (
        <div
          key={index}
          className={`
            rounded-lg transition-all duration-150
            ${
              activePosition === index
                ? 'bg-blue-500 shadow-lg shadow-blue-500/50'
                : 'bg-gray-700'
            }
          `}
        />
      ))}
    </div>
  );
}
