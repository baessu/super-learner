/**
 * RecallBoard.tsx
 * 회상 단계 화면 컴포넌트 (즉시 피드백 방식)
 *
 * - 35개 카드 (정답 20개 + 오답 15개) 중에서 클릭
 * - 정답 클릭: 초록색 테두리 + 체크 표시 + 비활성화
 * - 오답 클릭: 빨간색 흔들림 애니메이션 + 오답 카운터 증가
 * - 하단 상태바: 정답: X/20 | 오답: Y
 */

import { Check } from 'lucide-react';
import type { RecallCard } from './useImageMemoryLogic';

interface RecallBoardProps {
  recallCards: RecallCard[];
  foundEmojis: Set<string>;
  correctCount: number;
  errorCount: number;
  lastErrorEmoji: string | null;
  totalTargets: number;
  onCardClick: (emoji: string, isTarget: boolean) => void;
}

export function RecallBoard({
  recallCards,
  foundEmojis,
  correctCount,
  errorCount,
  lastErrorEmoji,
  totalTargets,
  onCardClick,
}: RecallBoardProps) {
  return (
    <div className="flex flex-col items-center w-full">
      {/* 안내 문구 */}
      <p className="text-gray-600 mb-3 text-center">
        기억한 이모지를 모두 찾아주세요!
      </p>

      {/* 상태 바 */}
      <div className="flex items-center gap-6 mb-5 px-5 py-3 bg-gray-50 rounded-2xl border border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">정답</span>
          <span className="text-2xl font-bold text-emerald-600">
            {correctCount}
          </span>
          <span className="text-sm text-gray-400">/ {totalTargets}</span>
        </div>
        <div className="w-px h-8 bg-gray-300" />
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">오답</span>
          <span className="text-2xl font-bold text-red-500">
            {errorCount}
          </span>
        </div>
      </div>

      {/* 진행률 바 */}
      <div className="w-full max-w-md h-2 mb-6 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
          style={{ width: `${(correctCount / totalTargets) * 100}%` }}
        />
      </div>

      {/* 카드 그리드 (35개 = 7x5 또는 모바일 5x7) */}
      <div className="w-full max-w-xl px-2 mb-4">
        <div className="grid grid-cols-5 md:grid-cols-7 gap-2 p-4 bg-white rounded-2xl shadow-lg border border-gray-100">
          {recallCards.map((card, index) => {
            const isFound = foundEmojis.has(card.emoji);
            const isShaking = lastErrorEmoji === card.emoji;
            const isCorrectCard = card.isTarget && isFound;

            return (
              <button
                key={index}
                onClick={() => !isFound && onCardClick(card.emoji, card.isTarget)}
                disabled={isFound}
                className={`
                  relative aspect-square flex items-center justify-center rounded-xl
                  transition-all duration-200
                  ${isShaking ? 'animate-shake' : ''}
                  ${
                    isCorrectCard
                      ? 'bg-emerald-100 border-2 border-emerald-500 cursor-default'
                      : isFound
                        ? 'bg-gray-100 opacity-50 cursor-not-allowed'
                        : 'bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 hover:scale-105 active:scale-95 cursor-pointer shadow-sm border border-transparent hover:border-indigo-200'
                  }
                `}
              >
                <span
                  className={`text-2xl md:text-3xl ${isCorrectCard ? '' : ''}`}
                  style={{ lineHeight: 1 }}
                >
                  {card.emoji}
                </span>

                {/* 정답 체크 표시 */}
                {isCorrectCard && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 팁 메시지 */}
      <p className="text-xs text-gray-400 text-center">
        {correctCount < totalTargets
          ? `${totalTargets - correctCount}개 더 찾아주세요!`
          : '모두 찾았습니다!'}
      </p>
    </div>
  );
}
