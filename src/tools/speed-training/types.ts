/**
 * types.ts
 * RSVP 속도 훈련 도구 타입 정의
 */

/** 파싱된 단어 데이터 */
export interface ParsedWord {
  id: number;
  text: string;
  isPunctuation: boolean;
  isParagraphEnd: boolean;
}

/** 훈련 모드 */
export type TrainingMode = 'normal' | 'progressive' | 'drop-set';

/** 드롭 세트 페이즈 */
export type DropSetPhase = 'sprint' | 'normal';

/** 앱 단계 */
export type AppPhase = 'input' | 'training' | 'result';

/** 훈련 결과 */
export interface TrainingResult {
  totalWords: number;
  completionTimeSeconds: number;
  averageWpm: number;
  mode: TrainingMode;
}

/** 속도 리더 엔진 상태 */
export interface SpeedReaderState {
  isPlaying: boolean;
  isPaused: boolean;
  currentIndex: number;
  textArray: ParsedWord[];
  wpm: number;
}

/** Progressive 모드 설정 */
export interface ProgressiveSettings {
  startWpm: number;
  targetWpm: number;
}

/** Drop Set 모드 설정 */
export interface DropSetSettings {
  sprintDuration: number; // ms
  normalDuration: number; // ms
  sprintMultiplier: number;
}
