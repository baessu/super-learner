/**
 * useImageMemoryLogic.ts
 * 20개 이미지 기억 게임의 핵심 로직을 담당하는 커스텀 훅
 *
 * - Sparse Grid (8x8 = 64 슬롯) + Jittering 방식
 * - 게임 상태: ready → memorizing → countdown → recalling → finished
 * - 회상 단계: 정답 20개 + 오답 15개 = 35개 중에서 즉시 피드백
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { getRandomEmojis, shuffleArray } from './emojiData';

// 게임 상태 타입
export type GameState = 'ready' | 'memorizing' | 'countdown' | 'recalling' | 'finished';

// 그리드 아이템 타입 (기억 단계용)
export interface GridItem {
  emoji: string;
  id: number; // 순서 (1~20)
  offsetX: number; // X축 오프셋 (px)
  offsetY: number; // Y축 오프셋 (px)
  rotation: number; // 회전 각도 (deg)
}

// 회상 단계 카드 타입
export interface RecallCard {
  emoji: string;
  isTarget: boolean; // 정답인지 여부
}

// 상수
const TOTAL_TARGETS = 20; // 정답 이모지 개수
const TOTAL_DECOYS = 15; // 오답 이모지 개수
const GRID_SIZE = 64; // 8x8 그리드
const JITTER_RANGE = 12; // ±12px 범위
const ROTATION_RANGE = 8; // ±8도 범위
const COUNTDOWN_SECONDS = 3; // 카운트다운 시간

interface UseImageMemoryLogicReturn {
  // 상태
  gameState: GameState;
  gridData: (GridItem | null)[]; // 64개 슬롯 (null = 빈 칸)
  targetSequence: GridItem[]; // 정답 순서 (20개)
  recallCards: RecallCard[]; // 회상 단계 카드 (35개)
  foundEmojis: Set<string>; // 찾은 정답 이모지들
  correctCount: number; // 찾은 정답 개수
  errorCount: number; // 오답 클릭 횟수
  lastErrorEmoji: string | null; // 마지막으로 틀린 이모지 (애니메이션용)
  elapsedTime: number; // 경과 시간 (밀리초)
  memorizeTime: number; // 암기에 걸린 시간 (밀리초)
  countdownValue: number; // 카운트다운 값 (3, 2, 1)
  totalTargets: number;

  // 액션
  startGame: () => void;
  finishMemorizing: () => void;
  handleCardClick: (emoji: string, isTarget: boolean) => void;
  resetGame: () => void;
}

/**
 * 지터링 값 생성 (-range ~ +range)
 */
function getRandomJitter(range: number): number {
  return Math.random() * range * 2 - range;
}

/**
 * 0 ~ max-1 범위에서 중복 없이 n개의 랜덤 인덱스 선택
 */
function getRandomIndices(max: number, count: number): number[] {
  const indices: number[] = [];
  const available = Array.from({ length: max }, (_, i) => i);

  for (let i = 0; i < count; i++) {
    const randomIdx = Math.floor(Math.random() * available.length);
    indices.push(available[randomIdx]);
    available.splice(randomIdx, 1);
  }

  return indices;
}

