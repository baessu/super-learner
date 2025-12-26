/**
 * useSchulteLogic.ts
 * 슐테 테이블 게임의 핵심 로직을 담당하는 커스텀 훅
 * - 숫자 배열 생성 및 셔플
 * - 타이머 관리
 * - 클릭 판정 (정답/오답)
 * - 게임 상태 관리
 */

import { useState, useCallback, useRef, useEffect } from 'react';

// 게임 상태 타입
export type GameStatus = 'ready' | 'playing' | 'finished';

// 셀 상태 타입 (정답/오답 피드백용)
export type CellFeedback = 'none' | 'correct' | 'wrong';

interface UseSchulteLogicReturn {
  // 상태
  numbers: number[];
  nextNum: number;
  status: GameStatus;
  elapsedTime: number;
  cellFeedbacks: Record<number, CellFeedback>;

  // 액션
  startGame: () => void;
  handleCellClick: (num: number) => void;
  resetGame: () => void;
}

/**
 * Fisher-Yates 알고리즘을 사용한 배열 셔플
 */
function shuffleArray(array: number[]): number[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * 1부터 size*size까지의 숫자 배열 생성
 */
function generateNumbers(size: number = 5): number[] {
  const total = size * size;
  return Array.from({ length: total }, (_, i) => i + 1);
}

export function useSchulteLogic(gridSize: number = 5): UseSchulteLogicReturn {
  // 게임 상태
  const [numbers, setNumbers] = useState<number[]>(() =>
    shuffleArray(generateNumbers(gridSize))
  );
  const [nextNum, setNextNum] = useState(1);
  const [status, setStatus] = useState<GameStatus>('ready');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [cellFeedbacks, setCellFeedbacks] = useState<Record<number, CellFeedback>>({});

  // 타이머 관련 ref
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  // 타이머 시작
  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedTime(Date.now() - startTimeRef.current);
    }, 10); // 10ms 단위로 업데이트 (0.01초 정밀도)
  }, []);

  // 타이머 정지
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // 게임 시작
  const startGame = useCallback(() => {
    setNumbers(shuffleArray(generateNumbers(gridSize)));
    setNextNum(1);
    setStatus('playing');
    setElapsedTime(0);
    setCellFeedbacks({});
    startTimer();
  }, [gridSize, startTimer]);

  // 셀 클릭 처리
  const handleCellClick = useCallback(
    (num: number) => {
      if (status !== 'playing') return;

      if (num === nextNum) {
        // 정답 처리
        setCellFeedbacks((prev) => ({ ...prev, [num]: 'correct' }));

        // 피드백 초기화 (0.3초 후)
        setTimeout(() => {
          setCellFeedbacks((prev) => ({ ...prev, [num]: 'none' }));
        }, 300);

        const totalNumbers = gridSize * gridSize;

        if (nextNum === totalNumbers) {
          // 게임 완료
          stopTimer();
          setStatus('finished');
        } else {
          // 다음 숫자로
          setNextNum((prev) => prev + 1);
        }
      } else {
        // 오답 처리
        setCellFeedbacks((prev) => ({ ...prev, [num]: 'wrong' }));

        // 피드백 초기화 (0.5초 후)
        setTimeout(() => {
          setCellFeedbacks((prev) => ({ ...prev, [num]: 'none' }));
        }, 500);
      }
    },
    [status, nextNum, gridSize, stopTimer]
  );

  // 게임 리셋
  const resetGame = useCallback(() => {
    stopTimer();
    setNumbers(shuffleArray(generateNumbers(gridSize)));
    setNextNum(1);
    setStatus('ready');
    setElapsedTime(0);
    setCellFeedbacks({});
  }, [gridSize, stopTimer]);

  return {
    numbers,
    nextNum,
    status,
    elapsedTime,
    cellFeedbacks,
    startGame,
    handleCellClick,
    resetGame,
  };
}
