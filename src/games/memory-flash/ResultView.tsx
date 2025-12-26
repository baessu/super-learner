/**
 * ResultView.tsx
 * 결과 화면 컴포넌트 - 티어 배지 및 상세 결과 표시
 */

import { RotateCcw, ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ResultData } from './useMemoryFlashLogic';
import { getLevelConfig } from './levelData';

// Coral 테마 색상
const CORAL = {
  primary: '#E87C63',
  light: '#FEF2F0',
};

interface ResultViewProps {
  result: ResultData;
  onRetry: () => void;
  onNextLevel: () => void;
  onLevelSelect: () => void;
}

/**
 * 결과 화면 컴포넌트
 */
export function ResultView({ result, onRetry, onNextLevel, onLevelSelect }: ResultViewProps) {
  const { tier, isCorrect, actualCounts, userCounts, differences, level } = result;
  const config = getLevelConfig(level);
  const hasNextLevel = level < 5;

  return (
    <div className="flex flex-col items-center py-6 max-w-md mx-auto">
      {/* 티어 배지 - 애니메이션 효과 */}
      <div
        className={`
          w-32 h-32 rounded-full flex items-center justify-center mb-6 shadow-xl
          ${isCorrect ? 'animate-bounce-once' : 'animate-shake'}
        `}
        style={{
          backgroundColor: tier.color + '20',
          borderWidth: 4,
          borderColor: tier.color,
        }}
      >
        <span className="text-6xl">{tier.emoji}</span>
      </div>

      {/* 티어 등급 */}
      <div className="text-center mb-4">
        <div
          className="inline-block px-6 py-2 rounded-full text-2xl font-bold text-white mb-2"
          style={{ backgroundColor: tier.color }}
        >
          {tier.grade} Class
        </div>
        <h2 className="text-xl font-bold text-gray-800">{tier.name}</h2>
        <p className="text-gray-500">{tier.nameKo}</p>
      </div>

      {/* 메시지 */}
      <div
        className="px-6 py-3 rounded-xl mb-6 text-center"
        style={{ backgroundColor: tier.color + '20' }}
      >
        <p className="font-medium" style={{ color: tier.color }}>
          {tier.message}
        </p>
      </div>

      {/* 레벨 정보 */}
      <div className="text-center text-sm text-gray-500 mb-6">
        <p>
          Level {level} ({config.name}) - {config.letterCount}개 / {config.flashDuration}초
        </p>
      </div>

      {/* 상세 결과 */}
      <div className="w-full bg-gray-50 rounded-2xl p-5 mb-6">
        <h3 className="font-bold text-gray-800 mb-4 text-center">상세 결과</h3>

        <div className="space-y-3">
          {config.letterTypes.map((char) => {
            const actual = actualCounts[char] || 0;
            const user = userCounts[char] || 0;
            const diff = differences[char] || 0;
            const isMatch = diff === 0;

            return (
              <div
                key={char}
                className={`
                  flex items-center justify-between p-3 rounded-xl
                  ${isMatch ? 'bg-emerald-50' : 'bg-red-50'}
                `}
              >
                {/* 글자 */}
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-800">{char}</span>
                </div>

                {/* 결과 */}
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">정답</p>
                    <p className="text-lg font-bold text-gray-800">{actual}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">입력</p>
                    <p className="text-lg font-bold text-gray-800">{user}</p>
                  </div>
                  <div className="text-center min-w-[50px]">
                    {isMatch ? (
                      <span className="text-emerald-600 font-bold">O</span>
                    ) : (
                      <span className="text-red-500 font-bold">
                        {diff > 0 ? `+${diff}` : diff}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 총점 */}
        <div className="mt-4 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            {isCorrect ? (
              <span className="text-emerald-600 font-bold">100% 정확! 완벽합니다!</span>
            ) : (
              <span className="text-red-500">정확도 미달 - 다시 도전하세요!</span>
            )}
          </p>
        </div>
      </div>

      {/* 버튼들 */}
      <div className="flex flex-col gap-3 w-full">
        {/* 성공 시 다음 레벨 버튼 */}
        {isCorrect && hasNextLevel && (
          <button
            onClick={onNextLevel}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: CORAL.primary }}
          >
            다음 레벨 도전
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* 재도전 버튼 */}
        <button
          onClick={onRetry}
          className={`
            flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95
            ${isCorrect && hasNextLevel
              ? 'bg-gray-100 text-gray-700'
              : 'text-white'
            }
          `}
          style={!isCorrect || !hasNextLevel ? { backgroundColor: CORAL.primary } : {}}
        >
          <RotateCcw className="w-5 h-5" />
          {isCorrect ? '다시 도전' : '재도전'}
        </button>

        {/* 레벨 선택 버튼 */}
        <button
          onClick={onLevelSelect}
          className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold transition-all hover:bg-gray-200"
        >
          레벨 선택
        </button>

        {/* 게임 목록 버튼 */}
        <Link
          to="/games"
          className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold transition-all hover:bg-gray-200"
        >
          <Home className="w-5 h-5" />
          게임 목록
        </Link>
      </div>
    </div>
  );
}
