/**
 * useDualNBackLogic.ts
 * 듀얼 엔백 게임의 핵심 로직을 담당하는 커스텀 훅
 *
 * - 시퀀스 생성 (30% 매칭 확률 보장)
 * - 타이밍 제어 (3초/턴: 자극 1초 + 대기 2초)
 * - Web Speech API를 통한 알파벳 발음
 * - 정답/오답 판정
 */

import { useState, useCallback, useRef, useEffect } from 'react';

// 게임 상태 타입
export type GameStatus = 'ready' | 'playing' | 'stimulus' | 'waiting' | 'finished';

// 피드백 타입 (정답/오답)
export type FeedbackType = 'none' | 'correct' | 'wrong';

// 한 턴의 자극 데이터
export interface Trial {
  position: number; // 0-8 (3x3 그리드)
  sound: string; // 알파벳
}

// 사용자 응답 기록
export interface Response {
  positionMatch: boolean;
  soundMatch: boolean;
}

// 알파벳 후보 (발음이 명확한 것들)
const LETTERS = ['C', 'H', 'K', 'L', 'Q', 'R', 'S', 'T'];

// 그리드 위치 개수
const GRID_SIZE = 9;

// 타이밍 설정 (밀리초)
const STIMULUS_DURATION = 1000; // 자극 제시 시간
const WAIT_DURATION = 2000; // 대기 시간

interface UseDualNBackLogicReturn {
  // 상태
  level: number;
  trials: Trial[];
  currentTrialIndex: number;
  status: GameStatus;
  activePosition: number | null;
  positionFeedback: FeedbackType;
  soundFeedback: FeedbackType;
  score: { correct: number; wrong: number; missed: number };
  totalTrials: number;

  // 액션
  setLevel: (n: number) => void;
  startGame: () => void;
  handlePositionMatch: () => void;
  handleSoundMatch: () => void;
  resetGame: () => void;
}

/**
 * 약 30% 확률로 N-back 매칭이 발생하도록 시퀀스 생성
 */
function generateTrials(totalTrials: number, nBack: number): Trial[] {
  const trials: Trial[] = [];
  const matchProbability = 0.3; // 30% 매칭 확률

  for (let i = 0; i < totalTrials; i++) {
    let position: number;
    let sound: string;

    if (i >= nBack) {
      // 위치 매칭 결정
      if (Math.random() < matchProbability) {
        position = trials[i - nBack].position;
      } else {
        // 매칭이 아닐 경우, 이전 위치와 다른 위치 선택
        do {
          position = Math.floor(Math.random() * GRID_SIZE);
        } while (position === trials[i - nBack].position);
      }

      // 소리 매칭 결정
      if (Math.random() < matchProbability) {
        sound = trials[i - nBack].sound;
      } else {
        // 매칭이 아닐 경우, 이전 소리와 다른 소리 선택
        do {
          sound = LETTERS[Math.floor(Math.random() * LETTERS.length)];
        } while (sound === trials[i - nBack].sound);
      }
    } else {
      // 처음 N번은 완전 랜덤
      position = Math.floor(Math.random() * GRID_SIZE);
      sound = LETTERS[Math.floor(Math.random() * LETTERS.length)];
    }

    trials.push({ position, sound });
  }

  return trials;
}

/**
 * Web Speech API를 사용하여 알파벳 발음
 */
function speakLetter(letter: string): void {
  if (!window.speechSynthesis) {
    console.warn('Web Speech API를 지원하지 않는 브라우저입니다.');
    return;
  }

  // 이전 발음 취소
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(letter);
  utterance.lang = 'en-US'; // 영어 발음
  utterance.rate = 0.8; // 약간 느리게
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  window.speechSynthesis.speak(utterance);
}

