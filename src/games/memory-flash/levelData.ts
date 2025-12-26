/**
 * levelData.ts
 * Memory Flash 게임의 고정 레벨 설정
 *
 * 각 레벨은 정해진 난이도로 표준화된 훈련을 제공
 */

// 레벨 타입 정의
export interface LevelConfig {
  level: number;
  name: string;
  nameKo: string;
  letterCount: number;      // 표시될 글자 수
  letterTypes: string[];    // 사용할 글자 종류
  flashDuration: number;    // 플래시 지속 시간 (초)
  gridWidth: 'narrow' | 'medium' | 'wide' | 'full';
  description: string;
}

// 그리드 너비 설정 (vw 기준)
export const GRID_WIDTH_MAP: Record<LevelConfig['gridWidth'], string> = {
  narrow: '200px',
  medium: '300px',
  wide: '400px',
  full: '500px',
};

// 고정 레벨 설정
export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    level: 1,
    name: 'Novice',
    nameKo: '입문',
    letterCount: 3,
    letterTypes: ['E'],
    flashDuration: 0.8,
    gridWidth: 'narrow',
    description: '3개 글자 / 0.8초',
  },
  {
    level: 2,
    name: 'Beginner',
    nameKo: '초급',
    letterCount: 5,
    letterTypes: ['E', 'T'],
    flashDuration: 0.6,
    gridWidth: 'medium',
    description: '5개 글자 / 0.6초',
  },
  {
    level: 3,
    name: 'Intermediate',
    nameKo: '중급',
    letterCount: 7,
    letterTypes: ['E', 'T', 'A'],
    flashDuration: 0.5,
    gridWidth: 'medium',
    description: '7개 글자 / 0.5초',
  },
  {
    level: 4,
    name: 'Advanced',
    nameKo: '고급',
    letterCount: 9,
    letterTypes: ['E', 'T', 'A'],
    flashDuration: 0.3,
    gridWidth: 'wide',
    description: '9개 글자 / 0.3초 (슈퍼러너 기준)',
  },
  {
    level: 5,
    name: 'Grandmaster',
    nameKo: '마스터',
    letterCount: 12,
    letterTypes: ['E', 'T', 'A', 'O'],
    flashDuration: 0.1,
    gridWidth: 'full',
    description: '12개 글자 / 0.1초',
  },
];

// 티어 정보
export interface TierInfo {
  grade: 'S' | 'A' | 'B' | 'C' | 'F';
  name: string;
  nameKo: string;
  color: string;
  message: string;
  emoji: string;
}

export const TIER_INFO: Record<string, TierInfo> = {
  S: {
    grade: 'S',
    name: 'Grandmaster',
    nameKo: '그랜드마스터',
    color: '#FFD700',
    message: '신(God)의 눈을 가지셨군요!',
    emoji: '👑',
  },
  A: {
    grade: 'A',
    name: 'Super Learner',
    nameKo: '슈퍼 러너',
    color: '#C0C0C0',
    message: '슈퍼 러너 기준을 통과했습니다!',
    emoji: '🥇',
  },
  B: {
    grade: 'B',
    name: 'Proficient',
    nameKo: '숙련자',
    color: '#CD7F32',
    message: '훌륭합니다! 더 높은 단계에 도전해보세요!',
    emoji: '🥈',
  },
  C: {
    grade: 'C',
    name: 'Trainee',
    nameKo: '훈련생',
    color: '#4A90D9',
    message: '좋은 시작입니다! 계속 연습하세요!',
    emoji: '🥉',
  },
  F: {
    grade: 'F',
    name: 'Try Again',
    nameKo: '재도전',
    color: '#808080',
    message: '아쉽네요! 다시 도전해보세요!',
    emoji: '💪',
  },
};

/**
 * 레벨에 따른 티어 결정 (100% 정확도일 때만)
 */
export function getTierByLevel(level: number, isCorrect: boolean): TierInfo {
  if (!isCorrect) {
    return TIER_INFO.F;
  }

  switch (level) {
    case 5:
      return TIER_INFO.S;
    case 4:
      return TIER_INFO.A;
    case 3:
      return TIER_INFO.B;
    case 1:
    case 2:
    default:
      return TIER_INFO.C;
  }
}

/**
 * 레벨 설정 가져오기
 */
export function getLevelConfig(level: number): LevelConfig {
  return LEVEL_CONFIGS.find((c) => c.level === level) || LEVEL_CONFIGS[0];
}
