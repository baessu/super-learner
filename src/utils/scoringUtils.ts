/**
 * scoringUtils.ts
 * 국제 인지 성능 벤치마크 기반 점수 계산 시스템
 *
 * - 게임별 벤치마크 데이터
 * - 티어 및 백분위 계산
 * - 격려 피드백 생성
 */

// ============================================
// 타입 정의
// ============================================

export type TierGrade = 'S' | 'A' | 'B' | 'C' | 'D';
export type TierName = 'Grandmaster' | 'Expert' | 'Advanced' | 'Novice' | 'Beginner';

export interface TierInfo {
  grade: TierGrade;
  name: TierName;
  score: number;
  percentile: string;
  color: string;
}

export interface GameBenchmark {
  gameId: string;
  gameName: string;
  unit: string;
  isLowerBetter: boolean; // true: 낮을수록 좋음 (시간), false: 높을수록 좋음 (레벨, WPM)
  thresholds: {
    S: number;
    A: number;
    B: number;
    C: number;
  };
}

export interface ScoreResult {
  score: number;
  tier: TierInfo;
  feedback: string;
  rawValue: number;
  formattedValue: string;
}

// ============================================
// 벤치마크 데이터
// ============================================

export const GAME_BENCHMARKS: Record<string, GameBenchmark> = {
  // 슐테 테이블 (5x5) - 시간 기준 (초)
  'schulte-table-l1': {
    gameId: 'schulte-table-l1',
    gameName: '슐테 테이블',
    unit: '초',
    isLowerBetter: true,
    thresholds: {
      S: 9,    // Top 1%: < 9초
      A: 15,   // Top 10%: < 15초
      B: 20,   // Top 30%: < 20초
      C: 35,   // Average: < 35초
    },
  },

  // 듀얼 엔백 - 레벨 기준
  'dual-n-back': {
    gameId: 'dual-n-back',
    gameName: '듀얼 엔백',
    unit: '레벨',
    isLowerBetter: false,
    thresholds: {
      S: 6,    // Top 1%: Level 6+
      A: 4,    // Top 10%: Level 4-5
      B: 3,    // Top 30%: Level 3
      C: 2,    // Average: Level 2
    },
  },

  // RSVP 속독 - WPM 기준
  'rsvp': {
    gameId: 'rsvp',
    gameName: '고속 순차 제시',
    unit: 'WPM',
    isLowerBetter: false,
    thresholds: {
      S: 1000, // Top 1%: > 1000 WPM
      A: 600,  // Top 10%: > 600 WPM
      B: 400,  // Top 30%: > 400 WPM
      C: 250,  // Average: > 250 WPM
    },
  },

  // 20개 이미지 기억 - 시간 기준 (초)
  'random-images': {
    gameId: 'random-images',
    gameName: '이미지 연상',
    unit: '초',
    isLowerBetter: true,
    thresholds: {
      S: 30,   // Top 1%: < 30초
      A: 60,   // Top 10%: < 60초
      B: 120,  // Top 30%: < 120초
      C: 180,  // Average: < 180초
    },
  },

  // 메모리 플래시 - 정답 개수 기준
  'memory-flash': {
    gameId: 'memory-flash',
    gameName: '메모리 플래시',
    unit: '개',
    isLowerBetter: false,
    thresholds: {
      S: 15,   // Top 1%: 15개+
      A: 12,   // Top 10%: 12개+
      B: 9,    // Top 30%: 9개+
      C: 6,    // Average: 6개+
    },
  },

  // 메모리 그리드 - 레벨 기준
  'memory-grid': {
    gameId: 'memory-grid',
    gameName: '메모리 그리드',
    unit: '레벨',
    isLowerBetter: false,
    thresholds: {
      S: 8,    // Top 1%: Level 8+
      A: 6,    // Top 10%: Level 6+
      B: 4,    // Top 30%: Level 4+
      C: 3,    // Average: Level 3+
    },
  },

  // 스트룹 테스트 - 정확도 기준 (%)
  'stroop-test': {
    gameId: 'stroop-test',
    gameName: '스트룹 테스트',
    unit: '%',
    isLowerBetter: false,
    thresholds: {
      S: 98,   // Top 1%: 98%+
      A: 95,   // Top 10%: 95%+
      B: 90,   // Top 30%: 90%+
      C: 80,   // Average: 80%+
    },
  },

  // 스피드 암산 - 문제 수 기준
  'speed-mental-math': {
    gameId: 'speed-mental-math',
    gameName: '스피드 암산',
    unit: '문제',
    isLowerBetter: false,
    thresholds: {
      S: 30,   // Top 1%: 30문제+
      A: 20,   // Top 10%: 20문제+
      B: 15,   // Top 30%: 15문제+
      C: 10,   // Average: 10문제+
    },
  },

  // 카메라 마인드 - 레벨 기준
  'camera-mind': {
    gameId: 'camera-mind',
    gameName: '카메라 마인드',
    unit: '레벨',
    isLowerBetter: false,
    thresholds: {
      S: 12,   // Top 1%: Level 12+
      A: 8,    // Top 10%: Level 8+
      B: 5,    // Top 30%: Level 5+
      C: 3,    // Average: Level 3+
    },
  },
};

