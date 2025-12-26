/**
 * GameCardEnhanced.tsx
 * 게임 카드 컴포넌트 (Sanity CMS 이미지 지원)
 *
 * - 로컬 그라데이션과 Sanity 이미지 URL 모두 지원
 * - 이미지 로딩 상태 처리 (스켈레톤 UI)
 * - 이미지 에러 시 그라데이션 폴백
 */

import { useState } from 'react';
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
import type { EnhancedGameData } from '../lib/gameDataAdapter';
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

interface GameCardEnhancedProps {
  game: GameData | EnhancedGameData;
  bestScore?: number | string | null;
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

/**
 * 썸네일 스켈레톤 로딩 컴포넌트
 */
function ThumbnailSkeleton() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
  );
}

/**
 * EnhancedGameData 타입 가드
 */
function isEnhancedGameData(game: GameData | EnhancedGameData): game is EnhancedGameData {
  return 'usesImageUrl' in game;
}

export function GameCardEnhanced({ game, bestScore }: GameCardEnhancedProps) {
  const isAvailable = !game.isComingSoon;
  const IconComponent = iconMap[game.icon];
  const hasBestScore = bestScore !== undefined && bestScore !== null;

  // 이미지 로딩 상태
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // EnhancedGameData인지 확인
  const isEnhanced = isEnhancedGameData(game);
  const usesImageUrl = isEnhanced && game.usesImageUrl && !imageError;
  const thumbnailUrl = isEnhanced ? game.thumbnailUrl : undefined;
  const thumbnailAlt = isEnhanced ? game.thumbnailAlt : game.name;

  // 그라데이션 클래스 (이미지가 없거나 에러 시 사용)
  const gradientClass = game.thumbnail.startsWith('from-')
    ? game.thumbnail
    : 'from-gray-400 to-gray-500';

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
        {/* 카드 상단 썸네일 영역 */}
        <div className="h-28 relative overflow-hidden">
          {/* Sanity 이미지 사용 시 */}
          {usesImageUrl && thumbnailUrl ? (
            <>
              {/* 스켈레톤 (로딩 중) */}
              {!imageLoaded && <ThumbnailSkeleton />}

              {/* 실제 이미지 */}
              <img
                src={thumbnailUrl}
                alt={thumbnailAlt}
                className={`
                  absolute inset-0 w-full h-full object-cover
                  transition-opacity duration-300
                  ${imageLoaded ? 'opacity-100' : 'opacity-0'}
                `}
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  setImageError(true);
                  setImageLoaded(true);
                }}
                loading="lazy"
              />

              {/* 아이콘 오버레이 */}
              {IconComponent && imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <IconComponent
                    className={`
                      w-12 h-12 text-white transition-all duration-300
                      ${isAvailable ? 'opacity-70 group-hover:opacity-100 group-hover:scale-110' : 'opacity-40'}
                    `}
                  />
                </div>
              )}
            </>
          ) : (
            /* 그라데이션 사용 시 */
            <div
              className={`
                absolute inset-0 bg-gradient-to-br ${gradientClass}
                flex items-center justify-center
                ${!isAvailable ? 'grayscale-0' : ''}
              `}
            >
              {IconComponent && (
                <IconComponent
                  className={`
                    w-12 h-12 text-white transition-all duration-300
                    ${isAvailable ? 'opacity-70 group-hover:opacity-100 group-hover:scale-110' : 'opacity-40'}
                  `}
                />
              )}
            </div>
          )}

          {/* 준비 중 배지 */}
          {!isAvailable && (
            <span
              className="
                absolute top-2 right-2
                bg-gray-800 text-white text-xs font-medium
                px-2.5 py-1 rounded-full
                filter-none opacity-100
                shadow-md z-10
              "
              style={{ filter: 'none' }}
            >
              준비 중
            </span>
          )}

          {/* 레벨 배지 */}
          {game.level > 1 && isAvailable && (
            <span className="absolute top-2 left-2 bg-white/20 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm z-10">
              Lv.{game.level}
            </span>
          )}
        </div>

        {/* 카드 콘텐츠 */}
        <div className="p-4">
          <h3 className="text-base font-bold text-gray-800 mb-1">{game.name}</h3>
          <p className="text-xs text-gray-500 mb-3 line-clamp-2">{game.description}</p>

          {/* 메타 정보 태그 */}
          {isAvailable && (
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                <span>{game.estimatedTime}</span>
              </div>
              <DifficultyStars difficulty={game.difficulty} />
            </div>
          )}

          {/* 하단 영역 */}
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

            {/* 게이미피케이션 */}
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

// 기존 GameCard 호환을 위한 default export
export default GameCardEnhanced;
