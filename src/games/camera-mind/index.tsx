/**
 * Camera Mind Game
 * 시각적 작업 기억력 훈련 게임
 *
 * - 화면에 원들이 하나씩 추가됨
 * - 가장 마지막에 추가된 원을 클릭해야 함
 * - 틀리면 게임 오버
 */

import { useEffect, useMemo } from 'react';
import { useCameraMindLogic } from './useCameraMindLogic';
import { GameCanvas } from './GameCanvas';
import { IntroScreen, LevelTransition, GameOverScreen } from './OverlayScreens';
import { useGameStore } from '../../store/useGameStore';
import { calculateGameScore } from '../../utils/scoringUtils';

// Coral 테마 색상
const CORAL = {
  primary: '#E87C63',
  light: '#FEF2F0',
};

export default function CameraMind() {
  const {
    gameState,
    level,
    circles,
    startGame,
    startLevel,
    handleCircleClick,
  } = useCameraMindLogic();

  const { setCurrentGame, startGame: storeStartGame, finishGame } = useGameStore();

  // 최종 레벨 (게임 오버 시 마지막으로 성공한 레벨)
  const finalLevel = useMemo(() => Math.max(1, level - 1), [level]);

  // 점수 계산
  const scoreResult = useMemo(() => {
    if (gameState !== 'game-over') return null;
    return calculateGameScore('camera-mind', finalLevel);
  }, [gameState, finalLevel]);

  // 게임 오버 시 점수 저장
  useEffect(() => {
    if (gameState === 'game-over' && scoreResult) {
      finishGame(scoreResult.score);
    }
  }, [gameState, scoreResult, finishGame]);

  // 게임 시작 핸들러
  const handleStartGame = () => {
    setCurrentGame('camera-mind');
    storeStartGame();
    startGame();
  };

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto">
      {/* 게임 타이틀 */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Camera Mind</h2>
        <p className="text-sm text-gray-500">시각적 작업 기억력 훈련</p>
      </div>

      {/* 인트로 화면 */}
      {gameState === 'intro' && <IntroScreen onStart={handleStartGame} />}

      {/* 게임 플레이 영역 */}
      {(gameState === 'playing' || gameState === 'level-transition' || gameState === 'game-over') && (
        <div className="w-full relative">
          {/* 레벨 표시 */}
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Level</span>
              <span
                className="text-2xl font-bold"
                style={{ color: CORAL.primary }}
              >
                {level}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">원 개수</span>
              <span className="text-lg font-semibold text-gray-800">
                {circles.length}
              </span>
            </div>
          </div>

          {/* 안내 문구 */}
          {gameState === 'playing' && (
            <div
              className="mb-4 py-2 px-4 rounded-xl text-center text-sm font-medium"
              style={{ backgroundColor: CORAL.light, color: CORAL.primary }}
            >
              가장 마지막에 생겨난 원을 클릭하세요!
            </div>
          )}

          {/* 게임 캔버스 */}
          <GameCanvas
            circles={circles}
            onCircleClick={handleCircleClick}
          />

          {/* 레벨 전환 오버레이 */}
          {gameState === 'level-transition' && (
            <LevelTransition level={level} onComplete={startLevel} />
          )}

          {/* 게임 오버 오버레이 */}
          {gameState === 'game-over' && (
            <GameOverScreen level={level} onRestart={handleStartGame} scoreResult={scoreResult} />
          )}
        </div>
      )}
    </div>
  );
}
