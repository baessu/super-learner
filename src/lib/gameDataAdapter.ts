/**
 * gameDataAdapter.ts
 * Sanity 데이터와 기존 GameData 타입 간 변환
 *
 * 점진적 마이그레이션을 위해:
 * 1. Sanity가 설정되지 않았으면 로컬 데이터 사용
 * 2. Sanity 데이터가 있으면 GameData 형식으로 변환
 */

import type { GameData, IconName, GameCategory } from '../constants/gameData';
import { games as localGames } from '../constants/gameData';
import type { SanityGame, SanityLearningTool } from './sanity';
import { urlFor } from './sanity';

// ============================================
// Type Guards
// ============================================

/**
 * IconName 유효성 검사
 */
function isValidIconName(icon: string): icon is IconName {
  const validIcons: IconName[] = [
    'Grid3X3', 'LayoutGrid', 'BookOpen', 'Zap', 'Brain',
    'Grid2X2', 'Images', 'Type', 'Hash', 'Layers',
    'Search', 'ArrowUpDown', 'Palette', 'ArrowRight', 'Eye', 'Calculator',
  ];
  return validIcons.includes(icon as IconName);
}

/**
 * GameCategory 유효성 검사
 */
function isValidCategory(category: string): category is GameCategory {
  return ['SPEED', 'MEMORY', 'FOCUS', 'LOGIC'].includes(category);
}

// ============================================
// Sanity to GameData Conversion
// ============================================

/**
 * Sanity 게임 데이터를 GameData 형식으로 변환
 */
export function sanityGameToGameData(sanityGame: SanityGame): GameData {
  // 썸네일 처리: 이미지가 있으면 URL 생성, 없으면 그라데이션 사용
  const thumbnail = sanityGame.thumbnail
    ? `url(${urlFor(sanityGame.thumbnail).width(400).height(280).auto('format').url()})`
    : sanityGame.gradientFallback || 'from-gray-400 to-gray-500';

  // 아이콘 검증
  const icon = isValidIconName(sanityGame.icon)
    ? sanityGame.icon
    : 'Brain'; // 기본 아이콘

  // 카테고리 검증
  const category = isValidCategory(sanityGame.category)
    ? sanityGame.category
    : 'FOCUS'; // 기본 카테고리

  return {
    id: sanityGame.id || sanityGame.slug,
    name: sanityGame.name || sanityGame.title,
    description: sanityGame.description,
    category,
    level: sanityGame.level || 1,
    thumbnail,
    icon,
    route: sanityGame.route,
    isComingSoon: sanityGame.isComingSoon ?? true,
    estimatedTime: sanityGame.estimatedTime || '3분',
    difficulty: sanityGame.difficulty || 3,
  };
}

/**
 * 여러 Sanity 게임을 GameData 배열로 변환
 */
export function sanityGamesToGameDataArray(sanityGames: SanityGame[]): GameData[] {
  return sanityGames.map(sanityGameToGameData);
}

// ============================================
// Enhanced GameData with Image URL
// ============================================

export interface EnhancedGameData extends GameData {
  thumbnailUrl?: string; // Sanity 이미지 URL (있는 경우)
  thumbnailAlt?: string; // 이미지 대체 텍스트
  usesImageUrl: boolean; // URL vs 그라데이션 구분
}

/**
 * Sanity 게임을 확장된 GameData로 변환
 * 이미지 URL과 그라데이션을 모두 지원
 */
export function sanityGameToEnhancedGameData(sanityGame: SanityGame): EnhancedGameData {
  const base = sanityGameToGameData(sanityGame);
  const hasImage = !!sanityGame.thumbnail;

  return {
    ...base,
    thumbnailUrl: hasImage
      ? urlFor(sanityGame.thumbnail!).width(400).height(280).auto('format').url()
      : undefined,
    thumbnailAlt: sanityGame.thumbnail?.alt || sanityGame.name,
    usesImageUrl: hasImage,
  };
}

// ============================================
// Data Source Manager
// ============================================

/**
 * 데이터 소스 유형
 */
export type DataSource = 'local' | 'sanity';

/**
 * 현재 데이터 소스 확인
 */
export function getDataSource(): DataSource {
  const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
  const useSanity = import.meta.env.VITE_USE_SANITY === 'true';

  if (useSanity && projectId && projectId !== 'YOUR_PROJECT_ID') {
    return 'sanity';
  }
  return 'local';
}

/**
 * 로컬 데이터 가져오기 (폴백)
 */
export function getLocalGames(): GameData[] {
  return localGames;
}

/**
 * 카테고리별 로컬 게임 가져오기
 */
export function getLocalGamesByCategory(category: GameCategory): GameData[] {
  return localGames.filter((game) => game.category === category);
}

// ============================================
// Tool Data Adapter
// ============================================

export interface ToolData {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  thumbnailUrl?: string;
  emoji: string;
  route: string;
  color: string;
  isComingSoon: boolean;
}

/**
 * Sanity 학습 도구를 ToolData로 변환
 */
export function sanityToolToToolData(tool: SanityLearningTool): ToolData {
  const hasThumbnail = !!tool.thumbnail;

  return {
    id: tool.id || tool.slug,
    name: tool.name || tool.title,
    description: tool.description,
    thumbnail: tool.gradientFallback || 'from-gray-400 to-gray-500',
    thumbnailUrl: hasThumbnail
      ? urlFor(tool.thumbnail!).width(400).height(280).auto('format').url()
      : undefined,
    emoji: tool.emoji || '🔧',
    route: tool.route,
    color: tool.gradientFallback || 'from-gray-400 to-gray-500',
    isComingSoon: tool.isComingSoon ?? true,
  };
}
