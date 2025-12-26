/**
 * useReadingDiagnosisLogic.ts
 * 슈퍼 러닝 자가 진단 테스트 로직
 *
 * - 읽기 속도 측정 (글자/분)
 * - 이해력 측정 (퀴즈 정답률)
 * - 4가지 유형 진단
 */

import { useState, useCallback, useRef } from 'react';
import { getRandomPassage } from './passages';
import type { PassageData } from './passages';

// 테스트 단계
export type TestPhase = 'intro' | 'reading' | 'quiz' | 'result';

// QuizQuestion을 re-export
export type { QuizQuestion } from './passages';

// 속도 등급
export type SpeedGrade = '느림' | '평균 이하' | '평균' | '평균 이상' | '빠름' | '속독' | '슈퍼 러너';

// 이해력 등급
export type ComprehensionGrade = '우수' | '양호' | '보통' | '미흡';

// 진단 유형
export type DiagnosisType = 'A' | 'B' | 'C' | 'D';

// 진단 결과
export interface DiagnosisResult {
  type: DiagnosisType;
  typeName: string;
  description: string;
  advice: string;
}

// 결과 데이터
export interface TestResult {
  readingTimeSeconds: number;
  charactersPerMinute: number; // 분당 글자 수 (글자/분)
  speedGrade: SpeedGrade;
  correctAnswers: number;
  totalQuestions: number;
  comprehensionPercent: number;
  comprehensionGrade: ComprehensionGrade;
  diagnosis: DiagnosisResult;
}

// 속도 기준선 (조정 가능)
const SPEED_THRESHOLD = 600;

/**
 * 속도 등급 계산
 * @param cpm - 분당 글자 수 (characters per minute)
 */
function calculateSpeedGrade(cpm: number): SpeedGrade {
  if (cpm < 400) return '느림';
  if (cpm < 600) return '평균 이하';
  if (cpm < 800) return '평균';
  if (cpm < 1200) return '평균 이상';
  if (cpm < 1800) return '빠름';
  if (cpm < 2500) return '속독';
  return '슈퍼 러너';
}

/**
 * 이해력 등급 계산
 */
function calculateComprehensionGrade(percent: number): ComprehensionGrade {
  if (percent >= 90) return '우수';
  if (percent >= 70) return '양호';
  if (percent >= 50) return '보통';
  return '미흡';
}

/**
 * 진단 유형 결정
 * @param cpm - 분당 글자 수 (characters per minute)
 */
function determineDiagnosis(cpm: number, comprehensionPercent: number): DiagnosisResult {
  const isFast = cpm >= SPEED_THRESHOLD;
  const hasGoodComprehension = comprehensionPercent >= 70;

  if (!isFast && hasGoodComprehension) {
    return {
      type: 'A',
      typeName: '거북이 학자형',
      description: '꼼꼼하게 읽지만 속도가 느린 유형',
      advice: '속도 훈련에 집중하세요. 이해력은 충분합니다!',
    };
  }

  if (isFast && !hasGoodComprehension) {
    return {
      type: 'B',
      typeName: '폭주 기관차형',
      description: '빠르게 읽지만 내용 파악이 부족한 유형',
      advice: '기억술(멘탈 마커)에 집중하세요. 속도보다 이해가 우선입니다.',
    };
  }

  if (!isFast && !hasGoodComprehension) {
    return {
      type: 'C',
      typeName: '잠재력 보유형',
      description: '속도와 이해력 모두 향상이 필요한 유형',
      advice: '커리큘럼을 충실히 따라가세요. 가장 큰 발전이 가능합니다!',
    };
  }

  return {
    type: 'D',
    typeName: '예비 슈퍼러너형',
    description: '속도와 이해력 모두 우수한 유형',
    advice: '슈퍼 러너(2,500글자/분)를 목표로 도전하세요!',
  };
}

export function useReadingDiagnosisLogic() {
  // 랜덤 지문 선택 (초기값)
  const [currentPassage, setCurrentPassage] = useState<PassageData>(() => getRandomPassage());
  const [phase, setPhase] = useState<TestPhase>('intro');
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<TestResult | null>(null);

  const startTimeRef = useRef<number | null>(null);
  const endTimeRef = useRef<number | null>(null);

  // 지문 글자 수 (공백 제외)
  const passageLength = currentPassage.charCountNoSpace;

  /**
   * 테스트 시작 (읽기 시작)
   */
  const startReading = useCallback(() => {
    startTimeRef.current = Date.now();
    setPhase('reading');
  }, []);

  /**
   * 읽기 완료
   */
  const finishReading = useCallback(() => {
    endTimeRef.current = Date.now();
    setPhase('quiz');
  }, []);

  /**
   * 답변 선택
   */
  const selectAnswer = useCallback((questionId: number, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  }, []);

  /**
   * 퀴즈 제출 및 결과 계산
   */
  const submitQuiz = useCallback(() => {
    if (!startTimeRef.current || !endTimeRef.current) return;

    // 읽기 시간 계산
    const readingTimeSeconds = (endTimeRef.current - startTimeRef.current) / 1000;

    // 분당 글자 수 계산 (글자/분)
    const charactersPerMinute = Math.round((passageLength / readingTimeSeconds) * 60);

    // 정답 수 계산
    const correctAnswers = currentPassage.questions.filter(
      (q) => answers[q.id] === q.correctIndex
    ).length;

    // 이해력 퍼센트
    const comprehensionPercent = Math.round(
      (correctAnswers / currentPassage.questions.length) * 100
    );

    // 등급 계산
    const speedGrade = calculateSpeedGrade(charactersPerMinute);
    const comprehensionGrade = calculateComprehensionGrade(comprehensionPercent);

    // 진단 결정
    const diagnosis = determineDiagnosis(charactersPerMinute, comprehensionPercent);

    setResult({
      readingTimeSeconds,
      charactersPerMinute,
      speedGrade,
      correctAnswers,
      totalQuestions: currentPassage.questions.length,
      comprehensionPercent,
      comprehensionGrade,
      diagnosis,
    });

    setPhase('result');
  }, [answers, passageLength, currentPassage]);

  /**
   * 테스트 리셋 (새로운 랜덤 지문 선택)
   */
  const resetTest = useCallback(() => {
    setCurrentPassage(getRandomPassage()); // 새로운 랜덤 지문 선택
    setPhase('intro');
    setAnswers({});
    setResult(null);
    startTimeRef.current = null;
    endTimeRef.current = null;
  }, []);

  // 모든 문제에 답했는지 확인
  const allAnswered = currentPassage.questions.every((q) => answers[q.id] !== undefined);

  return {
    // 상태
    phase,
    answers,
    result,
    passageLength,
    allAnswered,

    // 데이터
    passage: currentPassage.passage,
    questions: currentPassage.questions,
    passageInfo: {
      id: currentPassage.id,
      topic: currentPassage.topic,
      category: currentPassage.category,
      title: currentPassage.title,
    },

    // 액션
    startReading,
    finishReading,
    selectAnswer,
    submitQuiz,
    resetTest,
  };
}