// ============================================
// 티어 정보 매핑
// ============================================

const TIER_INFO: Record<TierGrade, Omit<TierInfo, 'grade'>> = {
  S: {
    name: 'Grandmaster',
    score: 1000,
    percentile: 'Top 1%',
    color: '#FFD700', // Gold
  },
  A: {
    name: 'Expert',
    score: 800,
    percentile: 'Top 10%',
    color: '#C0C0C0', // Silver
  },
  B: {
    name: 'Advanced',
    score: 600,
    percentile: 'Top 30%',
    color: '#CD7F32', // Bronze
  },
  C: {
    name: 'Novice',
    score: 400,
    percentile: 'Average',
    color: '#4A90D9', // Blue
  },
  D: {
    name: 'Beginner',
    score: 200,
    percentile: 'Below Average',
    color: '#808080', // Gray
  },
};

// ============================================
// 피드백 메시지
// ============================================

const TIER_FEEDBACK: Record<TierGrade, string[]> = {
  S: [
    '전 세계 상위 1% 수준입니다! 믿을 수 없는 두뇌 회전이네요!',
    '그랜드마스터급 실력! 당신의 두뇌는 최상위권입니다!',
    '경이로운 수준! 인지 능력의 정점을 찍었습니다!',
    '놀라운 성과! 상위 1%만이 도달할 수 있는 영역입니다!',
  ],
  A: [
    '상위 10% 안에 드는 뛰어난 실력입니다!',
    '전문가 수준의 인지 능력을 보여주고 있어요!',
    '대단해요! 꾸준한 훈련으로 그랜드마스터를 노려보세요!',
    '매우 우수한 성과입니다! 조금만 더 하면 최상위권!',
  ],
  B: [
    '상위 30%! 평균 이상의 훌륭한 실력이에요!',
    '잘하고 있어요! 조금만 더 연습하면 전문가 레벨!',
    '좋은 성과입니다! 꾸준히 훈련하면 더 높이 올라갈 수 있어요!',
    '발전하고 있어요! 다음 단계를 향해 도전해보세요!',
  ],
  C: [
    '평균적인 수준입니다. 조금만 더 훈련하면 상위권 진입이 가능해요!',
    '기초가 탄탄해요! 꾸준한 연습으로 실력을 키워보세요!',
    '좋은 시작이에요! 매일 조금씩 훈련하면 큰 발전이 있을 거예요!',
    '포기하지 마세요! 누구나 처음엔 여기서 시작합니다!',
  ],
  D: [
    '시작이 반이에요! 꾸준히 훈련하면 빠르게 성장할 수 있어요!',
    '첫 걸음을 내딛었어요! 앞으로가 기대됩니다!',
    '모든 전문가도 처음엔 초보자였어요. 함께 성장해봐요!',
    '두뇌는 근육처럼 훈련할수록 강해져요. 계속 도전하세요!',
  ],
};

