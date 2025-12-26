/**
 * useMajorSystemStore.ts
 * 메이저 시스템 상태 관리 (Zustand + persist)
 *
 * - mapping: 숫자 → 초성 매핑 규칙
 * - dictionary: 단어 사전 (단어, 숫자코드)
 * - 매핑 변경 시 모든 사전 단어의 숫자코드 자동 재계산
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { type Chosung, wordToNumberCode } from './hangulUtils';

// 단어 사전 항목 타입
export interface DictionaryEntry {
  id: string;
  word: string;
  numberCode: string;
  createdAt: string;
}

// 매핑 타입 (0-9 숫자 → 초성 배열)
export type MajorSystemMapping = Record<number, Chosung[]>;

// 기본 매핑 규칙
const DEFAULT_MAPPING: MajorSystemMapping = {
  0: ['ㅎ'],
  1: ['ㄱ', 'ㅋ', 'ㄲ'],
  2: ['ㄴ'],
  3: ['ㄷ', 'ㅌ', 'ㄸ'],
  4: ['ㄹ'],
  5: ['ㅁ'],
  6: ['ㅂ', 'ㅍ', 'ㅃ'],
  7: ['ㅅ', 'ㅆ'],
  8: ['ㅇ'],
  9: ['ㅈ', 'ㅊ', 'ㅉ'],
};

// 초기 샘플 단어 목록 (20개 이상)
const INITIAL_WORDS = [
  '가구', '가방', '고래', '기차', '나비', '나무', '노래', '다리',
  '도시', '라면', '마늘', '모자', '무지개', '바나나', '보리', '사과',
  '소리', '시계', '아기', '오리', '자두', '주사위', '차표', '초콜릿',
  '카메라', '코끼리', '타조', '토끼', '파도', '포도', '하마', '호랑이',
];

/**
 * 초기 사전 생성 (샘플 단어 + 숫자코드 계산)
 */
function createInitialDictionary(mapping: MajorSystemMapping): DictionaryEntry[] {
  const now = new Date().toISOString();
  return INITIAL_WORDS.map((word, index) => ({
    id: `initial-${index}-${Date.now()}`,
    word,
    numberCode: wordToNumberCode(word, mapping),
    createdAt: now,
  }));
}

/**
 * 모든 사전 항목의 숫자코드 재계산
 */
function recalculateDictionary(
  dictionary: DictionaryEntry[],
  mapping: MajorSystemMapping
): DictionaryEntry[] {
  return dictionary.map((entry) => ({
    ...entry,
    numberCode: wordToNumberCode(entry.word, mapping),
  }));
}

interface MajorSystemState {
  // 상태
  mapping: MajorSystemMapping;
  dictionary: DictionaryEntry[];

  // 매핑 액션
  updateMapping: (digit: number, consonants: Chosung[]) => void;
  addConsonantToDigit: (digit: number, consonant: Chosung) => void;
  removeConsonantFromDigit: (digit: number, consonant: Chosung) => void;
  resetMappingToDefault: () => void;

  // 사전 액션
  addWord: (word: string) => boolean;
  removeWord: (id: string) => void;
  clearDictionary: () => void;
  resetDictionaryToDefault: () => void;

  // 검색/필터
  findWordsByNumber: (numberCode: string) => DictionaryEntry[];
  calculateNumberCode: (word: string) => string;
}

export const useMajorSystemStore = create<MajorSystemState>()(
  devtools(
    persist(
      (set, get) => ({
        // 초기 상태
        mapping: DEFAULT_MAPPING,
        dictionary: createInitialDictionary(DEFAULT_MAPPING),

        // 매핑 전체 업데이트 (사전 자동 재계산)
        updateMapping: (digit: number, consonants: Chosung[]) => {
          set((state) => {
            const newMapping = {
              ...state.mapping,
              [digit]: consonants,
            };
            // 매핑 변경 시 모든 사전 단어의 숫자코드 재계산
            const updatedDictionary = recalculateDictionary(state.dictionary, newMapping);
            return {
              mapping: newMapping,
              dictionary: updatedDictionary,
            };
          });
        },

        // 특정 숫자에 초성 추가
        addConsonantToDigit: (digit: number, consonant: Chosung) => {
          const { mapping, updateMapping } = get();
          const currentConsonants = mapping[digit] ?? [];
          if (!currentConsonants.includes(consonant)) {
            updateMapping(digit, [...currentConsonants, consonant]);
          }
        },

        // 특정 숫자에서 초성 제거
        removeConsonantFromDigit: (digit: number, consonant: Chosung) => {
          const { mapping, updateMapping } = get();
          const currentConsonants = mapping[digit] ?? [];
          const filtered = currentConsonants.filter((c) => c !== consonant);
          updateMapping(digit, filtered);
        },

        // 매핑을 기본값으로 리셋
        resetMappingToDefault: () => {
          set((state) => ({
            mapping: DEFAULT_MAPPING,
            dictionary: recalculateDictionary(state.dictionary, DEFAULT_MAPPING),
          }));
        },

        // 단어 추가
        addWord: (word: string) => {
          const { dictionary, mapping } = get();
          const trimmed = word.trim();

          // 중복 체크
          if (dictionary.some((entry) => entry.word === trimmed)) {
            return false;
          }

          const newEntry: DictionaryEntry = {
            id: `word-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            word: trimmed,
            numberCode: wordToNumberCode(trimmed, mapping),
            createdAt: new Date().toISOString(),
          };

          set((state) => ({
            dictionary: [newEntry, ...state.dictionary],
          }));

          return true;
        },

        // 단어 삭제
        removeWord: (id: string) => {
          set((state) => ({
            dictionary: state.dictionary.filter((entry) => entry.id !== id),
          }));
        },

        // 사전 전체 삭제
        clearDictionary: () => {
          set({ dictionary: [] });
        },

        // 사전을 기본값으로 리셋
        resetDictionaryToDefault: () => {
          const { mapping } = get();
          set({
            dictionary: createInitialDictionary(mapping),
          });
        },

        // 숫자코드로 단어 검색
        findWordsByNumber: (numberCode: string) => {
          const { dictionary } = get();
          if (!numberCode) return [];
          return dictionary.filter((entry) =>
            entry.numberCode === numberCode || entry.numberCode.startsWith(numberCode)
          );
        },

        // 단어 → 숫자코드 계산 (현재 매핑 기준)
        calculateNumberCode: (word: string) => {
          const { mapping } = get();
          return wordToNumberCode(word, mapping);
        },
      }),
      {
        name: 'major-system-storage',
        partialize: (state) => ({
          mapping: state.mapping,
          dictionary: state.dictionary,
        }),
      }
    ),
    { name: 'MajorSystemStore' }
  )
);
