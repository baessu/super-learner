/**
 * ControlPanel.tsx
 * WPM 슬라이더, 모드 선택 컴포넌트
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TrainingMode } from '../types';
import { DEFAULTS } from '../constants';
import { Gauge, TrendingUp, Zap, HelpCircle } from 'lucide-react';

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

/** 툴팁 컴포넌트 */
function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-flex items-center">
      {children}
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="ml-1.5 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="도움말"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-2 z-50 w-64 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg"
          >
            <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-800 rotate-45" />
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const MODE_OPTIONS: {
  value: TrainingMode;
  label: string;
  icon: React.ReactNode;
  description: string;
  tooltip: string;
}[] = [
  {
    value: 'normal',
    label: '기본',
    icon: <Gauge className="w-4 h-4" />,
    description: '일정한 속도로 훈련',
    tooltip: '설정한 WPM 속도를 처음부터 끝까지 일정하게 유지합니다. 속독 훈련을 처음 시작하거나 특정 속도에 익숙해지고 싶을 때 추천합니다.',
  },
  {
    value: 'progressive',
    label: '점진적 과부하',
    icon: <TrendingUp className="w-4 h-4" />,
    description: '시작 → 목표 속도로 점진 증가',
    tooltip: '텍스트 진행에 따라 속도가 점점 빨라집니다. 운동의 점진적 과부하 원리처럼, 뇌가 점차 빠른 속도에 적응하도록 훈련합니다. 현재 수준보다 높은 목표를 설정하세요.',
  },
  {
    value: 'drop-set',
    label: '드롭 세트',
    icon: <Zap className="w-4 h-4" />,
    description: '5초 스프린트 + 20초 정속 반복',
    tooltip: '인터벌 트레이닝 방식입니다. 5초간 매우 빠른 속도(2.5배)로 읽다가 20초간 정상 속도로 돌아오기를 반복합니다. 고속 처리 능력을 키우면서도 지치지 않게 훈련할 수 있습니다.',
  },
];

const TOOLTIPS = {
  wpm: 'WPM(Words Per Minute)은 분당 읽는 단어 수입니다. 일반적인 성인의 평균 읽기 속도는 200-300 WPM이며, 숙련된 속독가는 600-1000 WPM 이상을 달성합니다.',
  startWpm: '훈련 시작 시의 속도입니다. 현재 편안하게 읽을 수 있는 속도로 설정하세요. 너무 낮으면 훈련 효과가 줄어들고, 너무 높으면 처음부터 부담이 됩니다.',
  targetWpm: '훈련 종료 시 도달할 목표 속도입니다. 현재 최대 속도보다 20-50% 높게 설정하면 효과적입니다. 달성 불가능해 보여도 괜찮습니다 - 뇌는 적응합니다!',
};

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
          <Tooltip text={TOOLTIPS.wpm}>
            <label className="text-sm font-medium text-gray-700">
              {mode === 'normal' ? '읽기 속도' : '기본 속도'}
            </label>
          </Tooltip>
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
            <div key={option.value} className="relative group">
              <button
                onClick={() => onModeChange(option.value)}
                className={`w-full flex flex-col items-start gap-1 p-3 rounded-xl border-2 transition-all ${
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
              {/* Mode tooltip on hover */}
              <div className="absolute left-0 right-0 bottom-full mb-2 z-50 hidden group-hover:block">
                <div className="p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg">
                  {option.tooltip}
                  <div className="absolute -bottom-1 left-6 w-2 h-2 bg-gray-800 rotate-45" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progressive Mode Settings */}
      {mode === 'progressive' && (
        <div className="space-y-4 p-4 bg-amber-50 rounded-xl">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Tooltip text={TOOLTIPS.startWpm}>
                <label className="text-sm font-medium text-gray-700">
                  시작 속도
                </label>
              </Tooltip>
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
              <Tooltip text={TOOLTIPS.targetWpm}>
                <label className="text-sm font-medium text-gray-700">
                  목표 속도
                </label>
              </Tooltip>
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
          {/* Progress visualization */}
          <div className="flex items-center gap-2 pt-2 text-xs text-gray-600">
            <span className="font-medium">{startWpm}</span>
            <div className="flex-1 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" />
            <span className="font-medium">{targetWpm}</span>
            <span className="text-gray-400 ml-1">WPM</span>
          </div>
        </div>
      )}

      {/* Drop Set Mode Info */}
      {mode === 'drop-set' && (
        <div className="p-4 bg-gradient-to-r from-red-50 to-green-50 rounded-xl space-y-3">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" />
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
          <p className="text-xs text-gray-500">
            💡 스프린트 구간에서는 이해보다 눈이 따라가는 것에 집중하세요. 정속 구간에서 뇌가 회복됩니다.
          </p>
        </div>
      )}
    </div>
  );
}
