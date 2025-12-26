/**
 * useMemoryFlashLogic.ts
 * Memory Flash 게임의 핵심 로직
 *
 * - 레벨 기반 설정 적용
 * - 플래시 타이밍 관리
 * - 정답 검증 및 티어 계산
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { getLevelConfig, getTierByLevel, type LevelConfig, type TierInfo } from './levelData';

// 게임 상태 타입
export type GameState = 'selecting' | 'ready' | 'flashing' | 'answering' | 'result';

// 글자 데이터 타입
export interface LetterData {
  char: string;
  x: number;
  y: number;
  rotation: number;
}

// 결과 데이터 타입
export interface ResultData {
  tier: TierInfo;
  isCorrect: boolean;
  actualCounts: Record<string, number>;
  userCounts: Record<string, number>;
  differences: Record<string, number>;
  level: number;
}

/**
 * 무작위 글자 배열 생성
 */
function generateLetters(config: LevelConfig): LetterData[] {
  const letters: LetterData[] = [];
  const { letterCount, letterTypes } = config;

  // 각 글자 타입에 최소 1개씩 배정 (가능한 경우)
  const minPerType = Math.floor(letterCount / letterTypes.length);
  const remaining = letterCount - minPerType * letterTypes.length;

  // 글자 배열 생성
  const charArray: string[] = [];
  letterTypes.forEach((type, index) => {
    const count = minPerType + (index < remaining ? 1 : 0);
    for (let i = 0; i < count; i++) {
      charArray.push(type);
    }
  });

  // 셔플
  for (let i = charArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [charArray[i], charArray[j]] = [charArray[j], charArray[i]];
  }

  // 위치 및 회전 할당 (겹치지 않게)
  const positions: { x: number; y: number }[] = [];
  const minDistance = 15; // 최소 거리 (%)

  charArray.forEach((char) => {
    let x: number, y: number;
    let attempts = 0;
    const maxAttempts = 50;

    do {
      x = 10 + Math.random() * 80;
      y = 10 + Math.random() * 80;
      attempts++;
    } while (
      attempts < maxAttempts &&
      positions.some(
        (pos) => Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2)) < minDistance
      )
    );

    positions.push({ x, y });
    letters.push({
      char,
      x,
      y,
      rotation: Math.random() * 60 - 30, // -30 ~ +30도
    });
  });

  return letters;
}

/**
 * 글자별 개수 계산
 */
function countLetters(letters: LetterData[]): Record<string, number> {
  const counts: Record<string, number> = {};
  letters.forEach((letter) => {
    counts[letter.char] = (counts[letter.char] || 0) + 1;
  });
  return counts;
}

export function useMemoryFlashLogic() {
  // 상태
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [gameState, setGameState] = useState<GameState>('selecting');
  const [letters, setLetters] = useState<LetterData[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<ResultData | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  // 현재 레벨 설정
  const config = getLevelConfig(selectedLevel);

  // 타이머 참조
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 클린업
  useEffect(() => {
    return () => {
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, []);

  /**
   * 레벨 선택 (레벨 선택 화면에서 레벨 카드 클릭 시)
   */
  const selectLevel = useCallback((level: number) => {
    setSelectedLevel(level);
    // gameState는 'selecting' 유지 - 사용자가 "게임 시작" 버튼을 눌러야 시작
    setResult(null);
    setUserAnswers({});
  }, []);

  /**
   * 게임 시작 (플래시)
   * @param levelOverride - 지정된 레벨로 시작 (다음 레벨 버튼용)
   */
  const startFlash = useCallback((levelOverride?: number) => {
    // 레벨 오버라이드가 있으면 레벨 변경
    if (levelOverride !== undefined) {
      setSelectedLevel(levelOverride);
    }
    const currentConfig = levelOverride !== undefined ? getLevelConfig(levelOverride) : config;

    // 카운트다운 시작
    setCountdown(3);
    setGameState('ready');

    let count = 3;
    countdownTimerRef.current = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
      } else {
        // 카운트다운 종료, 플래시 시작
        if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
        setCountdown(null);

        // 글자 생성
        const newLetters = generateLetters(currentConfig);
        setLetters(newLetters);
        setGameState('flashing');

        // 플래시 지속 시간 후 답변 단계로
        flashTimerRef.current = setTimeout(() => {
          setGameState('answering');
          // 초기 답변 설정
          const initialAnswers: Record<string, number> = {};
          currentConfig.letterTypes.forEach((type) => {
            initialAnswers[type] = 0;
          });
          setUserAnswers(initialAnswers);
        }, currentConfig.flashDuration * 1000);
      }
    }, 1000);
  }, [config]);

  /**
   * 사용자 답변 업데이트
   */
  const updateAnswer = useCallback((char: string, count: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [char]: Math.max(0, count),
    }));
  }, []);

  /**
   * 답변 제출 및 결과 계산
   */
  const submitAnswers = useCallback(() => {
    const actualCounts = countLetters(letters);
    const differences: Record<string, number> = {};
    let isCorrect = true;

    // 모든 글자 타입에 대해 검증
    config.letterTypes.forEach((type) => {
      const actual = actualCounts[type] || 0;
      const user = userAnswers[type] || 0;
      differences[type] = user - actual;

      if (user !== actual) {
        isCorrect = false;
      }
    });

    // 티어 계산
    const tier = getTierByLevel(selectedLevel, isCorrect);

    setResult({
      tier,
      isCorrect,
      actualCounts,
      userCounts: userAnswers,
      differences,
      level: selectedLevel,
    });

    setGameState('result');
  }, [letters, userAnswers, selectedLevel, config.letterTypes]);

  /**
   * 같은 레벨 재도전
   */
  const retryLevel = useCallback(() => {
    setResult(null);
    setUserAnswers({});
    setLetters([]);
    // 바로 카운트다운 시작
    startFlash();
  }, [startFlash]);

  /**
   * 레벨 선택으로 돌아가기
   */
  const goToLevelSelect = useCallback(() => {
    setGameState('selecting');
    setResult(null);
    setUserAnswers({});
    setLetters([]);
  }, []);

  /**
   * 다음 레벨로 (바로 시작)
   */
  const nextLevel = useCallback(() => {
    if (selectedLevel < 5) {
      setResult(null);
      setUserAnswers({});
      setLetters([]);
      startFlash(selectedLevel + 1);
    }
  }, [selectedLevel, startFlash]);

  return {
    // 상태
    selectedLevel,
    gameState,
    letters,
    userAnswers,
    result,
    countdown,
    config,

    // 액션
    selectLevel,
    startFlash,
    updateAnswer,
    submitAnswers,
    retryLevel,
    goToLevelSelect,
    nextLevel,
  };
}
