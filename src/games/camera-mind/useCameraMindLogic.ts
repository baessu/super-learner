/**
 * useCameraMindLogic.ts
 * Camera Mind Game의 핵심 게임 로직
 *
 * - 원 생성 및 충돌 감지 (랜덤 사이즈 지원)
 * - 레벨 관리
 * - 게임 상태 관리
 */

import { useState, useCallback, useRef } from 'react';

// 게임 상태 타입
export type GameState = 'intro' | 'level-transition' | 'playing' | 'game-over';

// 원 데이터 타입 (size 속성 추가)
export interface Circle {
  id: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  color: string;
  size: number; // rem 단위 (3-7)
}

// 모든 원에 동일한 색상 사용
const CIRCLE_COLOR = '#6366F1'; // Indigo

// 모든 원에 동일한 크기 사용 (rem)
const CIRCLE_SIZE = 2.5;

// 캔버스 패딩 (%)
const CANVAS_PADDING = 5;

/**
 * rem을 percentage로 변환
 * 캔버스가 약 400px일 때 1rem = 16px = 4%
 */
function remToPercent(rem: number): number {
  return rem * 3;
}

/**
 * 두 원이 충돌하는지 확인 (각각의 크기 고려)
 */
function checkCollision(
  x1: number,
  y1: number,
  size1: number,
  x2: number,
  y2: number,
  size2: number
): boolean {
  const dx = x1 - x2;
  const dy = y1 - y2;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // 두 원의 반지름의 합 + 여백 (각 원의 크기를 %로 변환)
  const radius1 = remToPercent(size1) / 2;
  const radius2 = remToPercent(size2) / 2;
  const minDistance = radius1 + radius2 + 1; // 1% 여백

  return distance < minDistance;
}

/**
 * 기존 원들과 충돌하지 않는 새 좌표 생성 (새 원의 크기 고려)
 */
function generateNonCollidingPosition(
  existingCircles: Circle[],
  newSize: number,
  maxAttempts: number = 300
): { x: number; y: number } | null {
  const newRadius = remToPercent(newSize) / 2;

  // 캔버스 범위 계산 (원이 캔버스 밖으로 나가지 않도록)
  const minX = CANVAS_PADDING + newRadius;
  const maxX = 100 - CANVAS_PADDING - newRadius;
  const minY = CANVAS_PADDING + newRadius;
  const maxY = 100 - CANVAS_PADDING - newRadius;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const x = minX + Math.random() * (maxX - minX);
    const y = minY + Math.random() * (maxY - minY);

    let hasCollision = false;
    for (const circle of existingCircles) {
      if (checkCollision(x, y, newSize, circle.x, circle.y, circle.size)) {
        hasCollision = true;
        break;
      }
    }

    if (!hasCollision) {
      return { x, y };
    }
  }

  return null; // 충돌 없는 위치를 찾지 못함
}

export function useCameraMindLogic() {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [level, setLevel] = useState(1);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [targetId, setTargetId] = useState<string | null>(null);

  const circleIdCounter = useRef(0);

  /**
   * 새로운 원 추가 (모든 원 동일한 크기/색상)
   */
  const addNewCircle = useCallback((existingCircles: Circle[]): Circle | null => {
    const position = generateNonCollidingPosition(existingCircles, CIRCLE_SIZE);
    if (!position) return null;

    const newCircle: Circle = {
      id: `circle-${++circleIdCounter.current}`,
      x: position.x,
      y: position.y,
      color: CIRCLE_COLOR,
      size: CIRCLE_SIZE,
    };

    return newCircle;
  }, []);

  /**
   * 게임 시작
   */
  const startGame = useCallback(() => {
    setLevel(1);
    setCircles([]);
    setTargetId(null);
    circleIdCounter.current = 0;
    setGameState('level-transition');
  }, []);

  /**
   * 레벨 시작 (레벨 전환 후 호출)
   */
  const startLevel = useCallback(() => {
    // 첫 번째 레벨이면 첫 원 생성
    if (circles.length === 0) {
      const firstCircle = addNewCircle([]);
      if (firstCircle) {
        setCircles([firstCircle]);
        setTargetId(firstCircle.id);
        setGameState('playing');
      }
    } else {
      // 기존 원들에 새 원 추가
      const newCircle = addNewCircle(circles);
      if (newCircle) {
        setCircles((prev) => [...prev, newCircle]);
        setTargetId(newCircle.id);
        setGameState('playing');
      } else {
        // 더 이상 원을 배치할 수 없음 - 화면이 가득 참!
        // 게임 오버로 처리 (높은 레벨 달성)
        setGameState('game-over');
      }
    }
  }, [circles, addNewCircle]);

  /**
   * 원 클릭 처리
   */
  const handleCircleClick = useCallback(
    (circleId: string) => {
      if (gameState !== 'playing') return;

      if (circleId === targetId) {
        // 정답! - 즉시 다음 레벨로
        setLevel((prev) => prev + 1);
        setGameState('level-transition');
      } else {
        // 오답 - 즉시 게임 오버
        setGameState('game-over');
      }
    },
    [gameState, targetId]
  );

  /**
   * 게임 리셋
   */
  const resetGame = useCallback(() => {
    setGameState('intro');
    setLevel(1);
    setCircles([]);
    setTargetId(null);
    circleIdCounter.current = 0;
  }, []);

  return {
    // 상태
    gameState,
    level,
    circles,
    targetId,

    // 액션
    startGame,
    startLevel,
    handleCircleClick,
    resetGame,
  };
}
