/**
 * useSanityData.ts
 * Sanity CMS 데이터 패칭 훅
 */

import { useState, useEffect, useCallback } from 'react';
import {
  sanityClient,
  gamesQuery,
  gamesByCategoryQuery,
  learningToolsQuery,
  type SanityGame,
  type SanityLearningTool,
} from '../lib/sanity';

// ============================================
// Types
// ============================================

interface UseSanityDataResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

type GameCategory = 'SPEED' | 'MEMORY' | 'FOCUS' | 'LOGIC';

// ============================================
// Generic Fetch Hook
// ============================================

/**
 * 범용 Sanity 데이터 패칭 훅
 */
function useSanityQuery<T>(
  query: string,
  params?: Record<string, string | number | boolean>
): UseSanityDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = params
        ? await sanityClient.fetch<T>(query, params)
        : await sanityClient.fetch<T>(query);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch data'));
      console.error('Sanity fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [query, JSON.stringify(params)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// ============================================
// Game Hooks
// ============================================

/**
 * 모든 게임 가져오기
 *
 * @example
 * const { data: games, loading, error } = useGames();
 */
export function useGames(): UseSanityDataResult<SanityGame[]> {
  return useSanityQuery<SanityGame[]>(gamesQuery);
}

/**
 * 카테고리별 게임 가져오기
 *
 * @example
 * const { data: speedGames } = useGamesByCategory('SPEED');
 */
export function useGamesByCategory(
  category: GameCategory
): UseSanityDataResult<SanityGame[]> {
  return useSanityQuery<SanityGame[]>(gamesByCategoryQuery, { category });
}

/**
 * 카테고리별 그룹화된 게임 가져오기
 *
 * @example
 * const { data: groupedGames } = useGroupedGames();
 * // { SPEED: [...], MEMORY: [...], ... }
 */
export function useGroupedGames(): UseSanityDataResult<Record<GameCategory, SanityGame[]>> {
  const { data: games, loading, error, refetch } = useGames();

  const groupedData = games
    ? games.reduce<Record<GameCategory, SanityGame[]>>(
        (acc, game) => {
          const category = game.category as GameCategory;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(game);
          return acc;
        },
        { SPEED: [], MEMORY: [], FOCUS: [], LOGIC: [] }
      )
    : null;

  return { data: groupedData, loading, error, refetch };
}

// ============================================
// Learning Tool Hooks
// ============================================

/**
 * 모든 학습 도구 가져오기
 *
 * @example
 * const { data: tools, loading } = useLearningTools();
 */
export function useLearningTools(): UseSanityDataResult<SanityLearningTool[]> {
  return useSanityQuery<SanityLearningTool[]>(learningToolsQuery);
}

// ============================================
// Utility: Check if Sanity is configured
// ============================================

/**
 * Sanity 설정 여부 확인
 * 환경 변수가 설정되지 않았으면 false 반환
 */
export function isSanityConfigured(): boolean {
  const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
  return !!projectId && projectId !== 'YOUR_PROJECT_ID';
}

// ============================================
// Fallback: Use Local Data if Sanity not configured
// ============================================

/**
 * Sanity 또는 로컬 데이터 사용 훅
 * Sanity가 설정되지 않았으면 로컬 데이터 사용
 */
export function useGamesWithFallback<T>(
  localData: T
): UseSanityDataResult<T> {
  const sanityResult = useGames();

  if (!isSanityConfigured()) {
    return {
      data: localData,
      loading: false,
      error: null,
      refetch: () => {},
    };
  }

  // Sanity 데이터가 있으면 GameData 형식으로 변환 필요
  // 여기서는 타입 캐스팅으로 처리
  return sanityResult as unknown as UseSanityDataResult<T>;
}
