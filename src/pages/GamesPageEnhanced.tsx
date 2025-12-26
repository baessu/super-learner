/**
 * GamesPageEnhanced.tsx
 * 게임 목록 페이지 (Sanity CMS 지원)
 *
 * - Sanity가 설정되면 CMS 데이터 사용
 * - 설정되지 않으면 로컬 gameData.ts 사용
 * - 로딩/에러 상태 처리
 */

import { useMemo } from 'react';
import { GameCardEnhanced } from '../components/GameCardEnhanced';
import { useGameStore } from '../store/useGameStore';
import { useGames, isSanityConfigured } from '../hooks/useSanityData';
import {
  games as localGames,
  categoryInfo,
  type GameCategory,
  type GameData,
} from '../constants/gameData';
import { sanityGameToEnhancedGameData, type EnhancedGameData } from '../lib/gameDataAdapter';

// 카테고리 순서 정의
const categoryOrder: GameCategory[] = ['SPEED', 'MEMORY', 'FOCUS', 'LOGIC'];

// ============================================
// Loading Skeleton
// ============================================

function GameCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-warm-200 overflow-hidden animate-pulse">
      <div className="h-28 bg-gray-200" />
      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-full mb-3" />
        <div className="flex gap-3 mb-3">
          <div className="h-3 bg-gray-200 rounded w-12" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
        <div className="flex justify-between">
          <div className="h-3 bg-gray-200 rounded w-16" />
          <div className="h-3 bg-gray-200 rounded w-10" />
        </div>
      </div>
    </div>
  );
}

function CategorySkeleton() {
  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-8 rounded-full bg-gray-200" />
        <div>
          <div className="h-5 bg-gray-200 rounded w-24 mb-1" />
          <div className="h-3 bg-gray-200 rounded w-40" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <GameCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

// ============================================
// Error State
// ============================================

function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl">⚠️</span>
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">데이터를 불러올 수 없습니다</h3>
      <p className="text-gray-600 text-sm mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}

// ============================================
// Category Section
// ============================================

interface CategorySectionProps {
  category: GameCategory;
  games: (GameData | EnhancedGameData)[];
  bestScores: Record<string, number>;
}

function CategorySection({ category, games, bestScores }: CategorySectionProps) {
  const info = categoryInfo[category];

  if (games.length === 0) return null;

  return (
    <section className="mb-10">
      {/* 카테고리 헤더 */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-1 h-8 rounded-full bg-gradient-to-b ${info.color}`} />
        <div>
          <h3 className="text-lg font-bold text-gray-800">{info.name}</h3>
          <p className="text-xs text-gray-500">{info.description}</p>
        </div>
        <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
          {games.length}개
        </span>
      </div>

      {/* 게임 카드 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {games.map((game) => (
          <GameCardEnhanced
            key={game.id}
            game={game}
            bestScore={bestScores[game.id] ?? null}
          />
        ))}
      </div>
    </section>
  );
}

// ============================================
// Main Component
// ============================================

export function GamesPageEnhanced() {
  const bestScores = useGameStore((state) => state.bestScores);
  const useSanity = isSanityConfigured();

  // Sanity 데이터 (설정된 경우에만 fetch)
  const { data: sanityGames, loading, error, refetch } = useGames();

  // 사용할 게임 데이터 결정
  const gamesData = useMemo(() => {
    if (!useSanity) {
      // 로컬 데이터 사용
      return { games: localGames, source: 'local' as const };
    }

    if (loading || !sanityGames) {
      return { games: null, source: 'sanity' as const };
    }

    // Sanity 데이터를 EnhancedGameData로 변환
    const enhanced = sanityGames.map(sanityGameToEnhancedGameData);
    return { games: enhanced, source: 'sanity' as const };
  }, [useSanity, sanityGames, loading]);

  // 카테고리별 그룹화
  const groupedGames = useMemo(() => {
    if (!gamesData.games) return null;

    return categoryOrder.reduce<Record<GameCategory, (GameData | EnhancedGameData)[]>>(
      (acc, category) => {
        acc[category] = gamesData.games!.filter((g) => g.category === category);
        return acc;
      },
      { SPEED: [], MEMORY: [], FOCUS: [], LOGIC: [] }
    );
  }, [gamesData.games]);

  // 통계
  const stats = useMemo(() => {
    if (!gamesData.games) return { total: 0, available: 0 };
    return {
      total: gamesData.games.length,
      available: gamesData.games.filter((g) => !g.isComingSoon).length,
    };
  }, [gamesData.games]);

  // 로딩 상태 (Sanity 사용 시에만)
  if (useSanity && loading) {
    return (
      <div>
        <div className="mb-8">
          <div className="h-7 bg-gray-200 rounded w-40 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
        </div>
        {categoryOrder.slice(0, 2).map((cat) => (
          <CategorySkeleton key={cat} />
        ))}
      </div>
    );
  }

  // 에러 상태
  if (useSanity && error) {
    return (
      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">두뇌 훈련 게임</h2>
        </div>
        <ErrorState message={error.message} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-2xl font-bold text-gray-800">두뇌 훈련 게임</h2>
          {useSanity && (
            <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
              CMS
            </span>
          )}
        </div>
        <p className="text-gray-600">
          총 {stats.total}개의 게임 중 {stats.available}개를 플레이할 수 있습니다.
        </p>
      </div>

      {/* 카테고리별 게임 목록 */}
      {groupedGames &&
        categoryOrder.map((category) => (
          <CategorySection
            key={category}
            category={category}
            games={groupedGames[category]}
            bestScores={bestScores}
          />
        ))}
    </div>
  );
}

// 기본 export
export default GamesPageEnhanced;