// 게임별 맞춤 피드백
const GAME_SPECIFIC_FEEDBACK: Record<string, Record<TierGrade, string>> = {
  'schulte-table-l1': {
    S: '주변시야가 놀랍게 발달했어요! 속독 마스터의 자질이 있습니다!',
    A: '뛰어난 시각 처리 속도예요! 조금만 더 연습하면 최상위권!',
    B: '좋은 집중력이에요! 중앙 응시 연습을 더 해보세요!',
    C: '시야 확장 훈련을 꾸준히 하면 빠르게 발전할 수 있어요!',
    D: '천천히 시작해도 괜찮아요. 숫자를 찾는 패턴을 익혀보세요!',
  },
  'dual-n-back': {
    S: '작업 기억력이 최상위권! 연구에 따르면 IQ 향상 효과가 있어요!',
    A: '뛰어난 작업 기억력! 꾸준히 하면 더 높은 레벨도 가능해요!',
    B: '좋은 기억력이에요! N-Back 레벨을 하나씩 올려보세요!',
    C: '작업 기억력은 훈련으로 크게 향상될 수 있어요!',
    D: '처음엔 어렵지만, 매일 10분씩 하면 확실히 늘어요!',
  },
  'random-images': {
    S: '기억의 궁전 마스터! 연상 기억술을 완벽히 활용하고 있어요!',
    A: '뛰어난 연상 능력! 이미지 연결 스토리가 훌륭해요!',
    B: '좋은 기억력! 더 생생한 이미지로 연상해보세요!',
    C: '연상 기억술을 활용하면 더 빨리 외울 수 있어요!',
    D: '이모지들로 재미있는 이야기를 만들어보세요!',
  },
};

// ============================================
// 핵심 함수
// ============================================

/**
 * 결과값으로 티어 등급 계산
 */
function calculateTierGrade(
  value: number,
  benchmark: GameBenchmark
): TierGrade {
  const { thresholds, isLowerBetter } = benchmark;

  if (isLowerBetter) {
    // 낮을수록 좋은 경우 (시간)
    if (value <= thresholds.S) return 'S';
    if (value <= thresholds.A) return 'A';
    if (value <= thresholds.B) return 'B';
    if (value <= thresholds.C) return 'C';
    return 'D';
  } else {
    // 높을수록 좋은 경우 (레벨, WPM, 개수)
    if (value >= thresholds.S) return 'S';
    if (value >= thresholds.A) return 'A';
    if (value >= thresholds.B) return 'B';
    if (value >= thresholds.C) return 'C';
    return 'D';
  }
}

/**
 * 세분화된 점수 계산 (티어 내에서의 상대적 위치 반영)
 */
function calculateDetailedScore(
  value: number,
  grade: TierGrade,
  benchmark: GameBenchmark
): number {
  const baseScore = TIER_INFO[grade].score;
  const { thresholds, isLowerBetter } = benchmark;

  // 티어 내에서의 보너스 점수 계산 (최대 100점)
  let bonus = 0;
  const grades: TierGrade[] = ['S', 'A', 'B', 'C', 'D'];
  const gradeIndex = grades.indexOf(grade);

  if (gradeIndex < grades.length - 1) {
    const currentThreshold = gradeIndex === 0 ? thresholds.S : thresholds[grades[gradeIndex] as keyof typeof thresholds];
    const nextThreshold = thresholds[grades[gradeIndex + 1] as keyof typeof thresholds] ?? currentThreshold * 2;

    if (isLowerBetter) {
      // 시간 기반: 현재 티어 기준보다 얼마나 빠른지
      const range = nextThreshold - currentThreshold;
      const position = nextThreshold - value;
      bonus = Math.min(100, Math.max(0, (position / range) * 100));
    } else {
      // 수치 기반: 현재 티어 기준보다 얼마나 높은지
      const range = currentThreshold - (thresholds[grades[gradeIndex + 1] as keyof typeof thresholds] ?? 0);
      const position = value - currentThreshold;
      bonus = Math.min(100, Math.max(0, (position / (range || 1)) * 100));
    }
  }

  return Math.round(baseScore + bonus);
}

/**
 * 결과값 포맷팅
 */
function formatValue(value: number, benchmark: GameBenchmark): string {
  const { unit, gameId } = benchmark;

  if (gameId.includes('schulte') || gameId === 'random-images') {
    // 시간 포맷
    return `${value.toFixed(1)}${unit}`;
  }

  return `${value}${unit}`;
}

