/**
 * SpeedTraining
 * RSVP 속도 훈련 도구 메인 컴포넌트
 */

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ArrowLeft, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { AppPhase, TrainingResult } from './types';
import { useSpeedReaderEngine } from './useSpeedReaderEngine';
import { TextInputArea } from './components/TextInputArea';
import { ControlPanel } from './components/ControlPanel';
import { BlindReader } from './components/BlindReader';
import { ResultModal } from './components/ResultModal';

export default function SpeedTraining() {
  const [phase, setPhase] = useState<AppPhase>('input');
  const [result, setResult] = useState<TrainingResult | null>(null);

  const engine = useSpeedReaderEngine();

  // Handle text submission
  const handleTextSubmit = useCallback(
    (text: string) => {
      engine.loadText(text);
    },
    [engine]
  );

  // Start training
  const handleStartTraining = useCallback(() => {
    if (engine.textArray.length > 0) {
      setPhase('training');
      engine.play();
    }
  }, [engine]);

  // Handle training completion
  useEffect(() => {
    if (engine.isComplete && phase === 'training') {
      const elapsed = engine.getElapsedTime();
      const avgWpm = engine.getAverageWpm();

      setResult({
        totalWords: engine.totalWords,
        completionTimeSeconds: elapsed,
        averageWpm: avgWpm,
        mode: engine.mode,
      });
      setPhase('result');
    }
  }, [engine.isComplete, phase, engine]);

  // Stop training
  const handleStop = useCallback(() => {
    engine.stop();
    setPhase('input');
  }, [engine]);

  // Restart training (same text)
  const handleRestart = useCallback(() => {
    engine.stop();
    setPhase('training');
    engine.play();
  }, [engine]);

  // New text
  const handleNewText = useCallback(() => {
    engine.reset();
    setResult(null);
    setPhase('input');
  }, [engine]);

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Input Phase */}
      {phase === 'input' && (
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              to="/tools"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-amber-500" />
                <h1 className="text-2xl font-bold text-gray-800">
                  RSVP 속도 훈련
                </h1>
              </div>
              <p className="text-gray-500 text-sm mt-1">
                빠른 시각 프레젠테이션으로 읽기 속도를 향상시킵니다
              </p>
            </div>
          </div>

          {/* Text Input */}
          <div className="space-y-6">
            <TextInputArea onTextSubmit={handleTextSubmit} />

            {/* Control Panel - show when text is loaded */}
            {engine.textArray.length > 0 && (
              <>
                <div className="text-center py-2">
                  <span className="text-sm text-gray-500">
                    {engine.totalWords.toLocaleString()} 단어 준비됨
                  </span>
                </div>

                <ControlPanel
                  wpm={engine.wpm}
                  onWpmChange={engine.setWpm}
                  mode={engine.mode}
                  onModeChange={engine.setMode}
                  startWpm={engine.startWpm}
                  onStartWpmChange={engine.setStartWpm}
                  targetWpm={engine.targetWpm}
                  onTargetWpmChange={engine.setTargetWpm}
                />

                {/* Start button */}
                <button
                  onClick={handleStartTraining}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-lg font-bold rounded-2xl transition-all active:scale-[0.98] shadow-lg"
                >
                  훈련 시작
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Training Phase */}
      {phase === 'training' && (
        <BlindReader
          words={engine.textArray}
          currentIndex={engine.currentIndex}
          isPlaying={engine.isPlaying}
          effectiveWpm={engine.effectiveWpm}
          progress={engine.progress}
          mode={engine.mode}
          currentPhase={engine.currentPhase}
          onPlay={engine.play}
          onPause={engine.pause}
          onStop={handleStop}
          onReset={() => engine.seekTo(0)}
        />
      )}

      {/* Result Phase */}
      <AnimatePresence>
        {phase === 'result' && result && (
          <ResultModal
            result={result}
            onRestart={handleRestart}
            onNewText={handleNewText}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
