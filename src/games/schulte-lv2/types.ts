/**
 * types.ts
 * Schulte Table Level 2 타입 정의
 */

/** 게임 상태 */
export type GameState = 'ready' | 'playing' | 'finished';

/** 레벨 1-5 */
export type LevelNumber = 1 | 2 | 3 | 4 | 5;

/** 레벨 설정 */
export interface LevelConfig {
  level: LevelNumber;
  name: string;
  description: string;
  fontSize: string;      // rem 단위
  gapPercent: number;    // 0-100 (뷰포트 대비 좌우 간격 %)
  difficulty: 'warmup' | 'beginner' | 'intermediate' | 'advanced' | 'grandmaster';
}

/** 분할된 숫자 (왼쪽/오른쪽) */
export interface SplitNumber {
  value: number;
  side: 'left' | 'right';
  found: boolean;
}

/** 티어 등급 */
export type TierGrade = 'S' | 'A' | 'B' | 'C' | 'D';

/** 티어 정보 */
export interface TierInfo {
  grade: TierGrade;
  name: string;
  minSeconds: number;
  color: string;
  emoji: string;
  feedback: string;
}

/** 게임 결과 */
export interface GameResult {
  level: LevelNumber;
  timeSeconds: number;
  tier: TierInfo;
}

/** 셀 피드백 상태 */
export type CellFeedback = 'correct' | 'wrong' | null;
