/**
 * hangulUtils.ts
 * 한글 유니코드 처리 유틸리티
 *
 * 외부 라이브러리 없이 순수 유니코드 연산으로 초성 추출
 * 한글 유니코드 구조: (초성 * 21 + 중성) * 28 + 종성 + 44032
 */

// 한글 초성 목록 (유니코드 순서)
export const CHOSUNG_LIST = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
] as const;

export type Chosung = typeof CHOSUNG_LIST[number];

// 한글 유니코드 범위
const HANGUL_START = 0xAC00; // 44032 ('가')
const HANGUL_END = 0xD7A3;   // 55203 ('힣')
const CHOSUNG_PERIOD = 588;   // 21 * 28 = 588 (한 초성당 글자 수)

/**
 * 문자가 완성형 한글인지 확인
 */
export function isHangulSyllable(char: string): boolean {
  if (char.length !== 1) return false;
  const code = char.charCodeAt(0);
  return code >= HANGUL_START && code <= HANGUL_END;
}

/**
 * 단일 한글 글자에서 초성 추출
 * @param char 단일 한글 문자
 * @returns 초성 문자 또는 null (한글이 아닌 경우)
 */
export function getChosung(char: string): Chosung | null {
  if (!isHangulSyllable(char)) return null;

  const code = char.charCodeAt(0);
  const chosungIndex = Math.floor((code - HANGUL_START) / CHOSUNG_PERIOD);

  return CHOSUNG_LIST[chosungIndex] ?? null;
}

/**
 * 문자열에서 모든 초성 추출
 * @param text 한글 문자열
 * @returns 초성 배열
 */
export function getChosungList(text: string): Chosung[] {
  const result: Chosung[] = [];

  for (const char of text) {
    const chosung = getChosung(char);
    if (chosung) {
      result.push(chosung);
    }
  }

  return result;
}

/**
 * 초성 → 숫자 변환 (매핑 기반)
 * @param chosung 초성 문자
 * @param mapping 숫자-초성 매핑 객체
 * @returns 해당 숫자 또는 null
 */
export function chosungToDigit(
  chosung: Chosung,
  mapping: Record<number, Chosung[]>
): number | null {
  for (const [digit, consonants] of Object.entries(mapping)) {
    if (consonants.includes(chosung)) {
      return parseInt(digit, 10);
    }
  }
  return null;
}

/**
 * 단어 → 숫자 코드 변환
 * @param word 한글 단어
 * @param mapping 숫자-초성 매핑 객체
 * @returns 숫자 코드 문자열
 */
export function wordToNumberCode(
  word: string,
  mapping: Record<number, Chosung[]>
): string {
  const chosungs = getChosungList(word);
  let code = '';

  for (const chosung of chosungs) {
    const digit = chosungToDigit(chosung, mapping);
    if (digit !== null) {
      code += digit.toString();
    }
  }

  return code;
}

/**
 * 숫자 → 가능한 초성 조합 생성
 * @param digit 단일 숫자
 * @param mapping 숫자-초성 매핑 객체
 * @returns 해당 숫자에 매핑된 초성 배열
 */
export function digitToChosungs(
  digit: number,
  mapping: Record<number, Chosung[]>
): Chosung[] {
  return mapping[digit] ?? [];
}
