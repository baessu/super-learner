/**
 * useSchulteLv2Logic.ts
 * Schulte Table Level 2 게임 로직 훅
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { GameState, LevelNumber, SplitNumber, GameResult, CellFeedback } from './types';
import { LEVEL_CONFIGS, TOTAL_NUMBERS, NUMBERS_PER_COLUMN, DEFAULT_LEVEL } from './levelData';
import { calculateTier } from './scoringUtils';

interface UseSchulteLv2LogicReturn {
  // 상태
  level: LevelNumber;
  gameState: GameState;
  nextNumber: number;
  elapsedTime: number;
  leftNumbers: SplitNumber[];
  rightNumbers: SplitNumber[];
  cellFeedbacks: Record<string, CellFeedback>;
  result: GameResult | null;

  // 설정
  levelConfig: typeof LEVEL_CONFIGS[LevelNumber];

  // 액션
  setLevel: (level: LevelNumber) => void;
  startGame: () => void;
  handleNumberClick: (num: number, side: 'left' | 'right') => void;
  resetGame: () => void;
}

/**
 * 1~24 숫자를 왼쪽/오른쪽에 무작위 배치
 */
function generateSplitNumbers(): { left: SplitNumber[]; right: SplitNumber[] } {
  // 1-24 숫자 배열 생성
  const numbers = Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1);

  // Fisher-Yates 셔플
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  // 앞 12개는 왼쪽, 뒤 12개는 오른쪽
  const leftValues = numbers.slice(0, NUMBERS_PER_COLUMN);
  const rightValues = numbers.slice(NUMBERS_PER_COLUMN);

  // 각 열 내에서도 셔플 (수직 위치 무작위화)
  const shuffleArray = <T,>(arr: T[]): T[] => {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };

  const left: SplitNumber[] = shuffleArray(leftValues).map((value) => ({
    value,
    side: 'left',
    found: false,
  }));

  const right: SplitNumber[] = shuffleArray(rightValues).map((value) => ({
    value,
    side: 'right',
    found: false,
  }));

  return { left, right };
}

export function useSchulteLv2Logic(): UseSchulteLv2LogicReturn {
  // 게임 상태
  const [level, setLevel] = useState<LevelNumber>(DEFAULT_LEVEL);
  const [gameState, setGameState] = useState<GameState>('ready');
  const [nextNumber, setNextNumber] = useState(1);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [leftNumbers, setLeftNumbers] = useState<SplitNumber[]>([]);
  const [rightNumbers, setRightNumbers] = useState<SplitNumber[]>([]);
  const [cellFeedbacks, setCellFeedbacks] = useState<Record<string, CellFeedback>>({});
  const [result, setResult] = useState<GameResult | null>(null);

  // 타이머 참조
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  // 레벨 설정
  const levelConfig = LEVEL_CONFIGS[level];

  // 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // 게임 시작
  const startGame = useCallback(() => {
    // 숫자 생성
    const { left, right } = generateSplitNumbers();
    setLeftNumbers(left);
    setRightNumbers(right);

    // 상태 초기화
    setNextNumber(1);
    setElapsedTime(0);
    setCellFeedbacks({});
    setResult(null);
    setGameState('playing');

    // 타이머 시작
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedTime(Date.now() - startTimeRef.current);
    }, 10);
  }, []);

  // 숫자 클릭 처리
  const handleNumberClick = useCallback(
    (num: number, side: 'left' | 'right') => {
      if (gameState !== 'playing') return;

      const feedbackKey = `${side}-${num}`;

      if (num === nextNumber) {
        // 정답!
        setCellFeedbacks((prev) => ({
          ...prev,
          [feedbackKey]: 'correct',
        }));

        // 해당 숫자를 found 처리
        if (side === 'left') {
          setLeftNumbers((prev) =>
            prev.map((n) => (n.value === num ? { ...n, found: true } : n))
          );
        } else {
          setRightNumbers((prev) =>
            prev.map((n) => (n.value === num ? { ...n, found: true } : n))
          );
        }

        // 다음 숫자로
        const newNextNumber = nextNumber + 1;
        setNextNumber(newNextNumber);

        // 게임 완료 체크 (24까지 찾으면 완료)
        if (newNextNumber > TOTAL_NUMBERS) {
          // 타이머 정지
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }

          const finalTime = Date.now() - startTimeRef.current;
          const timeSeconds = finalTime / 1000;
          const tier = calculateTier(timeSeconds);

          setElapsedTime(finalTime);
          setResult({
            level,
            timeSeconds,
            tier,
          });
          setGameState('finished');
        }

        // 피드백 제거 (0.3초 후)
        setTimeout(() => {
          setCellFeedbacks((prev) => {
            const newFeedbacks = { ...prev };
            delete newFeedbacks[feedbackKey];
            return newFeedbacks;
          });
        }, 300);
      } else {
        // 오답!
        setCellFeedbacks((prev) => ({
          ...prev,
          [feedbackKey]: 'wrong',
        }));

        // 피드백 제거 (0.5초 후)
        setTimeout(() => {
          setCellFeedbacks((prev) => {
            const newFeedbacks = { ...prev };
            delete newFeedbacks[feedbackKey];
            return newFeedbacks;
          });
        }, 500);
      }
    },
    [gameState, nextNumber, level]
  );

  // 게임 리셋
  const resetGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setGameState('ready');
    setNextNumber(1);
    setElapsedTime(0);
    setLeftNumbers([]);
    setRightNumbers([]);
    setCellFeedbacks({});
    setResult(null);
  }, []);

  // 레벨 변경 시 리셋
  const handleSetLevel = useCallback(
    (newLevel: LevelNumber) => {
      if (gameState === 'playing') {
        resetGame();
      }
      setLevel(newLevel);
    },
    [gameState, resetGame]
  );

  return {
    level,
    gameState,
    nextNumber,
    elapsedTime,
    leftNumbers,
    rightNumbers,
    cellFeedbacks,
    result,
    levelConfig,
    setLevel: handleSetLevel,
    startGame,
    handleNumberClick,
    resetGame,
  };
}
