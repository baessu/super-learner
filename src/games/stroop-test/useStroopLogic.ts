/**
 * useStroopLogic.ts
 * 스트룹 테스트 게임 로직
 *
 * - 색상 단어와 잉크 색상 생성
 * - 50% 일치 / 50% 불일치 확률
 * - 점수 계산 및 스트릭 보너스
 * - 60초 타이머
 */

import { useState, useCallback, useRef, useEffect } from 'react';

// 게임 상태
export type GameState = 'intro' | 'playing' | 'game-over';

// 색상 정의
export interface ColorDef {
  id: string;
  label: string; // 한글 라벨
  hex: string;   // 색상 코드
  key: string;   // 키보드 단축키
}

// 4가지 색상 (노랑은 더 진한 색 사용)
export const COLORS: ColorDef[] = [
  { id: 'red', label: '빨강', hex: '#EF4444', key: 'Q' },
  { id: 'blue', label: '파랑', hex: '#3B82F6', key: 'W' },
  { id: 'green', label: '초록', hex: '#22C55E', key: 'E' },
  { id: 'yellow', label: '노랑', hex: '#CA8A04', key: 'R' }, // yellow-600 for readability
];

// 현재 문제
export interface Question {
  wordLabel: string;  // 표시되는 단어 (예: "빨강")
  wordId: string;     // 단어의 색상 ID
  inkHex: string;     // 잉크 색상 (정답)
  inkId: string;      // 잉크 색상 ID
  isCongruent: boolean; // 일치 여부
}

// 게임 설정
const GAME_DURATION = 60; // 초
const CORRECT_POINTS = 100;
const INCORRECT_PENALTY = 50;
const STREAK_BONUS_THRESHOLD = 3;
const STREAK_BONUS_POINTS = 20;

/**
 * 문제 생성
 */
function generateQuestion(): Question {
  // 단어 랜덤 선택
  const wordIndex = Math.floor(Math.random() * COLORS.length);
  const wordColor = COLORS[wordIndex];

  // 50% 확률로 일치/불일치 결정
  const isCongruent = Math.random() < 0.5;

  let inkColor: ColorDef;
  if (isCongruent) {
    // 일치: 잉크 = 단어
    inkColor = wordColor;
  } else {
    // 불일치: 잉크 ≠ 단어
    const otherColors = COLORS.filter((c) => c.id !== wordColor.id);
    inkColor = otherColors[Math.floor(Math.random() * otherColors.length)];
  }

  return {
    wordLabel: wordColor.label,
    wordId: wordColor.id,
    inkHex: inkColor.hex,
    inkId: inkColor.id,
    isCongruent,
  };
}

export function useStroopLogic() {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [question, setQuestion] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0, total: 0 });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    };
  }, []);

  // 타이머 시작
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setGameState('game-over');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [gameState, timeLeft]);

  /**
   * 게임 시작
   */
  const startGame = useCallback(() => {
    setScore(0);
    setStreak(0);
    setTimeLeft(GAME_DURATION);
    setStats({ correct: 0, incorrect: 0, total: 0 });
    setQuestion(generateQuestion());
    setFeedback(null);
    setGameState('playing');
  }, []);

  /**
   * 다음 문제로
   */
  const nextQuestion = useCallback(() => {
    setQuestion(generateQuestion());
  }, []);

  /**
   * 답변 처리
   */
  const submitAnswer = useCallback(
    (colorId: string) => {
      if (gameState !== 'playing' || !question || feedback) return;

      const isCorrect = colorId === question.inkId;

      if (isCorrect) {
        // 정답
        const newStreak = streak + 1;
        let points = CORRECT_POINTS;

        // 스트릭 보너스
        if (newStreak >= STREAK_BONUS_THRESHOLD) {
          points += STREAK_BONUS_POINTS * (newStreak - STREAK_BONUS_THRESHOLD + 1);
        }

        setScore((prev) => prev + points);
        setStreak(newStreak);
        setStats((prev) => ({
          correct: prev.correct + 1,
          incorrect: prev.incorrect,
          total: prev.total + 1,
        }));

        // 즉시 다음 문제
        nextQuestion();
      } else {
        // 오답
        setScore((prev) => Math.max(0, prev - INCORRECT_PENALTY));
        setStreak(0);
        setStats((prev) => ({
          correct: prev.correct,
          incorrect: prev.incorrect + 1,
          total: prev.total + 1,
        }));

        // 피드백 표시 후 다음 문제
        setFeedback('wrong');
        feedbackTimeoutRef.current = setTimeout(() => {
          setFeedback(null);
          nextQuestion();
        }, 300);
      }
    },
    [gameState, question, feedback, streak, nextQuestion]
  );

  /**
   * 키보드 입력 처리
   */
  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameState !== 'playing') return;

      const upperKey = key.toUpperCase();
      const color = COLORS.find((c) => c.key === upperKey);
      if (color) {
        submitAnswer(color.id);
      }
    },
    [gameState, submitAnswer]
  );

  /**
   * 게임 리셋
   */
  const resetGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    setGameState('intro');
    setScore(0);
    setStreak(0);
    setTimeLeft(GAME_DURATION);
    setQuestion(null);
    setFeedback(null);
    setStats({ correct: 0, incorrect: 0, total: 0 });
  }, []);

  // 정확도 계산
  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

  return {
    // 상태
    gameState,
    score,
    streak,
    timeLeft,
    question,
    feedback,
    stats,
    accuracy,
    gameDuration: GAME_DURATION,

    // 액션
    startGame,
    submitAnswer,
    handleKeyPress,
    resetGame,
  };
}
