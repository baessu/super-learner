/**
 * useSpeedReaderEngine.ts
 * RSVP 속도 리더 핵심 엔진 훅
 */

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import type { ParsedWord, TrainingMode, DropSetPhase } from './types';
import { parseText, wpmToMs } from './utils/textParser';
import { DEFAULTS, PAUSE_MULTIPLIERS } from './constants';

interface UseSpeedReaderEngineOptions {
  initialWpm?: number;
}

export function useSpeedReaderEngine(options: UseSpeedReaderEngineOptions = {}) {
  const { initialWpm = DEFAULTS.wpm } = options;

  // Core state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [textArray, setTextArray] = useState<ParsedWord[]>([]);
  const [wpm, setWpm] = useState(initialWpm);

  // Training mode state
  const [mode, setMode] = useState<TrainingMode>('normal');
  const [currentPhase, setCurrentPhase] = useState<DropSetPhase>('normal');

  // Progressive mode settings
  const [startWpm, setStartWpm] = useState(DEFAULTS.progressiveStartWpm);
  const [targetWpm, setTargetWpm] = useState(DEFAULTS.progressiveTargetWpm);

  // Timing refs
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phaseStartRef = useRef<number>(Date.now());

  // Derived state
  const currentWord = textArray[currentIndex] || null;
  const totalWords = textArray.length;
  const progress = totalWords > 0 ? (currentIndex / totalWords) * 100 : 0;
  const isComplete = currentIndex >= totalWords && totalWords > 0;

  // Calculate effective WPM based on mode
  const effectiveWpm = useMemo(() => {
    if (mode === 'normal') {
      return wpm;
    }

    if (mode === 'progressive') {
      // Linear interpolation from start to target
      const progressRatio = progress / 100;
      return Math.round(startWpm + (targetWpm - startWpm) * progressRatio);
    }

    if (mode === 'drop-set') {
      // Sprint: 2.5x, Normal: 1x
      return currentPhase === 'sprint'
        ? Math.round(wpm * DEFAULTS.sprintMultiplier)
        : wpm;
    }

    return wpm;
  }, [mode, wpm, progress, startWpm, targetWpm, currentPhase]);

  // Calculate interval with smart pause
  const getInterval = useCallback(
    (word: ParsedWord | null): number => {
      const baseInterval = wpmToMs(effectiveWpm);

      if (!word) return baseInterval;

      if (word.isParagraphEnd) {
        return baseInterval * PAUSE_MULTIPLIERS.paragraphEnd;
      }

      if (word.isPunctuation) {
        return baseInterval * PAUSE_MULTIPLIERS.punctuation;
      }

      return baseInterval;
    },
    [effectiveWpm]
  );

  // Drop Set phase cycling
  useEffect(() => {
    if (mode !== 'drop-set' || !isPlaying) {
      if (phaseTimerRef.current) {
        clearTimeout(phaseTimerRef.current);
        phaseTimerRef.current = null;
      }
      setCurrentPhase('normal');
      return;
    }

    const cyclePhase = () => {
      setCurrentPhase((prev) => {
        const next = prev === 'normal' ? 'sprint' : 'normal';
        const duration =
          next === 'sprint'
            ? DEFAULTS.sprintDuration
            : DEFAULTS.normalDuration;

        phaseTimerRef.current = setTimeout(cyclePhase, duration);
        phaseStartRef.current = Date.now();

        return next;
      });
    };

    // Start with normal phase
    setCurrentPhase('normal');
    phaseStartRef.current = Date.now();
    phaseTimerRef.current = setTimeout(cyclePhase, DEFAULTS.normalDuration);

    return () => {
      if (phaseTimerRef.current) {
        clearTimeout(phaseTimerRef.current);
      }
    };
  }, [mode, isPlaying]);

  // Core playback logic
  useEffect(() => {
    if (!isPlaying || isComplete) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    const word = textArray[currentIndex];
    const interval = getInterval(word);

    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, interval);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isPlaying, currentIndex, textArray, getInterval, isComplete]);

  // Actions
  const loadText = useCallback((text: string) => {
    const parsed = parseText(text);
    setTextArray(parsed);
    setCurrentIndex(0);
    setIsPlaying(false);
    startTimeRef.current = null;
  }, []);

  const play = useCallback(() => {
    if (textArray.length === 0) return;

    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }
    setIsPlaying(true);
  }, [textArray.length]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setCurrentIndex(0);
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentIndex(0);
    setTextArray([]);
    startTimeRef.current = null;
    setCurrentPhase('normal');
  }, []);

  const seekTo = useCallback(
    (index: number) => {
      const clampedIndex = Math.max(0, Math.min(index, totalWords - 1));
      setCurrentIndex(clampedIndex);
    },
    [totalWords]
  );

  // Calculate elapsed time
  const getElapsedTime = useCallback((): number => {
    if (!startTimeRef.current) return 0;
    return (Date.now() - startTimeRef.current) / 1000;
  }, []);

  // Calculate average WPM
  const getAverageWpm = useCallback((): number => {
    const elapsed = getElapsedTime();
    if (elapsed === 0 || currentIndex === 0) return 0;
    return Math.round((currentIndex / elapsed) * 60);
  }, [getElapsedTime, currentIndex]);

  return {
    // State
    isPlaying,
    currentIndex,
    textArray,
    wpm,
    effectiveWpm,
    currentWord,
    totalWords,
    progress,
    isComplete,

    // Training mode
    mode,
    currentPhase,
    startWpm,
    targetWpm,

    // Actions
    loadText,
    play,
    pause,
    stop,
    reset,
    seekTo,
    setWpm,
    setMode,
    setStartWpm,
    setTargetWpm,

    // Utilities
    getElapsedTime,
    getAverageWpm,
  };
}
