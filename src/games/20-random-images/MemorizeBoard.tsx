/**
 * MemorizeBoard.tsx
 * 기억 단계 화면 컴포넌트
 *
 * - Sparse Grid (8x8) + Jittering 레이아웃
 * - 모바일 4열, PC 8열 반응형
 * - 이모지가 셀 중앙에서 살짝 벗어나 자연스러운 느낌
 */

import { Clock } from 'lucide-react';
import type { GridItem } from './useImageMemoryLogic';

interface MemorizeBoardProps {
  gridData: (GridItem | null)[];
  elapsedTime: number;
  onFinish: () => void;
}

/**
 * 밀리초를 MM:SS.s 형식으로 변환
 */
function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((ms % 1000) / 100);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${tenths}`;
}

export function MemorizeBoard({ gridData, elapsedTime, onFinish }: MemorizeBoardProps) {
  return (
    <div className="flex flex-col items-center w-full">
      {/* 상단: 경과 시간 */}
      <div className="flex items-center gap-2 mb-3 px-4 py-2 bg-indigo-50 rounded-full">
        <Clock className="w-5 h-5 text-indigo-600" />
        <span className="text-xl font-mono font-bold text-indigo-600">
          {formatTime(elapsedTime)}
        </span>
      </div>

      {/* 팁 메시지 */}
      <div className="mb-4 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl">
        <p className="text-sm text-amber-700 text-center">
          💡 위치와 순서를 함께 기억하세요! (나만의 이야기를 만들어보세요)
        </p>
      </div>

      {/* Sparse Grid (8x8) - 모바일 4열, PC 8열 */}
      <div className="w-full max-w-2xl mb-6 px-2">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-1 md:gap-2 p-3 bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl shadow-inner">
          {gridData.map((item, index) => (
            <div
              key={index}
              className="relative aspect-square flex items-center justify-center"
            >
              {item && (
                <div
                  className="absolute inset-0 flex items-center justify-center animate-scale-in"
                  style={{
                    transform: `translate(${item.offsetX}px, ${item.offsetY}px) rotate(${item.rotation}deg)`,
                  }}
                >
                  {/* 이모지 카드 */}
                  <div className="relative">
                    <span
                      className="text-3xl md:text-4xl drop-shadow-sm select-none"
                      style={{ lineHeight: 1 }}
                    >
                      {item.emoji}
                    </span>
                    {/* 순서 번호 배지 */}
                    <span className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-indigo-500 text-white text-[10px] md:text-xs font-bold rounded-full flex items-center justify-center shadow-sm">
                      {item.id}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 순서 힌트 */}
      <p className="text-xs text-gray-400 mb-4 text-center">
        번호 순서대로 기억하세요 (1번부터 20번까지)
      </p>

      {/* 암기 완료 버튼 */}
      <button
        onClick={onFinish}
        className="
          w-full max-w-xs px-8 py-4
          bg-gradient-to-r from-indigo-600 to-purple-600
          text-white text-lg font-bold rounded-2xl
          shadow-lg shadow-indigo-200
          hover:from-indigo-700 hover:to-purple-700
          active:scale-95 transition-all
        "
      >
        다 외웠습니다!
      </button>
    </div>
  );
}
