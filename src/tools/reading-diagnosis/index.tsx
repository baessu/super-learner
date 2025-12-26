/**
 * 슈퍼 러닝 자가 진단 테스트
 * 읽기 속도와 이해력을 측정하여 학습 유형 진단
 */

import { BookOpen, Clock, Brain, Target, RotateCcw, Home, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useReadingDiagnosisLogic } from './useReadingDiagnosisLogic';

// Coral 테마
const CORAL = {
  primary: '#E87C63',
  light: '#FEF2F0',
  hover: '#D66B53',
};

// 유형별 색상
const TYPE_COLORS: Record<string, string> = {
  A: '#3B82F6', // Blue
  B: '#F59E0B', // Amber
  C: '#8B5CF6', // Purple
  D: '#22C55E', // Green
};

// 유형별 이모지
const TYPE_EMOJI: Record<string, string> = {
  A: '🐢',
  B: '🚂',
  C: '💎',
  D: '🚀',
};

export default function ReadingDiagnosis() {
  const {
    phase,
    answers,
    result,
    passageLength,
    allAnswered,
    passage,
    questions,
    startReading,
    finishReading,
    selectAnswer,
    submitQuiz,
    resetTest,
  } = useReadingDiagnosisLogic();

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto">
      {/* 타이틀 */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BookOpen className="w-6 h-6" style={{ color: CORAL.primary }} />
          <h2 className="text-2xl font-bold text-gray-800">슈퍼 러닝 자가 진단</h2>
        </div>
        <p className="text-sm text-gray-500">읽기 속도와 이해력을 측정합니다</p>
      </div>

      {/* 인트로 화면 */}
      {phase === 'intro' && (
        <div className="w-full">
          {/* 아이콘 */}
          <div className="flex justify-center mb-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
              style={{ backgroundColor: CORAL.light }}
            >
              <Target className="w-10 h-10" style={{ color: CORAL.primary }} />
            </div>
          </div>

          {/* 테스트 설명 */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-4 text-center">테스트 안내</h3>

            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">지문 읽기</p>
                  <p>약 {passageLength.toLocaleString()}자 분량의 글을 자연스럽게 읽습니다.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">이해력 퀴즈</p>
                  <p>읽은 내용에 대한 7개의 문제를 풉니다.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">결과 분석</p>
                  <p>읽기 속도와 이해력을 분석하여 학습 유형을 진단합니다.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 주의사항 */}
          <div className="bg-amber-50 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">주의사항</p>
                <ul className="space-y-1 text-amber-700">
                  <li>• 조용한 환경에서 진행해주세요</li>
                  <li>• 시작 버튼을 누르면 자동으로 시간이 측정됩니다</li>
                  <li>• 평소처럼 자연스럽게 읽어주세요</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 시작 버튼 */}
          <button
            onClick={startReading}
            className="w-full py-4 rounded-2xl text-white text-lg font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg"
            style={{ backgroundColor: CORAL.primary }}
          >
            테스트 시작하기
          </button>
        </div>
      )}

      {/* 읽기 화면 */}
      {phase === 'reading' && (
        <div className="w-full">
          {/* 상단 안내 */}
          <div
            className="flex items-center justify-between mb-4 px-4 py-3 rounded-xl"
            style={{ backgroundColor: CORAL.light }}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" style={{ color: CORAL.primary }} />
              <span className="text-sm font-medium" style={{ color: CORAL.primary }}>
                시간 측정 중...
              </span>
            </div>
            <span className="text-xs text-gray-500">{passageLength.toLocaleString()}자</span>
          </div>

          {/* 지문 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
            <p className="text-gray-800 leading-relaxed whitespace-pre-line text-base">
              {passage}
            </p>
          </div>

          {/* 완료 버튼 */}
          <button
            onClick={finishReading}
            className="w-full py-4 rounded-2xl text-white text-lg font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg"
            style={{ backgroundColor: CORAL.primary }}
          >
            다 읽었습니다
          </button>
        </div>
      )}

      {/* 퀴즈 화면 */}
      {phase === 'quiz' && (
        <div className="w-full">
          {/* 상단 안내 */}
          <div
            className="flex items-center gap-2 mb-4 px-4 py-3 rounded-xl"
            style={{ backgroundColor: CORAL.light }}
          >
            <Brain className="w-5 h-5" style={{ color: CORAL.primary }} />
            <span className="text-sm font-medium" style={{ color: CORAL.primary }}>
              방금 읽은 내용에 대한 문제입니다 (지문을 보지 않고 풀어주세요)
            </span>
          </div>

          {/* 진행 상황 */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>진행률</span>
              <span>
                {Object.keys(answers).length} / {questions.length}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${(Object.keys(answers).length / questions.length) * 100}%`,
                  backgroundColor: CORAL.primary,
                }}
              />
            </div>
          </div>

          {/* 문제들 */}
          <div className="space-y-6 mb-6">
            {questions.map((q, qIndex) => (
              <div key={q.id} className="bg-gray-50 rounded-2xl p-5">
                <p className="font-medium text-gray-800 mb-3">
                  <span
                    className="inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-sm mr-2"
                    style={{ backgroundColor: CORAL.primary }}
                  >
                    {qIndex + 1}
                  </span>
                  {q.question}
                </p>

                <div className="space-y-2">
                  {q.options.map((option, oIndex) => (
                    <button
                      key={oIndex}
                      onClick={() => selectAnswer(q.id, oIndex)}
                      className={`
                        w-full text-left px-4 py-3 rounded-xl transition-all
                        ${
                          answers[q.id] === oIndex
                            ? 'bg-white border-2 shadow-sm'
                            : 'bg-white border border-gray-200 hover:border-gray-300'
                        }
                      `}
                      style={{
                        borderColor: answers[q.id] === oIndex ? CORAL.primary : undefined,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`
                            w-6 h-6 rounded-full flex items-center justify-center text-sm
                            ${
                              answers[q.id] === oIndex
                                ? 'text-white'
                                : 'bg-gray-100 text-gray-600'
                            }
                          `}
                          style={{
                            backgroundColor:
                              answers[q.id] === oIndex ? CORAL.primary : undefined,
                          }}
                        >
                          {String.fromCharCode(65 + oIndex)}
                        </span>
                        <span className="text-gray-700">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 제출 버튼 */}
          <button
            onClick={submitQuiz}
            disabled={!allAnswered}
            className={`
              w-full py-4 rounded-2xl text-lg font-semibold transition-all shadow-lg
              ${
                allAnswered
                  ? 'text-white hover:scale-105 active:scale-95'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
            style={{ backgroundColor: allAnswered ? CORAL.primary : undefined }}
          >
            {allAnswered ? '결과 확인하기' : `${questions.length - Object.keys(answers).length}개 문제 남음`}
          </button>
        </div>
      )}

      {/* 결과 화면 */}
      {phase === 'result' && result && (
        <div className="w-full">
          {/* 유형 배지 */}
          <div className="flex flex-col items-center mb-6">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mb-3 shadow-lg"
              style={{
                backgroundColor: TYPE_COLORS[result.diagnosis.type] + '20',
                borderWidth: 3,
                borderColor: TYPE_COLORS[result.diagnosis.type],
              }}
            >
              <span className="text-5xl">{TYPE_EMOJI[result.diagnosis.type]}</span>
            </div>
            <div
              className="px-4 py-1 rounded-full text-white font-bold"
              style={{ backgroundColor: TYPE_COLORS[result.diagnosis.type] }}
            >
              {result.diagnosis.type}유형
            </div>
            <h3 className="text-xl font-bold text-gray-800 mt-2">
              {result.diagnosis.typeName}
            </h3>
            <p className="text-sm text-gray-500">{result.diagnosis.description}</p>
          </div>

          {/* 조언 */}
          <div
            className="rounded-xl p-4 mb-6"
            style={{ backgroundColor: TYPE_COLORS[result.diagnosis.type] + '10' }}
          >
            <p
              className="text-center font-medium"
              style={{ color: TYPE_COLORS[result.diagnosis.type] }}
            >
              {result.diagnosis.advice}
            </p>
          </div>

          {/* 상세 결과 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* 읽기 속도 */}
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-gray-500">읽기 속도</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {result.charactersPerMinute.toLocaleString()}
                <span className="text-sm font-normal text-gray-500 ml-1">글자/분</span>
              </p>
              <div className="mt-2 flex items-center gap-1">
                <span
                  className="px-2 py-0.5 rounded text-xs font-medium text-white"
                  style={{
                    backgroundColor:
                      result.speedGrade === '슈퍼 러너'
                        ? '#FFD700'
                        : result.speedGrade === '속독' || result.speedGrade === '빠름'
                        ? '#22C55E'
                        : result.speedGrade === '평균 이상' || result.speedGrade === '평균'
                        ? '#3B82F6'
                        : '#F59E0B',
                  }}
                >
                  {result.speedGrade}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                소요 시간: {Math.round(result.readingTimeSeconds)}초
              </p>
            </div>

            {/* 이해력 */}
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-purple-500" />
                <span className="text-sm text-gray-500">이해력</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {result.comprehensionPercent}
                <span className="text-sm font-normal text-gray-500 ml-1">%</span>
              </p>
              <div className="mt-2 flex items-center gap-1">
                <span
                  className="px-2 py-0.5 rounded text-xs font-medium text-white"
                  style={{
                    backgroundColor:
                      result.comprehensionGrade === '우수'
                        ? '#22C55E'
                        : result.comprehensionGrade === '양호'
                        ? '#3B82F6'
                        : result.comprehensionGrade === '보통'
                        ? '#F59E0B'
                        : '#EF4444',
                  }}
                >
                  {result.comprehensionGrade}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                정답: {result.correctAnswers} / {result.totalQuestions}문제
              </p>
            </div>
          </div>

          {/* 퀴즈 결과 상세 */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <h4 className="font-medium text-gray-800 mb-3">문제별 결과</h4>
            <div className="space-y-2">
              {questions.map((q, idx) => {
                const isCorrect = answers[q.id] === q.correctIndex;
                return (
                  <div
                    key={q.id}
                    className={`
                      flex items-center gap-3 p-2 rounded-lg
                      ${isCorrect ? 'bg-green-50' : 'bg-red-50'}
                    `}
                  >
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    )}
                    <span className="text-sm text-gray-700 truncate">
                      {idx + 1}. {q.question}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 등급 기준표 */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <h4 className="font-medium text-gray-800 mb-3">속도 등급 기준</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">느림</span>
                <span className="text-gray-700">400 미만</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">평균 이하</span>
                <span className="text-gray-700">400~600</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">평균</span>
                <span className="text-gray-700">600~800</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">평균 이상</span>
                <span className="text-gray-700">800~1,200</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">빠름</span>
                <span className="text-gray-700">1,200~1,800</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">속독</span>
                <span className="text-gray-700">1,800~2,500</span>
              </div>
              <div className="flex justify-between col-span-2">
                <span className="text-yellow-600 font-medium">슈퍼 러너</span>
                <span className="text-yellow-600 font-medium">2,500 이상</span>
              </div>
            </div>
          </div>

          {/* 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={resetTest}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: CORAL.primary }}
            >
              <RotateCcw className="w-5 h-5" />
              다시 테스트
            </button>
            <Link
              to="/tools"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold transition-all hover:bg-gray-200"
            >
              <Home className="w-5 h-5" />
              도구 목록
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