export function useDualNBackLogic(initialLevel: number = 2): UseDualNBackLogicReturn {
  // 게임 설정
  const [level, setLevel] = useState(initialLevel);
  const [totalTrials] = useState(25); // 총 25턴

  // 게임 상태
  const [trials, setTrials] = useState<Trial[]>([]);
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);
  const [status, setStatus] = useState<GameStatus>('ready');
  const [activePosition, setActivePosition] = useState<number | null>(null);

  // 피드백 상태
  const [positionFeedback, setPositionFeedback] = useState<FeedbackType>('none');
  const [soundFeedback, setSoundFeedback] = useState<FeedbackType>('none');

  // 점수
  const [score, setScore] = useState({ correct: 0, wrong: 0, missed: 0 });

  // 현재 턴의 응답 기록 (중복 응답 방지)
  const currentResponseRef = useRef<Response>({ positionMatch: false, soundMatch: false });

  // 타이머 ref
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const waitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 게임 시작 플래그 (첫 자극 제시 트리거용)
  const [isGameStarted, setIsGameStarted] = useState(false);

  // 피드백 초기화
  const clearFeedback = useCallback(() => {
    setPositionFeedback('none');
    setSoundFeedback('none');
  }, []);

  // 현재 턴이 실제로 매칭인지 확인
  const checkActualMatch = useCallback(
    (trialIndex: number, trialList: Trial[]): { positionMatch: boolean; soundMatch: boolean } => {
      if (trialIndex < level || trialList.length === 0) {
        return { positionMatch: false, soundMatch: false };
      }

      const current = trialList[trialIndex];
      const nBackTrial = trialList[trialIndex - level];

      if (!current || !nBackTrial) {
        return { positionMatch: false, soundMatch: false };
      }

      return {
        positionMatch: current.position === nBackTrial.position,
        soundMatch: current.sound === nBackTrial.sound,
      };
    },
    [level]
  );

  // 타이머 정리 함수
  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (waitTimerRef.current) {
      clearTimeout(waitTimerRef.current);
      waitTimerRef.current = null;
    }
  }, []);

  // 게임 시작
  const startGame = useCallback(() => {
    clearTimers();
    const newTrials = generateTrials(totalTrials, level);
    setTrials(newTrials);
    setCurrentTrialIndex(0);
    setStatus('playing');
    setActivePosition(null);
    setScore({ correct: 0, wrong: 0, missed: 0 });
    currentResponseRef.current = { positionMatch: false, soundMatch: false };
    clearFeedback();
    setIsGameStarted(true);
  }, [totalTrials, level, clearFeedback, clearTimers]);

  // trials가 설정되고 게임이 시작되면 첫 자극 제시
  useEffect(() => {
    if (isGameStarted && trials.length > 0 && status === 'playing') {
      setIsGameStarted(false); // 플래그 리셋

      // 약간의 딜레이 후 첫 자극 제시
      timerRef.current = setTimeout(() => {
        const trial = trials[0];
        setStatus('stimulus');
        setActivePosition(trial.position);
        speakLetter(trial.sound);

        // 1초 후 자극 숨김
        timerRef.current = setTimeout(() => {
          setActivePosition(null);
          setStatus('waiting');

          // 2초 대기 후 다음 턴
          waitTimerRef.current = setTimeout(() => {
            // 첫 턴 놓친 것 체크
            const actual = checkActualMatch(0, trials);
            const response = currentResponseRef.current;
            let missedCount = 0;
            if (actual.positionMatch && !response.positionMatch) missedCount++;
            if (actual.soundMatch && !response.soundMatch) missedCount++;
            if (missedCount > 0) {
              setScore((prev) => ({ ...prev, missed: prev.missed + missedCount }));
            }

            // 응답 초기화 후 다음 턴
            currentResponseRef.current = { positionMatch: false, soundMatch: false };
            setCurrentTrialIndex(1);
          }, WAIT_DURATION);
        }, STIMULUS_DURATION);
      }, 500);
    }
  }, [isGameStarted, trials, status, checkActualMatch]);

  // currentTrialIndex가 변경될 때 자극 제시 (첫 턴 제외)
  useEffect(() => {
    if (currentTrialIndex > 0 && currentTrialIndex < totalTrials && trials.length > 0) {
      const trial = trials[currentTrialIndex];
      if (!trial) return;

      setStatus('stimulus');
      setActivePosition(trial.position);
      clearFeedback();
      speakLetter(trial.sound);

      // 1초 후 자극 숨김
      timerRef.current = setTimeout(() => {
        setActivePosition(null);
        setStatus('waiting');

        // 2초 대기 후 다음 턴
        waitTimerRef.current = setTimeout(() => {
          // 현재 턴 놓친 것 체크
          const actual = checkActualMatch(currentTrialIndex, trials);
          const response = currentResponseRef.current;
          let missedCount = 0;
          if (actual.positionMatch && !response.positionMatch) missedCount++;
          if (actual.soundMatch && !response.soundMatch) missedCount++;
          if (missedCount > 0) {
            setScore((prev) => ({ ...prev, missed: prev.missed + missedCount }));
          }

          // 다음 턴으로
          const nextIndex = currentTrialIndex + 1;
          if (nextIndex >= totalTrials) {
            setStatus('finished');
            setActivePosition(null);
          } else {
            currentResponseRef.current = { positionMatch: false, soundMatch: false };
            setCurrentTrialIndex(nextIndex);
          }
        }, WAIT_DURATION);
      }, STIMULUS_DURATION);
    }
  }, [currentTrialIndex, totalTrials, trials, checkActualMatch, clearFeedback]);

  // 위치 일치 응답
  const handlePositionMatch = useCallback(() => {
    if (status !== 'stimulus' && status !== 'waiting') return;
    if (currentResponseRef.current.positionMatch) return; // 이미 응답함

    currentResponseRef.current.positionMatch = true;

    const actual = checkActualMatch(currentTrialIndex, trials);

    if (actual.positionMatch) {
      setPositionFeedback('correct');
      setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setPositionFeedback('wrong');
      setScore((prev) => ({ ...prev, wrong: prev.wrong + 1 }));
    }

    // 피드백 자동 초기화
    setTimeout(() => setPositionFeedback('none'), 300);
  }, [status, currentTrialIndex, trials, checkActualMatch]);

  // 소리 일치 응답
  const handleSoundMatch = useCallback(() => {
    if (status !== 'stimulus' && status !== 'waiting') return;
    if (currentResponseRef.current.soundMatch) return; // 이미 응답함

    currentResponseRef.current.soundMatch = true;

    const actual = checkActualMatch(currentTrialIndex, trials);

    if (actual.soundMatch) {
      setSoundFeedback('correct');
      setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setSoundFeedback('wrong');
      setScore((prev) => ({ ...prev, wrong: prev.wrong + 1 }));
    }

    // 피드백 자동 초기화
    setTimeout(() => setSoundFeedback('none'), 300);
  }, [status, currentTrialIndex, trials, checkActualMatch]);

  // 게임 리셋
  const resetGame = useCallback(() => {
    clearTimers();
    window.speechSynthesis?.cancel();

    setTrials([]);
    setCurrentTrialIndex(0);
    setStatus('ready');
    setActivePosition(null);
    setScore({ correct: 0, wrong: 0, missed: 0 });
    currentResponseRef.current = { positionMatch: false, soundMatch: false };
    clearFeedback();
    setIsGameStarted(false);
  }, [clearFeedback, clearTimers]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      clearTimers();
      window.speechSynthesis?.cancel();
    };
  }, [clearTimers]);

  return {
    level,
    trials,
    currentTrialIndex,
    status,
    activePosition,
    positionFeedback,
    soundFeedback,
    score,
    totalTrials,
    setLevel,
    startGame,
    handlePositionMatch,
    handleSoundMatch,
    resetGame,
  };
}
