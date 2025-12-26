/**
 * textParser.ts
 * 텍스트를 단어 단위로 파싱하는 유틸리티
 */

import type { ParsedWord } from '../types';

/**
 * 문장 끝 부호 패턴
 */
const SENTENCE_END_PATTERN = /[.!?。！？]$/;

/**
 * 문장 부호 패턴 (쉼표, 세미콜론, 콜론 등)
 */
const PUNCTUATION_PATTERN = /[,;:，；：]$/;

/**
 * 텍스트를 단어 배열로 파싱
 * @param text - 원본 텍스트
 * @returns ParsedWord 배열
 */
export function parseText(text: string): ParsedWord[] {
  if (!text || !text.trim()) {
    return [];
  }

  const words: ParsedWord[] = [];
  let id = 0;

  // 문단 단위로 분리 (빈 줄 기준)
  const paragraphs = text.split(/\n\s*\n/);

  paragraphs.forEach((paragraph, paragraphIndex) => {
    // 각 문단 내 줄바꿈 처리
    const lines = paragraph.split(/\n/);

    lines.forEach((line, lineIndex) => {
      // 공백 기준으로 단어 분리
      const tokens = line.trim().split(/\s+/);
      const isLastLine = lineIndex === lines.length - 1;

      tokens.forEach((token, tokenIndex) => {
        if (!token) return;

        const isLastToken = tokenIndex === tokens.length - 1;
        const isParagraphEnd =
          paragraphIndex < paragraphs.length - 1 &&
          isLastLine &&
          isLastToken;

        // 문장 부호 체크
        const hasSentenceEnd = SENTENCE_END_PATTERN.test(token);
        const hasPunctuation = PUNCTUATION_PATTERN.test(token) || hasSentenceEnd;

        words.push({
          id: id++,
          text: token,
          isPunctuation: hasPunctuation,
          isParagraphEnd,
        });
      });
    });
  });

  return words;
}

/**
 * WPM을 밀리초 간격으로 변환
 * @param wpm - Words Per Minute
 * @returns 밀리초
 */
export function wpmToMs(wpm: number): number {
  return (60 / wpm) * 1000;
}

/**
 * 읽기 시간 계산 (초)
 * @param wordCount - 단어 수
 * @param wpm - 평균 WPM
 * @returns 초
 */
export function calculateReadingTime(wordCount: number, wpm: number): number {
  return (wordCount / wpm) * 60;
}

/**
 * 진행률 계산
 * @param currentIndex - 현재 인덱스
 * @param totalWords - 전체 단어 수
 * @returns 0-100 퍼센트
 */
export function calculateProgress(currentIndex: number, totalWords: number): number {
  if (totalWords === 0) return 0;
  return Math.round((currentIndex / totalWords) * 100);
}
