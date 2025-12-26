/**
 * ControlPanel.tsx
 * 듀얼 엔백 게임의 컨트롤 패널 컴포넌트
 *
 * - 위치 일치 / 소리 일치 버튼
 * - 키보드 단축키 안내 (A / L)
 * - 피드백 애니메이션
 */

import type { FeedbackType } from './useDualNBackLogic';

interface ControlPanelProps {
  onPositionMatch: () => void;
  onSoundMatch: () => void;
  positionFeedback: FeedbackType;
  soundFeedback: FeedbackType;
  disabled: boolean;
}

export function ControlPanel({
  onPositionMatch,
  onSoundMatch,
  positionFeedback,
  soundFeedback,
  disabled,
}: ControlPanelProps) {
  // 피드백에 따른 버튼 스타일
  const getButtonStyle = (feedback: FeedbackType, baseColor: string) => {
    switch (feedback) {
      case 'correct':
        return 'bg-emerald-500 border-emerald-400 scale-95';
      case 'wrong':
        return 'bg-red-500 border-red-400 animate-shake scale-95';
      default:
        return baseColor;
    }
  };

  return (
    <div className="flex gap-4 sm:gap-6 w-full max-w-md">
      {/* 위치 일치 버튼 */}
      <button
        onClick={onPositionMatch}
        disabled={disabled}
        className={`
          flex-1 flex flex-col items-center justify-center
          py-4 sm:py-6 px-4
          rounded-2xl border-2
          font-bold text-white
          transition-all duration-150
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}
          ${getButtonStyle(
            positionFeedback,
            'bg-indigo-600 border-indigo-500 hover:bg-indigo-700'
          )}
        `}
      >
        <span className="text-base sm:text-lg mb-1">위치 같음</span>
        <span className="text-xs sm:text-sm opacity-70 bg-white/20 px-2 py-0.5 rounded">
          A 키
        </span>
      </button>

      {/* 소리 일치 버튼 */}
      <button
        onClick={onSoundMatch}
        disabled={disabled}
        className={`
          flex-1 flex flex-col items-center justify-center
          py-4 sm:py-6 px-4
          rounded-2xl border-2
          font-bold text-white
          transition-all duration-150
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}
          ${getButtonStyle(
            soundFeedback,
            'bg-purple-600 border-purple-500 hover:bg-purple-700'
          )}
        `}
      >
        <span className="text-base sm:text-lg mb-1">소리 같음</span>
        <span className="text-xs sm:text-sm opacity-70 bg-white/20 px-2 py-0.5 rounded">
          L 키
        </span>
      </button>
    </div>
  );
}
