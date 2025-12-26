/**
 * Memory Flash Game
 * 순간 기억력 훈련 게임
 *
 * - 화면에 잠깐 나타나는 글자들을 기억
 * - 각 글자가 몇 개였는지 맞추기
 * - 레벨별 난이도 설정
 */

import { useEffect, useMemo } from 'react';
import { Zap, Minus, Plus } from 'lucide-react';
import { useMemoryFlashLogic } from './useMemoryFlashLogic';
import { SettingsPanel } from './SettingsPanel';
import { ResultView } from './ResultView';
import { GRID_WIDTH_MAP } from './levelData';
import { useGameStore } from '../../store/useGameStore';
import { calculateGameScore } from '../../utils/scoringUtils';

// Coral 테마 색상
const CORAL = {
  primary: '#E87C63',
  light: '#FEF2F0',
};

export default function MemoryFlash() {
  const {
    selectedLevel,
    gameState,
    letters,
    userAnswers,
    result,
    countdown,
    config,
    selectLevel,
    startFlash,
    updateAnswer,
    submitAnswers,
    retryLevel,
    goToLevelSelect,
    nextLevel,
  } = useMemoryFlashLogic();

  const { setCurrentGame, startGame: storeStartGame, finishGame } = useGameStore();

  // 점수 계산
  const scoreResult = useMemo(() => {
    if (!result) return null;
    // 레벨 기반 점수 - 성공 시에만 점수 획득
    if (result.isCorrect) {
      return calculateGameScore('memory-flash', result.level * 3); // 레벨 * 3을 개수로 변환
    }
    return null;
  }, [result]);

  // 결과 시 점수 저장
  useEffect(() => {
    if (result && result.isCorrect && scoreResult) {
      finishGame(scoreResult.score);
    }
  }, [result, scoreResult, finishGame]);

  // 게임 시작 핸들러
  const handleStartGame = () => {
    setCurrentGame('memory-flash');
    storeStartGame();
    startFlash();
  };

  return (
    <div className="flex flex-col items-center">
      {/* 게임 타이틀 */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="w-6 h-6" style={{ color: CORAL.primary }} />
          <h2 className="text-2xl font-bold text-gray-800">메모리 플래시</h2>
        </div>
        <p className="text-sm text-gray-500">순간 기억력 훈련</p>
      </div>

      {/* 레벨 선택 화면 */}
      {gameState === 'selecting' && (
        <SettingsPanel
          selectedLevel={selectedLevel}
          onSelectLevel={selectLevel}
          onStart={handleStartGame}
        />
      )}

      {/* 준비 상태 (카운트다운) */}
      {gameState === 'ready' && countdown !== null && (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-gray-600 mb-4">곧 글자가 나타납니다!</p>
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center shadow-lg animate-pulse"
            style={{ backgroundColor: CORAL.light }}
          >
            <span className="text-6xl font-bold" style={{ color: CORAL.primary }}>
              {countdown}
            </span>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            Level {selectedLevel} - {config.flashDuration}초 동안 표시
          </p>
        </div>
      )}

      {/* 플래시 화면 */}
      {gameState === 'flashing' && (
        <div className="flex flex-col items-center">
          <div
            className="relative bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden"
            style={{
              width: GRID_WIDTH_MAP[config.gridWidth],
              height: GRID_WIDTH_MAP[config.gridWidth],
            }}
          >
            {letters.map((letter, index) => (
              <span
                key={index}
                className="absolute text-4xl font-bold text-gray-800 select-none"
                style={{
                  left: `${letter.x}%`,
                  top: `${letter.y}%`,
                  transform: `translate(-50%, -50%) rotate(${letter.rotation}deg)`,
                }}
              >
                {letter.char}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-500">기억하세요!</p>
        </div>
      )}

      {/* 답변 입력 화면 */}
      {gameState === 'answering' && (
        <div className="flex flex-col items-center w-full max-w-md">
          <div className="bg-gray-50 rounded-2xl p-6 w-full mb-6">
            <h3 className="font-bold text-gray-800 mb-4 text-center">
              각 글자가 몇 개였나요?
            </h3>

            <div className="space-y-4">
              {config.letterTypes.map((char) => (
                <div
                  key={char}
                  className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm"
                >
                  {/* 글자 */}
                  <span className="text-3xl font-bold text-gray-800">{char}</span>

                  {/* 카운터 */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateAnswer(char, (userAnswers[char] || 0) - 1)}
                      className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <Minus className="w-5 h-5 text-gray-600" />
                    </button>
                    <span className="text-2xl font-bold text-gray-800 w-8 text-center">
                      {userAnswers[char] || 0}
                    </span>
                    <button
                      onClick={() => updateAnswer(char, (userAnswers[char] || 0) + 1)}
                      className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: CORAL.primary }}
                    >
                      <Plus className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 제출 버튼 */}
          <button
            onClick={submitAnswers}
            className="w-full py-4 rounded-2xl text-white text-lg font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg"
            style={{ backgroundColor: CORAL.primary }}
          >
            정답 확인
          </button>
        </div>
      )}

      {/* 결과 화면 */}
      {gameState === 'result' && result && (
        <ResultView
          result={result}
          onRetry={retryLevel}
          onNextLevel={nextLevel}
          onLevelSelect={goToLevelSelect}
        />
      )}
    </div>
  );
}
