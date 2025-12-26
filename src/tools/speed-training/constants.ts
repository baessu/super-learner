/**
 * constants.ts
 * RSVP 속도 훈련 도구 상수 정의
 */

/** 테마 색상 */
export const THEME = {
  primary: '#F59E0B', // Amber
  secondary: '#EA580C', // Orange
  sprint: '#E87C63', // Coral (Sprint 모드)
  normal: '#22C55E', // Green (Normal 모드)
  text: {
    current: '#1F2937', // Gray-800
    past: '#9CA3AF', // Gray-400
    future: '#6B7280', // Gray-500
  },
  background: '#FEF3C7', // Amber-100
};

/** 기본 설정값 */
export const DEFAULTS = {
  wpm: 300,
  minWpm: 100,
  maxWpm: 1500,
  // Progressive 모드
  progressiveStartWpm: 200,
  progressiveTargetWpm: 600,
  // Drop Set 모드
  sprintDuration: 5000, // 5초
  normalDuration: 20000, // 20초
  sprintMultiplier: 2.5,
};

/** Smart Pause 배수 */
export const PAUSE_MULTIPLIERS = {
  paragraphEnd: 2.0, // 문단 끝
  punctuation: 1.5, // 문장 부호
  normal: 1.0,
};

/** 단어 표시 스타일 */
export const WORD_STYLES = {
  current: {
    opacity: 1,
    scale: 1.1,
    blur: 0,
  },
  past: {
    opacity: 0.1,
    scale: 1,
    blur: 2,
  },
  future: {
    opacity: 0.4,
    scale: 1,
    blur: 0,
  },
};

/** 줄 높이 (px) */
export const LINE_HEIGHT = 60;

/** 샘플 텍스트 */
export const SAMPLE_TEXT = `속독은 단순히 빠르게 읽는 것이 아닙니다. 효율적으로 정보를 처리하고 이해하는 능력입니다.

RSVP(Rapid Serial Visual Presentation)는 한 번에 한 단어씩 빠르게 보여주는 방식입니다. 이 방식은 눈의 움직임을 최소화하여 읽기 효율을 높입니다.

연습을 통해 여러분의 읽기 속도는 크게 향상될 수 있습니다. 꾸준한 훈련이 핵심입니다.`;
