/**
 * 20개 이미지 기억 게임 (20 Random Images)
 * 연상 기억력 훈련 게임
 *
 * - Sparse Grid (8x8 = 64 슬롯) + Jittering 방식
 * - 회상 단계: 35개 카드 (정답 20 + 오답 15) 중 즉시 피드백
 * - 정답 20개를 모두 찾으면 게임 종료
 */

import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useImageMemoryLogic } from './useImageMemoryLogic';
import { MemorizeBoard } from './MemorizeBoard';
import { RecallBoard } from './RecallBoard';
import { useGameStore } from '../../store/useGameStore';
import { calculateGameScore, getTierEmoji, getNextTierRequirement } from '../../utils/scoringUtils';

/**
 * 밀리초를 초 단위 문자열로 변환
 */
function formatSeconds(ms: number): string {
  return (ms / 1000).toFixed(1);
}

export default function RandomImages() {
  const {
    gameState,
    gridData,
    targetSequence,
    recallCards,
    foundEmojis,
    correctCount,
    errorCount,
    lastErrorEmoji,
    elapsedTime,
    memorizeTime,
    countdownValue,
    totalTargets,
    startGame,
    finishMemorizing,
    handleCardClick,
    resetGame,
  } = useImageMemoryLogic();

  const { setCurrentGame, startGame: storeStartGame, finishGame } = useGameStore();

  // 점수 계산 (벤치마크 기반 - 암기 시간)
  const scoreResult = useMemo(() => {
    if (gameState !== 'finished') return null;
    const seconds = memorizeTime / 1000;
    return calculateGameScore('random-images', seconds);
  }, [gameState, memorizeTime]);

  // 다음 티어까지 필요한 시간
  const nextTierInfo = useMemo(() => {
    if (gameState !== 'finished') return null;
    const seconds = memorizeTime / 1000;
    return getNextTierRequirement('random-images', seconds);
  }, [gameState, memorizeTime]);

  // 게임 완료 시 점수 저장
  useEffect(() => {
    if (gameState === 'finished' && scoreResult) {
      finishGame(scoreResult.score);
    }
  }, [gameState, scoreResult, finishGame]);

  // 게임 시작 핸들러
  const handleStartGame = () => {
    setCurrentGame('random-images'); // 세션 먼저 설정
    startGame();
    storeStartGame();
  };

  return (
    <div className="flex flex-col items-center py-4">
      {/* 게임 타이틀 */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">이미지 연상</h2>
        <p className="text-sm text-gray-500">20개 이모지 위치와 순서 기억하기</p>
      </div>

      {/* 대기 화면 */}
      {gameState === 'ready' && (
        <div className="flex flex-col items-center gap-6 py-8 max-w-md">
          {/* 게임 설명 */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 text-center">
            <h3 className="font-bold text-indigo-800 mb-3">게임 방법</h3>
            <p className="text-sm text-indigo-700 mb-4">
              20개의 이모지가 화면 곳곳에 흩어져 나타납니다.
              <br />
              <strong className="text-indigo-600">번호 순서</strong>와{' '}
              <strong className="text-indigo-600">위치</strong>를 함께 기억하세요!
            </p>
            <div className="bg-white/50 rounded-xl p-3">
              <p className="text-xs text-indigo-600">
                💡 <strong>연상 기억술</strong>: 이모지들로 이야기를 만들면 더 잘 외워져요!
              </p>
            </div>
          </div>

          {/* 예시 미리보기 */}
          <div className="grid grid-cols-4 gap-2 opacity-40">
            {['🐶', '🍎', null, '⚽', null, '🌸', '🐱', null].map((emoji, i) =>
              emoji ? (
                <div
                  key={i}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg relative"
                  style={{ transform: `rotate(${Math.random() * 10 - 5}deg)` }}
                >
                  <span className="text-xl">{emoji}</span>
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-400 text-white text-[8px] rounded-full flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
              ) : (
                <div key={i} className="w-10 h-10" />
              )
            )}
          </div>

          {/* 시작 버튼 */}
          <button
            onClick={handleStartGame}
            className="px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-2xl hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-200"
          >
            게임 시작
          </button>
        </div>
      )}

      {/* 기억 단계 */}
      {gameState === 'memorizing' && (
        <MemorizeBoard
          gridData={gridData}
          elapsedTime={elapsedTime}
          onFinish={finishMemorizing}
        />
      )}

      {/* 카운트다운 */}
      {gameState === 'countdown' && (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-gray-600 mb-4">이제 기억한 이모지를 찾아주세요!</p>
          <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-300 animate-pulse">
            <span className="text-6xl font-bold text-white">{countdownValue}</span>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            암기 시간: {formatSeconds(memorizeTime)}초
          </p>
        </div>
      )}

      {/* 회상 단계 */}
      {gameState === 'recalling' && (
        <RecallBoard
          recallCards={recallCards}
          foundEmojis={foundEmojis}
          correctCount={correctCount}
          errorCount={errorCount}
          lastErrorEmoji={lastErrorEmoji}
          totalTargets={totalTargets}
          onCardClick={handleCardClick}
        />
      )}

      {/* 결과 화면 */}
      {gameState === 'finished' && scoreResult && (
        <div className="flex flex-col items-center gap-6 py-6 max-w-md">
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
            <p className="text-lg text-gray-600">
              <strong className="text-indigo-600">{formatSeconds(memorizeTime)}초</strong> 만에
              <br />
              <strong className="text-3xl text-emerald-600">{correctCount}</strong>
              <span className="text-gray-500"> / {totalTargets}개</span> 성공!
              {errorCount > 0 && (
                <span className="block text-sm text-red-500 mt-1">
                  (오답 {errorCount}회)
                </span>
              )}
            </p>
          </div>

          {/* 피드백 메시지 */}
          <div className="bg-gray-50 px-5 py-3 rounded-xl max-w-sm">
            <p className="text-sm text-gray-700 text-center">{scoreResult.feedback}</p>
          </div>

          {/* 상세 결과 통계 */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
            <div className="bg-emerald-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">{correctCount}</p>
              <p className="text-xs text-emerald-700">정답</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-red-500">{errorCount}</p>
              <p className="text-xs text-red-600">오답</p>
            </div>
            <div className="bg-indigo-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-indigo-600">{formatSeconds(memorizeTime)}s</p>
              <p className="text-xs text-indigo-700">암기 시간</p>
            </div>
          </div>

          {/* 다음 티어 안내 */}
          {nextTierInfo && (
            <div className="text-center text-sm text-gray-500">
              <span className="font-medium text-indigo-600">{nextTierInfo.nextGrade}</span> 등급까지{' '}
              <span className="font-bold">{nextTierInfo.difference.toFixed(0)}초</span> 더 빨라지면 도달!
            </div>
          )}

          {/* 정답 순서 보기 */}
          <div className="w-full bg-gray-50 rounded-2xl p-4">
            <p className="text-sm text-gray-500 text-center mb-3">정답 순서</p>
            <div className="grid grid-cols-10 gap-1">
              {targetSequence.map((item, index) => (
                <div
                  key={index}
                  className="aspect-square flex items-center justify-center rounded-lg text-lg bg-white border border-gray-200"
                  title={`${index + 1}번`}
                >
                  {item.emoji}
                </div>
              ))}
            </div>
          </div>

          {/* 획득 점수 */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 rounded-2xl border border-indigo-100">
            <p className="text-sm text-gray-500 text-center mb-1">획득 점수</p>
            <p className="text-3xl font-bold text-indigo-600 text-center">
              +{scoreResult.score.toLocaleString()}점
            </p>
          </div>

          {/* 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={() => {
                resetGame();
                handleStartGame();
              }}
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
