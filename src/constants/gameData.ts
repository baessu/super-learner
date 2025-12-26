/**
 * gameData.ts
 * 슈퍼 러너 플랫폼의 모든 게임 데이터를 정의하는 상수 파일
 * - 4가지 카테고리: SPEED, MEMORY, FOCUS, LOGIC
 * - 총 17개의 두뇌 훈련 게임
 */

// 카테고리 타입 정의
export type GameCategory = 'SPEED' | 'MEMORY' | 'FOCUS' | 'LOGIC';

// 아이콘 이름 타입 (lucide-react에서 사용)
export type IconName =
  | 'Grid3X3'
  | 'LayoutGrid'
  | 'BookOpen'
  | 'Zap'
  | 'Brain'
  | 'Grid2X2'
  | 'Images'
  | 'Type'
  | 'Hash'
  | 'Layers'
  | 'Search'
  | 'ArrowUpDown'
  | 'Palette'
  | 'ArrowRight'
  | 'Eye'
  | 'Calculator';

// 카테고리 정보 (한글명, 설명, 색상)
export const categoryInfo: Record<GameCategory, { name: string; description: string; color: string }> = {
  SPEED: {
    name: '속독 및 시야',
    description: '빠른 정보 처리와 시야 확장 훈련',
    color: 'from-blue-500 to-cyan-500',
  },
  MEMORY: {
    name: '기억력 강화',
    description: '단기 및 장기 기억력 향상 훈련',
    color: 'from-purple-500 to-pink-500',
  },
  FOCUS: {
    name: '주의력 및 통제',
    description: '집중력과 인지 통제력 강화 훈련',
    color: 'from-amber-500 to-orange-500',
  },
  LOGIC: {
    name: '논리 및 연산',
    description: '논리적 사고와 연산 능력 훈련',
    color: 'from-emerald-500 to-teal-500',
  },
};

// 게임 데이터 타입 정의
export interface GameData {
  id: string;
  name: string;
  description: string;
  category: GameCategory;
  level: number;
  thumbnail: string;
  icon: IconName;
  route: string;
  isComingSoon: boolean;
  estimatedTime: string; // 예상 플레이 시간 (예: "3분", "5분")
  difficulty: number; // 난이도 1~5 (별점 표시용)
}

