/**
 * OverlayScreens.tsx
 * 레벨 전환 및 게임 오버 화면 컴포넌트
 */

import { useEffect } from 'react';
import { Brain, RotateCcw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getTierEmoji, type TierInfo } from '../../utils/scoringUtils';

// Coral 테마 색상
const CORAL = {
  primary: '#E87C63',
  light: '#FEF2F0',
  hover: '#D66B53',
};

interface LevelTransitionProps {
  level: number;
  onComplete: () => void;
}

/**
 * 레벨 전환 화면
 */
export function LevelTransition({ level, onComplete }: LevelTransitionProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center z-10">
      {/* 브레인 아이콘 */}
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg"
        style={{ backgroundColor: CORAL.light }}
      >
        <Brain className="w-12 h-12" style={{ color: CORAL.primary }} />
      </div>

      {/* 레벨 텍스트 */}
      <h2
        className="text-4xl font-serif italic text-gray-800"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        Level {level}
      </h2>

      {/* 안내 문구 */}
      <p className="mt-4 text-gray-500 text-sm">
        가장 마지막에 생겨난 원을 찾으세요
      </p>

      {/* 로딩 인디케이터 */}
      <div className="mt-8 flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
            style={{
              animationDelay: `${i * 0.15}s`,
              backgroundColor: CORAL.primary,
            }}
          />
        ))}
      </div>
    </div>
  );
}

interface GameOverScreenProps {
  level: number;
  onRestart: () => void;
  scoreResult?: {
    score: number;
    tier: TierInfo;
    feedback: string;
  } | null;
}

/**
 * 게임 오버 화면
 */
export function GameOverScreen({ level, onRestart, scoreResult }: GameOverScreenProps) {
  // 최종 스코어는 레벨 - 1 (마지막으로 성공한 레벨)
  const finalLevel = Math.max(1, level - 1);

  return (
    <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center z-10">
      {/* 티어 배지 */}
      {scoreResult ? (
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mb-4 shadow-lg"
          style={{ backgroundColor: scoreResult.tier.color + '20', borderColor: scoreResult.tier.color, borderWidth: 3 }}
        >
          <span className="text-5xl">{getTierEmoji(scoreResult.tier.grade)}</span>
        </div>
      ) : (
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4 shadow-lg">
          <span className="text-5xl">😵</span>
        </div>
      )}

      {/* 게임 오버 텍스트 */}
      <h2
        className="text-3xl font-serif italic text-gray-800 mb-1"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        Game Over
      </h2>

      {/* 티어 표시 */}
      {scoreResult && (
        <div className="flex items-center gap-2 mb-2">
          <span
            className="px-3 py-1 rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: scoreResult.tier.color }}
          >
            {scoreResult.tier.grade} 등급
          </span>
          <span className="text-sm text-gray-500">{scoreResult.tier.percentile}</span>
        </div>
      )}

      {/* 최종 레벨 & 점수 */}
      <div className="text-center mb-4">
        <p className="text-gray-600">
          도달 레벨: <span className="font-bold text-2xl" style={{ color: CORAL.primary }}>{finalLevel}</span>
        </p>
        {scoreResult && (
          <p className="text-lg font-bold text-indigo-600 mt-1">
            +{scoreResult.score.toLocaleString()}점
          </p>
        )}
      </div>

      {/* 피드백 메시지 */}
      {scoreResult && (
        <div className="bg-gray-50 px-4 py-2 rounded-xl mb-6 max-w-xs">
          <p className="text-sm text-gray-700 text-center">{scoreResult.feedback}</p>
        </div>
      )}

      {/* 버튼들 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onRestart}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 active:scale-95"
          style={{ backgroundColor: CORAL.primary }}
        >
          <RotateCcw className="w-5 h-5" />
          다시 도전
        </button>
        <Link
          to="/games"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold transition-all hover:bg-gray-200 hover:scale-105 active:scale-95"
        >
          <Home className="w-5 h-5" />
          게임 목록
        </Link>
      </div>
    </div>
  );
}

interface IntroScreenProps {
  onStart: () => void;
}

/**
 * 인트로 화면
 */
export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      {/* 타이틀 아이콘 */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-lg"
        style={{ backgroundColor: CORAL.light }}
      >
        <Brain className="w-10 h-10" style={{ color: CORAL.primary }} />
      </div>

      {/* 게임 타이틀 */}
      <h1
        className="text-3xl font-serif italic text-gray-800 mb-2"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        Camera Mind
      </h1>
      <p className="text-gray-500 mb-8">시각적 작업 기억력 훈련</p>

      {/* 게임 설명 */}
      <div className="bg-gray-50 rounded-2xl p-6 mb-8 max-w-sm text-center">
        <h3 className="font-bold text-gray-800 mb-3">게임 방법</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>화면에 원들이 하나씩 추가됩니다.</p>
          <p>
            <strong className="text-gray-800">가장 마지막에 생겨난 원</strong>을 클릭하세요.
          </p>
          <p>잘못된 원을 클릭하면 게임이 끝납니다.</p>
        </div>
      </div>

      {/* 시작 버튼 */}
      <button
        onClick={onStart}
        className="px-8 py-4 rounded-2xl text-white text-lg font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg"
        style={{ backgroundColor: CORAL.primary }}
      >
        게임 시작
      </button>
    </div>
  );
}