/**
 * 랜덤 피드백 선택
 */
function getRandomFeedback(grade: TierGrade, gameId?: string): string {
  // 게임별 맞춤 피드백이 있으면 50% 확률로 사용
  if (gameId && GAME_SPECIFIC_FEEDBACK[gameId]?.[grade] && Math.random() > 0.5) {
    return GAME_SPECIFIC_FEEDBACK[gameId][grade];
  }

  // 일반 피드백에서 랜덤 선택
  const feedbacks = TIER_FEEDBACK[grade];
  return feedbacks[Math.floor(Math.random() * feedbacks.length)];
}

/**
 * 메인 점수 계산 함수
 */
export function calculateGameScore(
  gameId: string,
  result: number
): ScoreResult {
  const benchmark = GAME_BENCHMARKS[gameId];

  // 벤치마크가 없는 경우 기본값 반환
  if (!benchmark) {
    return {
      score: 500,
      tier: {
        grade: 'C',
        ...TIER_INFO['C'],
      },
      feedback: '결과가 기록되었습니다!',
      rawValue: result,
      formattedValue: `${result}`,
    };
  }

  const grade = calculateTierGrade(result, benchmark);
  const score = calculateDetailedScore(result, grade, benchmark);
  const feedback = getRandomFeedback(grade, gameId);
  const formattedValue = formatValue(result, benchmark);

  return {
    score,
    tier: {
      grade,
      ...TIER_INFO[grade],
    },
    feedback,
    rawValue: result,
    formattedValue,
  };
}

/**
 * 티어 정보만 가져오기
 */
export function getTierInfo(grade: TierGrade): TierInfo {
  return {
    grade,
    ...TIER_INFO[grade],
  };
}

/**
 * 게임별 벤치마크 정보 가져오기
 */
export function getGameBenchmark(gameId: string): GameBenchmark | null {
  return GAME_BENCHMARKS[gameId] ?? null;
}

/**
 * 다음 티어까지 필요한 수치 계산
 */
export function getNextTierRequirement(
  gameId: string,
  currentValue: number
): { nextGrade: TierGrade; required: number; difference: number } | null {
  const benchmark = GAME_BENCHMARKS[gameId];
  if (!benchmark) return null;

  const currentGrade = calculateTierGrade(currentValue, benchmark);
  const grades: TierGrade[] = ['S', 'A', 'B', 'C', 'D'];
  const currentIndex = grades.indexOf(currentGrade);

  // 이미 최고 등급이면 null
  if (currentIndex === 0) return null;

  const nextGrade = grades[currentIndex - 1];
  const required = benchmark.thresholds[nextGrade as keyof typeof benchmark.thresholds];

  const difference = benchmark.isLowerBetter
    ? currentValue - required
    : required - currentValue;

  return {
    nextGrade,
    required,
    difference: Math.abs(difference),
  };
}

/**
 * 티어별 이모지 가져오기
 */
export function getTierEmoji(grade: TierGrade): string {
  const emojis: Record<TierGrade, string> = {
    S: '👑',
    A: '🥇',
    B: '🥈',
    C: '🥉',
    D: '🎯',
  };
  return emojis[grade];
}

/**
 * 티어 비교 (a가 b보다 높으면 양수, 같으면 0, 낮으면 음수)
 */
export function compareTiers(a: TierGrade, b: TierGrade): number {
  const order: TierGrade[] = ['S', 'A', 'B', 'C', 'D'];
  return order.indexOf(b) - order.indexOf(a);
}

/**
 * 점수로부터 티어 등급 역산
 * (점수 범위: S=1000-1100, A=800-900, B=600-700, C=400-500, D=200-300)
 */
export function getTierFromScore(score: number): TierInfo {
  let grade: TierGrade;

  if (score >= 1000) {
    grade = 'S';
  } else if (score >= 800) {
    grade = 'A';
  } else if (score >= 600) {
    grade = 'B';
  } else if (score >= 400) {
    grade = 'C';
  } else {
    grade = 'D';
  }

  return {
    grade,
    ...TIER_INFO[grade],
  };
}
