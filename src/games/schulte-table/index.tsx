/**
 * 슐테 테이블 (Schulte Table) 게임
 * 집중력 & 시야 확장 훈련 게임
 *
 * - 5x5 그리드에 무작위로 흩어진 1~25 숫자를 순서대로 클릭
 * - 가능한 빠르게 완료하는 것이 목표
 */

import { Link } from 'react-router-dom';
import { useSchulteLogic } from './useSchulteLogic';
import { SchulteGrid } from './SchulteGrid';
import { useGameStore } from '../../store/useGameStore';
import { useEffect, useMemo } from 'react';
import { calculateGameScore, getTierEmoji, getNextTierRequirement } from '../../utils/scoringUtils';

/**
 * 밀리초를 "00.00초" 형식으로 변환
 */
function formatTime(ms: number): string {
  const seconds = ms / 1000;
  return seconds.toFixed(2);
}

export default function SchulteTable() {
  const {
    numbers,
    nextNum,
    status,
    elapsedTime,
    cellFeedbacks,
    startGame,
    handleCellClick,
    resetGame,
  } = useSchulteLogic(5);

  const { setCurrentGame, startGame: storeStartGame, finishGame } = useGameStore();

  // 점수 계산 (벤치마크 기반)
  const scoreResult = useMemo(() => {
    if (status !== 'finished') return null;
    const seconds = elapsedTime / 1000;
    return calculateGameScore('schulte-table-l1', seconds);
  }, [status, elapsedTime]);

  // 다음 티어까지 필요한 수치
  const nextTierInfo = useMemo(() => {
    if (status !== 'finished') return null;
    const seconds = elapsedTime / 1000;
    return getNextTierRequirement('schulte-table-l1', seconds);
  }, [status, elapsedTime]);

  // 게임 시작 핸들러
  const handleStartGame = () => {
    setCurrentGame('schulte-table-l1'); // 세션 먼저 설정
    startGame();
    storeStartGame();
  };

  // 게임 완료 시 점수 저장
  useEffect(() => {
    if (status === 'finished' && scoreResult) {
      finishGame(scoreResult.score);
    }
  }, [status, scoreResult, finishGame]);

  // 다시 도전 핸들러
  const handleRetry = () => {
    resetGame();
  };

  return (
    <div className="flex flex-col items-center">
      {/* 게임 타이틀 */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">슐테 테이블</h2>
        <p className="text-sm text-gray-500">집중력 & 시야 확장 훈련</p>
      </div>

      {/* 대기 화면 */}
      {status === 'ready' && (
        <div className="flex flex-col items-center gap-6 py-8">
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-2">준비되셨나요?</p>
            <p className="text-gray-500">
              1부터 25까지 순서대로 빠르게 누르세요!
            </p>
          </div>

          {/* 미리보기 그리드 (흐리게) */}
          <div className="opacity-40 pointer-events-none">
            <SchulteGrid
              numbers={numbers}
              nextNum={1}
              cellFeedbacks={{}}
              onCellClick={() => {}}
              disabled
            />
          </div>

          <button
            onClick={handleStartGame}
            className="px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-2xl hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-200"
          >
            게임 시작
          </button>
        </div>
      )}

      {/* 게임 진행 중 */}
      {status === 'playing' && (
        <div className="flex flex-col items-center gap-4 w-full">
          {/* 상태 표시 바 */}
          <div className="flex items-center justify-between w-full max-w-md px-2">
            {/* 찾아야 할 숫자 */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">찾아야 할 숫자:</span>
              <span className="text-2xl font-bold text-indigo-600">{nextNum}</span>
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
          <div className="w-full max-w-md h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-150"
              style={{ width: `${((nextNum - 1) / 25) * 100}%` }}
            />
          </div>

          {/* 그리드 */}
          <div className="py-4">
            <SchulteGrid
              numbers={numbers}
              nextNum={nextNum}
              cellFeedbacks={cellFeedbacks}
              onCellClick={handleCellClick}
            />
          </div>
        </div>
      )}

      {/* 게임 완료 */}
      {status === 'finished' && scoreResult && (
        <div className="flex flex-col items-center gap-6 py-8">
          {/* 티어 배지 */}
          <div className="text-center">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
              style={{ backgroundColor: scoreResult.tier.color + '20', borderColor: scoreResult.tier.color, borderWidth: 3 }}
            >
              <span className="text-5xl">{getTierEmoji(scoreResult.tier.grade)}</span>
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span
                className="px-3 py-1 rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: scoreResult.tier.color }}
              >
                {scoreResult.tier.grade} 등급
              </span>
              <span className="text-sm text-gray-500">{scoreResult.tier.percentile}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{scoreResult.tier.name}</h3>
            <p className="text-gray-600">
              기록:{' '}
              <span className="text-2xl font-bold text-indigo-600">
                {formatTime(elapsedTime)}
              </span>
              초
            </p>
          </div>

          {/* 피드백 메시지 */}
          <div className="bg-gray-50 px-5 py-3 rounded-xl max-w-sm">
            <p className="text-sm text-gray-700 text-center">{scoreResult.feedback}</p>
          </div>

          {/* 다음 티어 안내 */}
          {nextTierInfo && (
            <div className="text-center text-sm text-gray-500">
              <span className="font-medium text-indigo-600">{nextTierInfo.nextGrade}</span> 등급까지{' '}
              <span className="font-bold">{nextTierInfo.difference.toFixed(1)}초</span> 더 빨라지면 도달!
            </div>
          )}

          {/* 점수 표시 */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 rounded-2xl border border-indigo-100">
            <p className="text-sm text-gray-500 text-center mb-1">획득 점수</p>
            <p className="text-3xl font-bold text-indigo-600 text-center">
              +{scoreResult.score.toLocaleString()}점
            </p>
          </div>

          {/* 완료된 그리드 (비활성화) */}
          <div className="opacity-60 pointer-events-none">
            <SchulteGrid
              numbers={numbers}
              nextNum={26}
              cellFeedbacks={{}}
              onCellClick={() => {}}
              disabled
            />
          </div>

          {/* 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <button
              onClick={handleRetry}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 active:scale-95 transition-all"
            >
              다시 도전하기
            </button>
            <Link
              to="/"
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 active:scale-95 transition-all text-center"
            >
              메인으로 나가기
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
