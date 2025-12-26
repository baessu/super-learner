/**
 * levelData.ts
 * Schulte Table Level 2 레벨별 설정
 */

import type { LevelConfig, LevelNumber } from './types';

/**
 * 고정 레벨 설정
 * 레벨이 올라갈수록:
 * - 폰트가 작아짐
 * - 좌우 간격이 넓어짐 (주변시야 훈련 강도 증가)
 */
export const LEVEL_CONFIGS: Record<LevelNumber, LevelConfig> = {
  1: {
    level: 1,
    name: 'Warm-up',
    description: '적응 훈련',
    fontSize: '2.5rem',
    gapPercent: 30,
    difficulty: 'warmup',
  },
  2: {
    level: 2,
    name: 'Beginner',
    description: '초급 훈련',
    fontSize: '2.0rem',
    gapPercent: 50,
    difficulty: 'beginner',
  },
  3: {
    level: 3,
    name: 'Intermediate',
    description: '중급 훈련',
    fontSize: '1.5rem',
    gapPercent: 70,
    difficulty: 'intermediate',
  },
  4: {
    level: 4,
    name: 'Advanced',
    description: '고급 훈련',
    fontSize: '1.25rem',
    gapPercent: 85,
    difficulty: 'advanced',
  },
  5: {
    level: 5,
    name: 'Grandmaster',
    description: '극한 훈련',
    fontSize: '1.0rem',
    gapPercent: 95,
    difficulty: 'grandmaster',
  },
};

/**
 * 레벨 목록 (UI 렌더링용)
 */
export const LEVEL_LIST: LevelConfig[] = Object.values(LEVEL_CONFIGS);

/**
 * 기본 레벨
 */
export const DEFAULT_LEVEL: LevelNumber = 2;

/**
 * 총 숫자 개수 (1-24)
 */
export const TOTAL_NUMBERS = 24;

/**
 * 각 열의 숫자 개수
 */
export const NUMBERS_PER_COLUMN = TOTAL_NUMBERS / 2; // 12개씩