export function useImageMemoryLogic(): UseImageMemoryLogicReturn {
  // 게임 상태
  const [gameState, setGameState] = useState<GameState>('ready');
  const [gridData, setGridData] = useState<(GridItem | null)[]>([]);
  const [targetSequence, setTargetSequence] = useState<GridItem[]>([]);
  const [recallCards, setRecallCards] = useState<RecallCard[]>([]);
  const [foundEmojis, setFoundEmojis] = useState<Set<string>>(new Set());
  const [correctCount, setCorrectCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [lastErrorEmoji, setLastErrorEmoji] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [memorizeTime, setMemorizeTime] = useState(0);
  const [countdownValue, setCountdownValue] = useState(COUNTDOWN_SECONDS);

  // 타이머 ref
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  // 타이머 정리
  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  // 게임 시작 (기억 단계로 진입)
  const startGame = useCallback(() => {
    clearTimers();

    // 35개의 랜덤 이모지 선택 (20개 정답 + 15개 오답)
    const allEmojis = getRandomEmojis(TOTAL_TARGETS + TOTAL_DECOYS);
    const targetEmojis = allEmojis.slice(0, TOTAL_TARGETS);
    const decoyEmojis = allEmojis.slice(TOTAL_TARGETS);

    // 64개 슬롯 중 20개 랜덤 선택 (기억 단계용)
    const selectedIndices = getRandomIndices(GRID_SIZE, TOTAL_TARGETS);

    // 그리드 데이터 생성 (지터링 포함)
    const newGridData: (GridItem | null)[] = Array(GRID_SIZE).fill(null);
    const newTargetSequence: GridItem[] = [];

    selectedIndices.forEach((gridIndex, order) => {
      const item: GridItem = {
        emoji: targetEmojis[order],
        id: order + 1,
        offsetX: getRandomJitter(JITTER_RANGE),
        offsetY: getRandomJitter(JITTER_RANGE),
        rotation: getRandomJitter(ROTATION_RANGE),
      };
      newGridData[gridIndex] = item;
      newTargetSequence.push(item);
    });

    // 회상 단계용 카드 생성 (정답 + 오답 섞기)
    const targetCards: RecallCard[] = targetEmojis.map((emoji) => ({
      emoji,
      isTarget: true,
    }));
    const decoyCards: RecallCard[] = decoyEmojis.map((emoji) => ({
      emoji,
      isTarget: false,
    }));
    const allCards = shuffleArray([...targetCards, ...decoyCards]);

    setGridData(newGridData);
    setTargetSequence(newTargetSequence);
    setRecallCards(allCards);
    setFoundEmojis(new Set());
    setCorrectCount(0);
    setErrorCount(0);
    setLastErrorEmoji(null);
    setElapsedTime(0);
    setMemorizeTime(0);
    setCountdownValue(COUNTDOWN_SECONDS);
    setGameState('memorizing');

    // 타이머 시작 (카운트업)
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedTime(Date.now() - startTimeRef.current);
    }, 100);
  }, [clearTimers]);

  // 암기 완료 → 카운트다운 시작
  const finishMemorizing = useCallback(() => {
    if (gameState !== 'memorizing') return;

    clearTimers();
    const finalTime = Date.now() - startTimeRef.current;
    setMemorizeTime(finalTime);
    setElapsedTime(finalTime);
    setCountdownValue(COUNTDOWN_SECONDS);
    setGameState('countdown');

    // 카운트다운 시작
    let count = COUNTDOWN_SECONDS;
    countdownRef.current = setInterval(() => {
      count -= 1;
      setCountdownValue(count);

      if (count <= 0) {
        if (countdownRef.current) {
          clearInterval(countdownRef.current);
          countdownRef.current = null;
        }
        setGameState('recalling');
      }
    }, 1000);
  }, [gameState, clearTimers]);

  // 카드 클릭 핸들러 (회상 단계)
  const handleCardClick = useCallback(
    (emoji: string, isTarget: boolean) => {
      if (gameState !== 'recalling') return;

      // 이미 찾은 정답이면 무시
      if (foundEmojis.has(emoji)) return;

      if (isTarget) {
        // 정답!
        setFoundEmojis((prev) => new Set([...prev, emoji]));
        setCorrectCount((prev) => prev + 1);
      } else {
        // 오답!
        setErrorCount((prev) => prev + 1);
        setLastErrorEmoji(emoji);

        // 0.5초 후 에러 표시 초기화
        setTimeout(() => {
          setLastErrorEmoji(null);
        }, 500);
      }
    },
    [gameState, foundEmojis]
  );

  // 정답 20개를 모두 찾으면 게임 종료
  useEffect(() => {
    if (correctCount === TOTAL_TARGETS && gameState === 'recalling') {
      setGameState('finished');
    }
  }, [correctCount, gameState]);

  // 게임 리셋
  const resetGame = useCallback(() => {
    clearTimers();
    setGameState('ready');
    setGridData([]);
    setTargetSequence([]);
    setRecallCards([]);
    setFoundEmojis(new Set());
    setCorrectCount(0);
    setErrorCount(0);
    setLastErrorEmoji(null);
    setElapsedTime(0);
    setMemorizeTime(0);
    setCountdownValue(COUNTDOWN_SECONDS);
  }, [clearTimers]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  return {
    gameState,
    gridData,
    targetSequence,
    recallCards,
    foundEmojis,
    correctCount,
    errorCount,
    lastErrorEmoji,
    elapsedTime,
    memorizeTime,
    countdownValue,
    totalTargets: TOTAL_TARGETS,
    startGame,
    finishMemorizing,
    handleCardClick,
    resetGame,
  };
}
