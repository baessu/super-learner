/**
 * GameCanvas.tsx
 * 원들을 렌더링하는 게임 캔버스 컴포넌트
 *
 * - No hover effect
 * - No cursor pointer
 * - No click feedback
 * - Clinical test feel
 */

import { memo } from 'react';
import type { Circle } from './useCameraMindLogic';

interface GameCanvasProps {
  circles: Circle[];
  onCircleClick: (circleId: string) => void;
}

/**
 * 개별 원 컴포넌트
 * - 호버 효과 없음
 * - 커서 변경 없음
 * - 클릭 피드백 없음
 */
const CircleElement = memo(function CircleElement({
  circle,
  onClick,
}: {
  circle: Circle;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="absolute rounded-full select-none"
      style={{
        left: `${circle.x}%`,
        top: `${circle.y}%`,
        width: `${circle.size}rem`,
        height: `${circle.size}rem`,
        backgroundColor: circle.color,
        transform: 'translate(-50%, -50%)',
        // No cursor pointer - keep default arrow
        cursor: 'default',
      }}
      role="button"
      tabIndex={-1}
      aria-label={`Circle ${circle.id}`}
    />
  );
});

/**
 * 게임 캔버스 컴포넌트
 */
export function GameCanvas({
  circles,
  onCircleClick,
}: GameCanvasProps) {
  return (
    <div className="relative w-full aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-inner">
      {/* 원들 렌더링 */}
      {circles.map((circle) => (
        <CircleElement
          key={circle.id}
          circle={circle}
          onClick={() => onCircleClick(circle.id)}
        />
      ))}
    </div>
  );
}
