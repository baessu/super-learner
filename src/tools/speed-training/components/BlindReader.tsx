/**
 * BlindReader.tsx
 * Anti-Regression 리더 뷰 컴포넌트
 */

import { motion } from 'framer-motion';
import { Pause, Play, Square, SkipBack } from 'lucide-react';
import type { ParsedWord, TrainingMode, DropSetPhase } from '../types';
import { WORD_STYLES, LINE_HEIGHT, THEME } from '../constants';
import { PhaseIndicator } from './PhaseIndicator';

interface BlindReaderProps {
  words: ParsedWord[];
  currentIndex: number;
  isPlaying: boolean;
  effectiveWpm: number;
  progress: number;
  mode: TrainingMode;
  currentPhase: DropSetPhase;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onReset: () => void;
}

export function BlindReader({
  words,
  currentIndex,
  isPlaying,
  effectiveWpm,
  progress,
  mode,
  currentPhase,
  onPlay,
  onPause,
  onStop,
  onReset,
}: BlindReaderProps) {
  const getBorderColor = () => {
    if (mode === 'drop-set') {
      return currentPhase === 'sprint' ? THEME.sprint : THEME.normal;
    }
    return THEME.primary;
  };

  // 현재 단어를 화면 중앙에 유지하기 위한 Y 오프셋 계산
  const containerOffset = -currentIndex * LINE_HEIGHT;

  return (
    <div className="fixed inset-0 z-50 bg-warm-50 flex flex-col">
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b-4 transition-colors duration-300"
        style={{ borderColor: getBorderColor() }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onReset}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="처음으로"
          >
            <SkipBack className="w-5 h-5 text-gray-600" />
          </button>
          <div className="text-sm text-gray-600">
            <span className="font-bold text-gray-800">{currentIndex + 1}</span>
            <span> / {words.length} 단어</span>
          </div>
        </div>

        {/* Phase indicator for drop-set mode */}
        {mode === 'drop-set' && <PhaseIndicator phase={currentPhase} />}

        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="font-bold text-amber-600">{effectiveWpm}</span>
            <span className="text-gray-500"> WPM</span>
          </div>
          <button
            onClick={onStop}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="종료"
          >
            <Square className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-200">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Word display area */}
      <div className="flex-1 overflow-hidden relative flex items-center justify-center">
        {/* Focus line indicator - 화면 중앙 */}
        <div
          className="absolute left-0 right-0 h-0.5 bg-amber-400/30 pointer-events-none z-10"
          style={{ top: '50%' }}
        />

        {/* Words container - Framer Motion으로 Y축 이동 */}
        <motion.div
          className="flex flex-col items-center"
          animate={{ y: containerOffset }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            mass: 0.8,
          }}
        >
          {words.map((word, idx) => {
            const isCurrent = idx === currentIndex;
            const isPast = idx < currentIndex;
            const style = isCurrent
              ? WORD_STYLES.current
              : isPast
              ? WORD_STYLES.past
              : WORD_STYLES.future;

            return (
              <motion.div
                key={word.id}
                className="flex items-center justify-center"
                style={{ height: LINE_HEIGHT }}
                animate={{
                  opacity: style.opacity,
                  scale: style.scale,
                  filter: `blur(${style.blur}px)`,
                }}
                transition={{ duration: 0.1, ease: 'easeOut' }}
              >
                <span
                  className="text-3xl md:text-5xl font-bold transition-colors duration-100"
                  style={{
                    color: isCurrent
                      ? mode === 'drop-set' && currentPhase === 'sprint'
                        ? THEME.sprint
                        : THEME.text.current
                      : isPast
                      ? THEME.text.past
                      : THEME.text.future,
                  }}
                >
                  {word.text}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Control bar */}
      <div className="flex items-center justify-center gap-4 px-6 py-6 bg-white border-t border-gray-200">
        <button
          onClick={isPlaying ? onPause : onPlay}
          className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full shadow-lg transition-all active:scale-95"
        >
          {isPlaying ? (
            <Pause className="w-7 h-7" />
          ) : (
            <Play className="w-7 h-7 ml-1" />
          )}
        </button>
      </div>
    </div>
  );
}
