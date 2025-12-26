/**
 * GameCard.tsx
 * 게임 목록에서 사용되는 카드 컴포넌트
 *
 * - lucide-react 아이콘 표시
 * - 비활성화(isComingSoon) 시 grayscale + opacity 처리
 * - 최고 기록(bestScore) 또는 도전 유도 문구 표시
 * - 예상 시간 및 난이도 메타 정보 표시
 */

import { Link } from 'react-router-dom';
import {
  Grid3X3,
  LayoutGrid,
  BookOpen,
  Zap,
  Brain,
  Grid2X2,
  Images,
  Type,
  Hash,
  Layers,
  Search,
  ArrowUpDown,
  Palette,
  ArrowRight,
  Eye,
  Calculator,
  Clock,
  Star,
} from 'lucide-react';
import type { GameData, IconName } from '../constants/gameData';
import { getTierFromScore, getTierEmoji } from '../utils/scoringUtils';

// 아이콘 매핑 객체
const iconMap: Record<IconName, React.ComponentType<{ className?: string }>> = {
  Grid3X3,
  LayoutGrid,
  BookOpen,
  Zap,
  Brain,
  Grid2X2,
  Images,
  Type,
  Hash,
  Layers,
  Search,
  ArrowUpDown,
  Palette,
  ArrowRight,
  Eye,
  Calculator,
};

interface GameCardProps {
  game: GameData;
  bestScore?: number | string | null; // 최고 기록 (점수 또는 시간)
}

/**
 * 난이도 별점 컴포넌트
 */
function DifficultyStars({ difficulty }: { difficulty: number }) {
  const maxStars = 5;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxStars }, (_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${
            i < difficulty
              ? 'fill-amber-400 text-amber-400'
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

export function GameCard({ game, bestScore }: GameCardProps) {
  const isAvailable = !game.isComingSoon;
  const IconComponent = iconMap[game.icon];
  const hasBestScore = bestScore !== undefined && bestScore !== null;

  return (
    <Link
      to={isAvailable ? game.route : '#'}
      className={`group block ${!isAvailable ? 'cursor-not-allowed' : ''}`}
      onClick={(e) => !isAvailable && e.preventDefault()}
    >
      <div
        className={`
          bg-white rounded-2xl shadow-sm border border-warm-200 overflow-hidden
          transition-all duration-300
          ${isAvailable ? 'hover:shadow-lg hover:-translate-y-1' : ''}
          ${!isAvailable ? 'grayscale opacity-60' : ''}
        `}
      >
        {/* 카드 상단 그라데이션 영역 */}
        <div
          className={`
            h-28 bg-gradient-to-br ${game.thumbnail}
            flex items-center justify-center relative
            ${!isAvailable ? 'grayscale-0' : ''}
          `}
        >
          {/* 아이콘 */}
          {IconComponent && (
            <IconComponent
              className={`
                w-12 h-12 text-white transition-all duration-300
                ${isAvailable ? 'opacity-70 group-hover:opacity-100 group-hover:scale-110' : 'opacity-40'}
              `}
            />
          )}

          {/* 준비 중 배지 - grayscale 해제하여 잘 보이게 */}
          {!isAvailable && (
            <span
              className="
                absolute top-2 right-2
                bg-gray-800 text-white text-xs font-medium
                px-2.5 py-1 rounded-full
                filter-none opacity-100
                shadow-md
              "
              style={{ filter: 'none' }}
            >
              준비 중
            </span>
          )}

          {/* 레벨 배지 */}
          {game.level > 1 && isAvailable && (
            <span className="absolute top-2 left-2 bg-white/20 text-white text-xs px-2 py-1 rounded-full">
              Lv.{game.level}
            </span>
          )}
        </div>

        {/* 카드 콘텐츠 */}
        <div className="p-4">
          <h3 className="text-base font-bold text-gray-800 mb-1">{game.name}</h3>
          <p className="text-xs text-gray-500 mb-3 line-clamp-2">{game.description}</p>

          {/* 메타 정보 태그 (예상 시간 + 난이도) */}
          {isAvailable && (
            <div className="flex items-center gap-3 mb-3">
              {/* 예상 시간 */}
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                <span>{game.estimatedTime}</span>
              </div>
              {/* 난이도 별점 */}
              <DifficultyStars difficulty={game.difficulty} />
            </div>
          )}

          {/* 하단 영역: 시작하기 / 게이미피케이션 */}
          <div className="flex items-center justify-between">
            <div
              className={`
                flex items-center text-xs font-medium
                ${isAvailable ? 'text-indigo-600' : 'text-gray-400'}
              `}
            >
              {isAvailable ? '시작하기' : '곧 출시'}
              {isAvailable && (
                <svg
                  className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </div>

            {/* 게이미피케이션: 최고 티어 또는 도전 유도 */}
            {isAvailable && (
              <div className="flex items-center text-xs font-semibold">
                {hasBestScore && typeof bestScore === 'number' ? (
                  (() => {
                    const tier = getTierFromScore(bestScore);
                    return (
                      <div className="flex items-center gap-1.5">
                        <span>{getTierEmoji(tier.grade)}</span>
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white"
                          style={{ backgroundColor: tier.color }}
                        >
                          {tier.grade}
                        </span>
                      </div>
                    );
                  })()
                ) : (
                  <div className="flex items-center text-orange-500">
                    <span className="mr-1">🔥</span>
                    <span>도전!</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
