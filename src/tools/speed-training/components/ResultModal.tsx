/**
 * ResultModal.tsx
 * 훈련 완료 결과 모달
 */

import { motion } from 'framer-motion';
import { Trophy, Clock, Gauge, RefreshCw, FileText } from 'lucide-react';
import type { TrainingResult, TrainingMode } from '../types';

interface ResultModalProps {
  result: TrainingResult;
  onRestart: () => void;
  onNewText: () => void;
}

const MODE_LABELS: Record<TrainingMode, string> = {
  normal: '기본 모드',
  progressive: '점진적 과부하',
  'drop-set': '드롭 세트',
};

export function ResultModal({ result, onRestart, onNewText }: ResultModalProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins > 0 ? `${mins}분 ${secs}초` : `${secs}초`;
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-8 text-center text-white">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <Trophy className="w-16 h-16 mx-auto mb-3" />
          </motion.div>
          <h2 className="text-2xl font-bold">훈련 완료!</h2>
          <p className="text-amber-100 mt-1">{MODE_LABELS[result.mode]}</p>
        </div>

        {/* Stats */}
        <div className="px-6 py-6 space-y-4">
          {/* Average WPM */}
          <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <Gauge className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-gray-700 font-medium">평균 속도</span>
            </div>
            <span className="text-2xl font-bold text-amber-600">
              {result.averageWpm} <span className="text-sm font-normal">WPM</span>
            </span>
          </div>

          {/* Completion time */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-gray-700 font-medium">완독 시간</span>
            </div>
            <span className="text-xl font-bold text-gray-800">
              {formatTime(result.completionTimeSeconds)}
            </span>
          </div>

          {/* Word count */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-gray-700 font-medium">읽은 단어</span>
            </div>
            <span className="text-xl font-bold text-gray-800">
              {result.totalWords.toLocaleString()}개
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onRestart}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>다시 하기</span>
          </button>
          <button
            onClick={onNewText}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-xl transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>새 텍스트</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
