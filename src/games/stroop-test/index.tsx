/**
 * Stroop Test Game
 * 선택적 주의력 및 인지 유연성 훈련
 *
 * - 단어의 '뜻'이 아니라 '색깔'을 선택
 * - 60초 타임어택
 * - 키보드 단축키 지원
 */

import { useEffect, useMemo } from 'react';
import { Palette, RotateCcw, Home, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStroopLogic, COLORS } from './useStroopLogic';
import { ColorButton } from './ColorButton';
import { useGameStore } from '../../store/useGameStore';
import { calculateGameScore, getTierEmoji } from '../../utils/scoringUtils';

// Coral 테마
const CORAL = {
  primary: '#E87C63',
  light: '#FEF2F0',
};

export default function StroopTest() {
  const {
    gameState,
    score,
    streak,
    timeLeft,
    question,
    feedback,
    stats,
    accuracy,
    gameDuration,
    startGame,
    submitAnswer,
    handleKeyPress,
  } = useStroopLogic();

  const { setCurrentGame, startGame: storeStartGame, finishGame } = useGameStore();

  // 점수 계산 (정확도 기반)
  const scoreResult = useMemo(() => {
    if (gameState !== 'game-over') return null;
    return calculateGameScore('stroop-test', accuracy);
  }, [gameState, accuracy]);

  // 게임 오버 시 점수 저장
  useEffect(() => {
    if (gameState === 'game-over' && scoreResult) {
      finishGame(scoreResult.score);
    }
  }, [gameState, scoreResult, finishGame]);

  // 키보드 이벤트
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 스페이스바로 게임 시작
      if (e.code === 'Space' && gameState === 'intro') {
        e.preventDefault();
        handleStartGame();
        return;
      }

      // Q, W, E, R 키로 색상 선택
      if (gameState === 'playing') {
        handleKeyPress(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, handleKeyPress]);

  // 게임 시작 핸들러
  const handleStartGame = () => {
    setCurrentGame('stroop-test');
    storeStartGame();
    startGame();
  };

  // 타이머 진행률
  const timerProgress = (timeLeft / gameDuration) * 100;

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto">
      {/* 게임 타이틀 */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Palette className="w-6 h-6" style={{ color: CORAL.primary }} />
          <h2 className="text-2xl font-bold text-gray-800">스트룹 테스트</h2>
        </div>
        <p className="text-sm text-gray-500">선택적 주의력 훈련</p>
      </div>

      {/* 인트로 화면 */}
      {gameState === 'intro' && (
        <div className="flex flex-col items-center py-8 w-full">
          {/* 아이콘 */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-lg"
            style={{ backgroundColor: CORAL.light }}
          >
            <Palette className="w-10 h-10" style={{ color: CORAL.primary }} />
          </div>

          {/* 게임 설명 */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6 w-full max-w-sm">
            <h3 className="font-bold text-gray-800 mb-3 text-center">게임 방법</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p className="text-center">
                글자의 <strong className="text-gray-800">'뜻'</strong>이 아니라{' '}
                <strong style={{ color: CORAL.primary }}>'색깔'</strong>을 누르세요!
              </p>
              <div className="bg-white rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-2">예시</p>
                <span className="text-4xl font-bold" style={{ color: '#3B82F6' }}>
                  빨강
                </span>
                <p className="text-xs text-gray-500 mt-2">
                  정답: <strong className="text-blue-500">파랑</strong> (글자 색깔)
                </p>
              </div>
            </div>

            {/* 키보드 힌트 */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center mb-2">키보드 단축키</p>
              <div className="flex justify-center gap-2">
                {COLORS.map((color) => (
                  <div
                    key={color.id}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold"
                    style={{
                      backgroundColor: color.hex,
                      color: color.id === 'yellow' ? '#1F2937' : '#FFFFFF',
                    }}
                  >
                    {color.key}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 제한 시간 안내 */}
          <p className="text-sm text-gray-500 mb-6">
            제한 시간: <strong className="text-gray-800">{gameDuration}초</strong>
          </p>

          {/* 시작 버튼 */}
          <button
            onClick={handleStartGame}
            className="px-8 py-4 rounded-2xl text-white text-lg font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg"
            style={{ backgroundColor: CORAL.primary }}
          >
            게임 시작
          </button>
          <p className="text-xs text-gray-400 mt-2">또는 스페이스바를 누르세요</p>
        </div>
      )}

      {/* 게임 플레이 */}
      {gameState === 'playing' && question && (
        <div className="w-full">
          {/* HUD */}
          <div className="flex items-center justify-between mb-4 px-2">
            {/* 점수 */}
            <div className="text-left">
              <p className="text-xs text-gray-500">점수</p>
              <p className="text-2xl font-bold text-gray-800">{score.toLocaleString()}</p>
            </div>

            {/* 타이머 */}
            <div className="flex-1 mx-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-lg font-bold text-gray-800">{timeLeft}</span>
                <span className="text-xs text-gray-500">초</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-1000 ease-linear rounded-full"
                  style={{
                    width: `${timerProgress}%`,
                    backgroundColor: timeLeft <= 10 ? '#EF4444' : CORAL.primary,
                  }}
                />
              </div>
            </div>

            {/* 스트릭 */}
            <div className="text-right">
              <p className="text-xs text-gray-500">연속</p>
              <div className="flex items-center justify-end gap-1">
                {streak >= 3 && <Flame className="w-5 h-5 text-orange-500" />}
                <span className="text-2xl font-bold text-gray-800">{streak}</span>
              </div>
            </div>
          </div>

          {/* 안내 문구 */}
          <div
            className="mb-4 py-2 px-4 rounded-xl text-center text-sm font-medium"
            style={{ backgroundColor: CORAL.light, color: CORAL.primary }}
          >
            글자의 '색깔'을 누르세요!
          </div>

          {/* 메인 스테이지 */}
          <div
            className={`
              relative bg-white rounded-2xl shadow-lg border-2 border-gray-100
              flex items-center justify-center min-h-[200px] mb-6
              transition-all duration-100
              ${feedback === 'wrong' ? 'animate-shake bg-red-50 border-red-300' : ''}
            `}
          >
            <span
              className="text-7xl sm:text-8xl md:text-9xl font-black select-none"
              style={{ color: question.inkHex }}
            >
              {question.wordLabel}
            </span>
          </div>

          {/* 색상 버튼 그리드 */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {COLORS.map((color) => (
              <ColorButton
                key={color.id}
                color={color}
                onClick={() => submitAnswer(color.id)}
                disabled={!!feedback}
              />
            ))}
          </div>
        </div>
      )}

      {/* 게임 오버 화면 */}
      {gameState === 'game-over' && (
        <div className="flex flex-col items-center py-6 w-full">
          {/* 티어 배지 */}
          {scoreResult ? (
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mb-4 shadow-lg"
              style={{
                backgroundColor: scoreResult.tier.color + '20',
                borderColor: scoreResult.tier.color,
                borderWidth: 3,
              }}
            >
              <span className="text-5xl">{getTierEmoji(scoreResult.tier.grade)}</span>
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4 shadow-lg">
              <span className="text-5xl">⏱️</span>
            </div>
          )}

          {/* 결과 텍스트 */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">시간 종료!</h2>

          {/* 티어 표시 */}
          {scoreResult && (
            <div className="flex items-center gap-2 mb-4">
              <span
                className="px-3 py-1 rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: scoreResult.tier.color }}
              >
                {scoreResult.tier.grade} 등급
              </span>
              <span className="text-sm text-gray-500">{scoreResult.tier.percentile}</span>
            </div>
          )}

          {/* 점수 */}
          <div className="text-center mb-4">
            <p className="text-gray-600">
              최종 점수:{' '}
              <span className="font-bold text-3xl" style={{ color: CORAL.primary }}>
                {score.toLocaleString()}
              </span>
              점
            </p>
            {scoreResult && (
              <p className="text-lg font-bold text-indigo-600 mt-1">
                +{scoreResult.score.toLocaleString()}점
              </p>
            )}
          </div>

          {/* 통계 */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6 w-full max-w-xs">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.correct}</p>
                <p className="text-xs text-gray-500">정답</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-500">{stats.incorrect}</p>
                <p className="text-xs text-gray-500">오답</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{accuracy}%</p>
                <p className="text-xs text-gray-500">정확도</p>
              </div>
            </div>
          </div>

          {/* 피드백 */}
          {scoreResult && (
            <div className="bg-gray-50 px-4 py-2 rounded-xl mb-6 max-w-xs">
              <p className="text-sm text-gray-700 text-center">{scoreResult.feedback}</p>
            </div>
          )}

          {/* 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleStartGame}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: CORAL.primary }}
            >
              <RotateCcw className="w-5 h-5" />
              다시 도전
            </button>
            <Link
              to="/games"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold transition-all hover:bg-gray-200"
            >
              <Home className="w-5 h-5" />
              게임 목록
            </Link>
          </div>
        </div>
      )}

      {/* shake 애니메이션 */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
}
