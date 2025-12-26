/**
 * scoringUtils.ts
 * Schulte Table Level 2 티어 및 점수 계산
 */

import type { TierGrade, TierInfo, LevelNumber } from './types';

/**
 * 티어 설정
 * 시간 기준 (초):
 * - S: < 15초 (Top 1%)
 * - A: < 25초 (Top 10%)
 * - B: < 35초 (Proficient)
 * - C: < 50초 (Average)
 * - D: >= 50초 (Try Again)
 */
export const TIER_THRESHOLDS: Record<TierGrade, number> = {
  S: 15,
  A: 25,
  B: 35,
  C: 50,
  D: Infinity,
};

/**
 * 티어 정보
 */
export const TIER_INFO: Record<TierGrade, Omit<TierInfo, 'minSeconds'>> = {
  S: {
    grade: 'S',
    name: 'Grandmaster',
    color: '#FFD700',
    emoji: '👑',
    feedback: '인간 한계의 속도! 주변시야가 완벽하게 발달했습니다!',
  },
  A: {
    grade: 'A',
    name: 'Expert',
    color: '#C0C0C0',
    emoji: '🥇',
    feedback: '뛰어난 주변시야! 조금만 더 연습하면 최상위권!',
  },
  B: {
    grade: 'B',
    name: 'Proficient',
    color: '#CD7F32',
    emoji: '🥈',
    feedback: '좋은 집중력이에요! 시야 확장 훈련을 계속하세요!',
  },
  C: {
    grade: 'C',
    name: 'Average',
    color: '#4A90D9',
    emoji: '🥉',
    feedback: '평균 수준이에요. 꾸준한 훈련으로 발전할 수 있어요!',
  },
  D: {
    grade: 'D',
    name: 'Try Again',
    color: '#808080',
    emoji: '🎯',
    feedback: '다시 도전해보세요! 중앙 점에 집중하며 주변을 보는 연습을 해보세요.',
  },
};

/**
 * 완료 시간으로 티어 계산
 */
export function calculateTier(timeSeconds: number): TierInfo {
  let grade: TierGrade = 'D';

  if (timeSeconds < TIER_THRESHOLDS.S) {
    grade = 'S';
  } else if (timeSeconds < TIER_THRESHOLDS.A) {
    grade = 'A';
  } else if (timeSeconds < TIER_THRESHOLDS.B) {
    grade = 'B';
  } else if (timeSeconds < TIER_THRESHOLDS.C) {
    grade = 'C';
  }

  const tierInfo = TIER_INFO[grade];
  return {
    ...tierInfo,
    minSeconds: TIER_THRESHOLDS[grade],
  };
}

/**
 * 다음 티어까지 필요한 시간 계산
 */
export function getNextTierRequirement(
  timeSeconds: number
): { nextGrade: TierGrade; required: number; difference: number } | null {
  const currentTier = calculateTier(timeSeconds);
  const grades: TierGrade[] = ['S', 'A', 'B', 'C', 'D'];
  const currentIndex = grades.indexOf(currentTier.grade);

  if (currentIndex === 0) return null; // 이미 S 등급

  const nextGrade = grades[currentIndex - 1];
  const required = TIER_THRESHOLDS[nextGrade];
  const difference = timeSeconds - required;

  return { nextGrade, required, difference };
}

/**
 * 점수 계산 (글로벌 스코어링 시스템과 통합용)
 * 기본 점수 + 레벨 보너스 + 시간 보너스
 */
export function calculateScore(
  level: LevelNumber,
  timeSeconds: number
): number {
  const tier = calculateTier(timeSeconds);
  const grades: TierGrade[] = ['S', 'A', 'B', 'C', 'D'];
  const tierIndex = grades.indexOf(tier.grade);

  // 기본 점수: 티어에 따라 200-1000점
  const baseScore = (5 - tierIndex) * 200;

  // 레벨 보너스: 레벨당 50점
  const levelBonus = level * 50;

  // 시간 보너스: 티어 기준보다 빠를수록 보너스
  let timeBonus = 0;
  if (tierIndex > 0) {
    const prevThreshold = TIER_THRESHOLDS[grades[tierIndex - 1]];
    const currentThreshold = TIER_THRESHOLDS[tier.grade];
    const range = currentThreshold - prevThreshold;
    const margin = currentThreshold - timeSeconds;
    timeBonus = Math.floor((margin / range) * 100);
  } else if (tier.grade === 'S') {
    // S 티어는 15초 기준, 더 빠를수록 보너스
    timeBonus = Math.max(0, Math.floor((15 - timeSeconds) * 20));
  }

  return Math.max(0, baseScore + levelBonus + timeBonus);
}

/**
 * 시간 포맷팅 (XX.XX초)
 */
export function formatTime(ms: number): string {
  const seconds = ms / 1000;
  return seconds.toFixed(2);
}
