/**
 * Schulte Table Level 2
 * 주변시야 훈련 게임 - 좌/우 분할 버전
 *
 * 중앙의 빨간 점에 집중하면서 1-24 숫자를 순서대로 찾습니다.
 * 레벨이 올라갈수록 폰트가 작아지고 좌우 간격이 넓어져서
 * 더 넓은 주변시야가 필요합니다.
 */

import { useSchulteLv2Logic } from './useSchulteLv2Logic';
import { ControlBar } from './components/ControlBar';
import { SplitBoard } from './components/SplitBoard';
import { ResultModal } from './components/ResultModal';
import { formatTime } from './scoringUtils';
import { TOTAL_NUMBERS } from './levelData';

export default function SchulteLv2() {
  const {
    level,
    gameState,
    nextNumber,
    elapsedTime,
    leftNumbers,
    rightNumbers,
    cellFeedbacks,
    result,
    levelConfig,
    setLevel,
    startGame,
    handleNumberClick,
    resetGame,
  } = useSchulteLv2Logic();

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      {/* 게임 타이틀 */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          슐테 테이블 Lv.2
        </h2>
        <p className="text-sm text-gray-500">주변시야 확장 훈련</p>
      </div>

      {/* 대기 화면 */}
      {gameState === 'ready' && (
        <div className="flex flex-col items-center gap-6 w-full py-6">
          {/* 레벨 선택 */}
          <ControlBar
            currentLevel={level}
            onLevelChange={setLevel}
            disabled={false}
          />

          {/* 게임 설명 */}
          <div className="text-center max-w-md px-4">
            <p className="text-gray-600 mb-2">
              <span className="font-bold text-[#E87C63]">중앙의 빨간 점</span>에
              집중하면서
            </p>
            <p className="text-gray-600">
              주변시야로 <span className="font-bold">1~24</span>를 순서대로
              찾으세요!
            </p>
          </div>

          {/* 시작 버튼 */}
          <button
            onClick={startGame}
            className="px-10 py-4 bg-[#E87C63] text-white text-lg font-semibold rounded-2xl hover:bg-[#D66B53] active:scale-95 transition-all shadow-lg shadow-[#E87C63]/30"
          >
            게임 시작
          </button>

          {/* 레벨별 팁 */}
          <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200 max-w-md">
            <p className="text-sm text-amber-800">
              <span className="font-bold">💡 팁:</span> 눈은 중앙 점에 고정하고,
              주변시야로 숫자를 인식하세요. 레벨이 높을수록 더 넓은 시야가
              필요합니다.
            </p>
          </div>
        </div>
      )}

      {/* 게임 진행 중 */}
      {gameState === 'playing' && (
        <div className="flex flex-col items-center gap-4 w-full">
          {/* 상태 표시 바 */}
          <div className="flex items-center justify-between w-full max-w-lg px-4">
            {/* 찾아야 할 숫자 */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">다음 숫자:</span>
              <span className="text-3xl font-bold text-[#E87C63]">
                {nextNumber}
              </span>
            </div>

            {/* 레벨 */}
            <div className="text-center">
              <span className="px-3 py-1 bg-[#FEF2F0] text-[#E87C63] text-sm font-bold rounded-full">
                Lv.{level}
              </span>
            </div>

            {/* 타이머 */}
            <div className="text-right">
              <span className="text-2xl font-mono font-bold text-gray-800">
                {formatTime(elapsedTime)}
              </span>
              <span className="text-gray-500 text-sm ml-1">초</span>
            </div>
          </div>

          {/* 진행률 바 */}
          <div className="w-full max-w-lg h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#E87C63] to-orange-400 transition-all duration-150"
              style={{ width: `${((nextNumber - 1) / TOTAL_NUMBERS) * 100}%` }}
            />
          </div>

          {/* 게임 보드 */}
          <div className="w-full py-6 overflow-x-auto">
            <SplitBoard
              leftNumbers={leftNumbers}
              rightNumbers={rightNumbers}
              cellFeedbacks={cellFeedbacks}
              levelConfig={levelConfig}
              onNumberClick={handleNumberClick}
              disabled={false}
            />
          </div>

          {/* 종료 버튼 */}
          <button
            onClick={resetGame}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            포기하고 돌아가기
          </button>
        </div>
      )}

      {/* 게임 완료 */}
      {gameState === 'finished' && result && (
        <ResultModal
          result={result}
          elapsedTime={elapsedTime}
          onRetry={resetGame}
        />
      )}
    </div>
  );
}
