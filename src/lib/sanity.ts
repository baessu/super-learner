/**
 * sanity.ts
 * Sanity Client Configuration
 *
 * 환경 변수:
 * - VITE_SANITY_PROJECT_ID: Sanity 프로젝트 ID
 * - VITE_SANITY_DATASET: 데이터셋 이름 (기본: "production")
 * - VITE_SANITY_API_VERSION: API 버전 (기본: 오늘 날짜)
 */

import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Sanity Image Source 타입 (간소화)
type SanityImageSource = {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
};

// ============================================
// Sanity Client Configuration
// ============================================

/**
 * Sanity 프로젝트 설정
 * 실제 프로젝트 ID와 데이터셋으로 교체 필요
 */
export const sanityConfig = {
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'YOUR_PROJECT_ID',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01',
  useCdn: true, // Production에서 CDN 사용 (빠른 응답)
};

/**
 * Sanity Client 인스턴스
 */
export const sanityClient = createClient(sanityConfig);

// ============================================
// Image URL Builder
// ============================================

const builder = imageUrlBuilder(sanityClient);

/**
 * Sanity 이미지 URL 생성 유틸리티
 *
 * @example
 * // 기본 사용
 * urlFor(game.thumbnail).url()
 *
 * // 크기 지정
 * urlFor(game.thumbnail).width(400).height(300).url()
 *
 * // 자동 포맷 최적화
 * urlFor(game.thumbnail).width(400).auto('format').url()
 *
 * // 크롭 및 포커스 포인트
 * urlFor(game.thumbnail).width(400).height(300).fit('crop').url()
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// ============================================
// GROQ Queries
// ============================================

/**
 * 모든 게임 가져오기 (카테고리별 정렬)
 */
export const gamesQuery = `
  *[_type == "game"] | order(category asc, order asc) {
    _id,
    "id": slug.current,
    title,
    "name": title,
    "slug": slug.current,
    description,
    category,
    level,
    thumbnail,
    gradientFallback,
    icon,
    route,
    isComingSoon,
    difficulty,
    estimatedTime,
    order
  }
`;

/**
 * 카테고리별 게임 가져오기
 */
export const gamesByCategoryQuery = `
  *[_type == "game" && category == $category] | order(order asc) {
    _id,
    "id": slug.current,
    title,
    "name": title,
    "slug": slug.current,
    description,
    category,
    level,
    thumbnail,
    gradientFallback,
    icon,
    route,
    isComingSoon,
    difficulty,
    estimatedTime,
    order
  }
`;

/**
 * 활성화된 게임만 가져오기 (isComingSoon: false)
 */
export const availableGamesQuery = `
  *[_type == "game" && isComingSoon != true] | order(category asc, order asc) {
    _id,
    "id": slug.current,
    title,
    "name": title,
    "slug": slug.current,
    description,
    category,
    level,
    thumbnail,
    gradientFallback,
    icon,
    route,
    isComingSoon,
    difficulty,
    estimatedTime,
    order
  }
`;

/**
 * 모든 학습 도구 가져오기
 */
export const learningToolsQuery = `
  *[_type == "learningTool"] | order(order asc) {
    _id,
    "id": slug.current,
    title,
    "name": title,
    "slug": slug.current,
    description,
    thumbnail,
    gradientFallback,
    emoji,
    route,
    isComingSoon,
    order
  }
`;

/**
 * 단일 게임 가져오기 (슬러그로)
 */
export const gameBySlugQuery = `
  *[_type == "game" && slug.current == $slug][0] {
    _id,
    "id": slug.current,
    title,
    "name": title,
    "slug": slug.current,
    description,
    category,
    level,
    thumbnail,
    gradientFallback,
    icon,
    route,
    isComingSoon,
    difficulty,
    estimatedTime
  }
`;

// ============================================
// Type Definitions (for Frontend)
// ============================================

export interface SanityGame {
  _id: string;
  id: string;
  title: string;
  name: string;
  slug: string;
  description: string;
  category: 'SPEED' | 'MEMORY' | 'FOCUS' | 'LOGIC';
  level: number;
  thumbnail?: {
    _type: 'image';
    asset: {
      _ref: string;
      _type: 'reference';
    };
    alt?: string;
    hotspot?: {
      x: number;
      y: number;
      height: number;
      width: number;
    };
  };
  gradientFallback?: string;
  icon: string;
  route: string;
  isComingSoon: boolean;
  difficulty: number;
  estimatedTime: string;
  order?: number;
}

export interface SanityLearningTool {
  _id: string;
  id: string;
  title: string;
  name: string;
  slug: string;
  description: string;
  thumbnail?: {
    _type: 'image';
    asset: {
      _ref: string;
      _type: 'reference';
    };
    alt?: string;
  };
  gradientFallback?: string;
  emoji: string;
  route: string;
  isComingSoon: boolean;
  order?: number;
}