// 전체 게임 데이터
export const games: GameData[] = [
  // ============================================
  // SPEED - 속독 및 시야
  // ============================================
  {
    id: 'schulte-table-l1',
    name: '슐테 테이블 Lv.1',
    description: '중앙을 응시하며 주변 숫자를 순서대로 찾으세요.',
    category: 'SPEED',
    level: 1,
    thumbnail: 'from-blue-500 to-indigo-500',
    icon: 'Grid3X3',
    route: '/game/schulte-table',
    isComingSoon: false,
    estimatedTime: '2분',
    difficulty: 2,
  },
  {
    id: 'schulte-table-l2',
    name: '슐테 테이블 Lv.2',
    description: '시선을 고정하고 주변 변화를 감지하세요.',
    category: 'SPEED',
    level: 2,
    thumbnail: 'from-indigo-500 to-purple-500',
    icon: 'LayoutGrid',
    route: '/game/schulte-table-l2',
    isComingSoon: true,
    estimatedTime: '3분',
    difficulty: 3,
  },
  {
    id: 'rsvp',
    name: '고속 순차 제시',
    description: '빠르게 지나가는 단어를 읽으며 뇌의 처리 속도를 높이세요.',
    category: 'SPEED',
    level: 1,
    thumbnail: 'from-cyan-500 to-blue-500',
    icon: 'BookOpen',
    route: '/game/rsvp',
    isComingSoon: true,
    estimatedTime: '5분',
    difficulty: 2,
  },
  {
    id: 'memory-flash',
    name: '메모리 플래시',
    description: '찰나의 순간 스쳐가는 정보를 포착하세요.',
    category: 'SPEED',
    level: 1,
    thumbnail: 'from-sky-500 to-cyan-500',
    icon: 'Zap',
    route: '/game/memory-flash',
    isComingSoon: false,
    estimatedTime: '3분',
    difficulty: 3,
  },

  // ============================================
  // MEMORY - 기억력 강화
  // ============================================
  {
    id: 'dual-n-back',
    name: '듀얼 엔백',
    description: '위치와 소리를 동시에 기억하여 IQ를 높이세요.',
    category: 'MEMORY',
    level: 1,
    thumbnail: 'from-purple-500 to-violet-500',
    icon: 'Brain',
    route: '/game/dual-n-back',
    isComingSoon: false,
    estimatedTime: '5분',
    difficulty: 4,
  },
  {
    id: 'memory-grid',
    name: '메모리 그리드',
    description: '반짝이는 칸의 위치를 정확히 기억하세요.',
    category: 'MEMORY',
    level: 1,
    thumbnail: 'from-violet-500 to-purple-500',
    icon: 'Grid2X2',
    route: '/game/memory-grid',
    isComingSoon: true,
    estimatedTime: '3분',
    difficulty: 2,
  },
  {
    id: 'random-images',
    name: '이미지 연상',
    description: '20개의 이미지를 스토리로 연결해 기억하세요.',
    category: 'MEMORY',
    level: 1,
    thumbnail: 'from-fuchsia-500 to-pink-500',
    icon: 'Images',
    route: '/game/random-images',
    isComingSoon: false,
    estimatedTime: '3분',
    difficulty: 3,
  },
  {
    id: 'random-words-l1',
    name: '단어 연결',
    description: '단어 사이의 연결고리를 만들어 암기하세요.',
    category: 'MEMORY',
    level: 1,
    thumbnail: 'from-pink-500 to-rose-500',
    icon: 'Type',
    route: '/game/random-words-l1',
    isComingSoon: true,
    estimatedTime: '5분',
    difficulty: 2,
  },
  {
    id: 'random-words-l2',
    name: '단어 회상',
    description: '무작위 단어를 빠르고 정확하게 외우세요.',
    category: 'MEMORY',
    level: 2,
    thumbnail: 'from-rose-500 to-pink-500',
    icon: 'Type',
    route: '/game/random-words-l2',
    isComingSoon: true,
    estimatedTime: '7분',
    difficulty: 4,
  },
  {
    id: 'random-numbers',
    name: '무작위 숫자',
    description: '긴 숫자열을 덩어리로 묶어 기억하세요.',
    category: 'MEMORY',
    level: 1,
    thumbnail: 'from-purple-600 to-indigo-500',
    icon: 'Hash',
    route: '/game/random-numbers',
    isComingSoon: true,
    estimatedTime: '4분',
    difficulty: 3,
  },
  {
    id: 'chunking',
    name: '청킹 연습',
    description: '기억 용량을 늘리기 위해 정보를 그룹화하세요.',
    category: 'MEMORY',
    level: 1,
    thumbnail: 'from-violet-600 to-purple-500',
    icon: 'Layers',
    route: '/game/chunking',
    isComingSoon: true,
    estimatedTime: '5분',
    difficulty: 2,
  },
  {
    id: 'short-term-memory-l1',
    name: '아이템 찾기',
    description: '방해물 속에서 기억한 아이템을 찾으세요.',
    category: 'MEMORY',
    level: 1,
    thumbnail: 'from-purple-500 to-fuchsia-500',
    icon: 'Search',
    route: '/game/short-term-memory-l1',
    isComingSoon: true,
    estimatedTime: '3분',
    difficulty: 2,
  },
  {
    id: 'short-term-memory-l2',
    name: '숫자 재배열',
    description: '기억한 숫자를 오름차순으로 재배열하세요.',
    category: 'MEMORY',
    level: 2,
    thumbnail: 'from-fuchsia-500 to-purple-500',
    icon: 'ArrowUpDown',
    route: '/game/short-term-memory-l2',
    isComingSoon: true,
    estimatedTime: '4분',
    difficulty: 4,
  },

  // ============================================
  // FOCUS - 주의력 및 통제
  // ============================================
  {
    id: 'stroop-test',
    name: '스트룹 테스트',
    description: '글자의 뜻에 속지 말고 색깔을 선택하세요.',
    category: 'FOCUS',
    level: 1,
    thumbnail: 'from-amber-500 to-orange-500',
    icon: 'Palette',
    route: '/game/stroop-test',
    isComingSoon: false,
    estimatedTime: '1분',
    difficulty: 3,
  },
  {
    id: 'flanker-task',
    name: '플랭커 과제',
    description: '주변 화살표를 무시하고 가운데 방향을 맞추세요.',
    category: 'FOCUS',
    level: 1,
    thumbnail: 'from-orange-500 to-red-500',
    icon: 'ArrowRight',
    route: '/game/flanker-task',
    isComingSoon: true,
    estimatedTime: '2분',
    difficulty: 2,
  },
  {
    id: 'camera-mind',
    name: '카메라 마인드',
    description: '가장 마지막에 나타난 원을 추적하여 찾으세요.',
    category: 'FOCUS',
    level: 1,
    thumbnail: 'from-yellow-500 to-amber-500',
    icon: 'Eye',
    route: '/game/camera-mind',
    isComingSoon: false,
    estimatedTime: '4분',
    difficulty: 3,
  },

  // ============================================
  // LOGIC - 논리 및 연산
  // ============================================
  {
    id: 'speed-mental-math',
    name: '스피드 암산',
    description: '빠른 연산으로 두뇌 회전 속도를 올리세요.',
    category: 'LOGIC',
    level: 1,
    thumbnail: 'from-emerald-500 to-teal-500',
    icon: 'Calculator',
    route: '/game/speed-mental-math',
    isComingSoon: true,
    estimatedTime: '3분',
    difficulty: 2,
  },
];

// 카테고리별 게임 필터링 헬퍼 함수
export const getGamesByCategory = (category: GameCategory): GameData[] => {
  return games.filter((game) => game.category === category);
};

// 사용 가능한 게임만 필터링
export const getAvailableGames = (): GameData[] => {
  return games.filter((game) => !game.isComingSoon);
};

// 특정 게임 찾기
export const getGameById = (id: string): GameData | undefined => {
  return games.find((game) => game.id === id);
};
