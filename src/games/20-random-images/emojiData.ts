/**
 * emojiData.ts
 * 20개 이미지 기억 게임에서 사용할 이모지 데이터
 * - 서로 확연히 구분되는 50개의 이모지 (동물, 음식, 사물, 자연 등)
 */

export const EMOJI_POOL: string[] = [
  // 동물 (Animals)
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🦁',
  '🐯', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🦅', '🦋', '🐢',

  // 음식 (Food)
  '🍎', '🍊', '🍋', '🍇', '🍉', '🍓', '🍕', '🍔', '🍟', '🍩',

  // 사물 (Objects)
  '⚽', '🏀', '🎸', '🎹', '📱', '💡', '🔑', '✂️', '📚', '🎁',

  // 자연 & 날씨 (Nature & Weather)
  '🌸', '🌻', '🌴', '🌈', '⭐', '🌙', '☀️', '❄️', '🔥', '💧',
];

/**
 * 배열에서 무작위로 n개의 요소를 선택하여 반환 (Fisher-Yates shuffle 기반)
 */
export function getRandomEmojis(count: number): string[] {
  const shuffled = [...EMOJI_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * 배열을 무작위로 섞어서 반환
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
