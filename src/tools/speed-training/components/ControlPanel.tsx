/**
 * ControlPanel.tsx
 * WPM 슬라이더, 모드 선택 컴포넌트
 */

import type { TrainingMode } from '../types';
import { DEFAULTS } from '../constants';
import { Gauge, TrendingUp, Zap } from 'lucide-react';

interface ControlPanelProps {
  wpm: number;
  onWpmChange: (wpm: number) => void;
  mode: TrainingMode;
  onModeChange: (mode: TrainingMode) => void;
  // Progressive mode
  startWpm: number;
  onStartWpmChange: (wpm: number) => void;
  targetWpm: number;
  onTargetWpmChange: (wpm: number) => void;
}

const MODE_OPTIONS: { value: TrainingMode; label: string; icon: React.ReactNode; description: string }[] = [
  {
    value: 'normal',
    label: '기본',
    icon: <Gauge className="w-4 h-4" />,
    description: '일정한 속도로 훈련',
  },
  {
    value: 'progressive',
    label: '점진적 과부하',
    icon: <TrendingUp className="w-4 h-4" />,
    description: '시작 → 목표 속도로 점진 증가',
  },
  {
    value: 'drop-set',
    label: '드롭 세트',
    icon: <Zap className="w-4 h-4" />,
    description: '5초 스프린트 + 20초 정속 반복',
  },
];

export function ControlPanel({
  wpm,
  onWpmChange,
  mode,
  onModeChange,
  startWpm,
  onStartWpmChange,
  targetWpm,
  onTargetWpmChange,
}: ControlPanelProps) {
  return (
    <div className="w-full space-y-6 p-5 bg-white rounded-2xl border border-gray-200">
      {/* WPM Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            {mode === 'normal' ? '읽기 속도' : '기본 속도'}
          </label>
          <span className="text-lg font-bold text-amber-600">{wpm} WPM</span>
        </div>
        <input
          type="range"
          min={DEFAULTS.minWpm}
          max={DEFAULTS.maxWpm}
          step={10}
          value={wpm}
          onChange={(e) => onWpmChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>{DEFAULTS.minWpm}</span>
          <span>{DEFAULTS.maxWpm}</span>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">훈련 모드</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {MODE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onModeChange(option.value)}
              className={`flex flex-col items-start gap-1 p-3 rounded-xl border-2 transition-all ${
                mode === option.value
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={
                    mode === option.value ? 'text-amber-600' : 'text-gray-500'
                  }
                >
                  {option.icon}
                </span>
                <span
                  className={`text-sm font-medium ${
                    mode === option.value ? 'text-amber-700' : 'text-gray-700'
                  }`}
                >
                  {option.label}
                </span>
              </div>
              <span className="text-xs text-gray-500">{option.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Progressive Mode Settings */}
      {mode === 'progressive' && (
        <div className="space-y-4 p-4 bg-amber-50 rounded-xl">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                시작 속도
              </label>
              <span className="text-sm font-bold text-amber-600">
                {startWpm} WPM
              </span>
            </div>
            <input
              type="range"
              min={DEFAULTS.minWpm}
              max={targetWpm - 50}
              step={10}
              value={startWpm}
              onChange={(e) => onStartWpmChange(Number(e.target.value))}
              className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                목표 속도
              </label>
              <span className="text-sm font-bold text-orange-600">
                {targetWpm} WPM
              </span>
            </div>
            <input
              type="range"
              min={startWpm + 50}
              max={DEFAULTS.maxWpm}
              step={10}
              value={targetWpm}
              onChange={(e) => onTargetWpmChange(Number(e.target.value))}
              className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>
        </div>
      )}

      {/* Drop Set Mode Info */}
      {mode === 'drop-set' && (
        <div className="p-4 bg-gradient-to-r from-red-50 to-green-50 rounded-xl">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded-full" />
              <span className="text-gray-700">
                스프린트: <strong>{Math.round(wpm * DEFAULTS.sprintMultiplier)} WPM</strong> (5초)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full" />
              <span className="text-gray-700">
                정속: <strong>{wpm} WPM</strong> (20초)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
