/**
 * 듀얼 엔백 (Dual N-Back) 게임
 * 작업 기억력(Working Memory) 훈련 게임
 *
 * - 시각(위치)과 청각(소리) 자극을 동시에 기억
 * - N단계 전 자극과 일치하면 버튼을 누름
 * - 키보드: A = 위치 일치, L = 소리 일치
 */

import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDualNBackLogic } from './useDualNBackLogic';
import { GridBoard } from './GridBoard';
import { ControlPanel } from './ControlPanel';
import { useGameStore } from '../../store/useGameStore';
import { calculateGameScore, getTierEmoji, getNextTierRequirement } from '../../utils/scoringUtils';

export default function DualNBack() {
  const [showInstructions, setShowInstructions] = useState(true);

  const {
    level,
    currentTrialIndex,
    status,
    activePosition,
    positionFeedback,
    soundFeedback,
    score,
    totalTrials,
    setLevel,
    startGame,
    handlePositionMatch,
    handleSoundMatch,
    resetGame,
  } = useDualNBackLogic(2);

  const { setCurrentGame, startGame: storeStartGame, finishGame } = useGameStore();

  // 점수 계산 (레벨 기반 벤치마크)
  const scoreResult = useMemo(() => {
    if (status !== 'finished') return null;
    return calculateGameScore('dual-n-back', level);
  }, [status, level]);

  // 다음 티어까지 필요한 레벨
  const nextTierInfo = useMemo(() => {
    if (status !== 'finished') return null;
    return getNextTierRequirement('dual-n-back', level);
  }, [status, level]);

  // 정확도 계산
  const accuracy = useMemo(() => {
    const total = score.correct + score.wrong + score.missed;
    if (total === 0) return 0;
    return Math.round((score.correct / total) * 100);
  }, [score]);

  // 키보드 이벤트 핸들러
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== 'stimulus' && status !== 'waiting') return;

      if (e.key.toLowerCase() === 'a') {
        e.preventDefault();
        handlePositionMatch();
      } else if (e.key.toLowerCase() === 'l') {
        e.preventDefault();
        handleSoundMatch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, handlePositionMatch, handleSoundMatch]);

  // 게임 완료 시 점수 저장
  useEffect(() => {
    if (status === 'finished' && scoreResult) {
      finishGame(scoreResult.score);
    }
  }, [status, scoreResult, finishGame]);

  // 게임 시작 핸들러
  const handleStartGame = () => {
    setCurrentGame('dual-n-back'); // 세션 먼저 설정
    setShowInstructions(false);
    startGame();
    storeStartGame();
  };

  // 다시 도전 핸들러
  const handleRetry = () => {
    resetGame();
    setShowInstructions(true);
  };

  // 레벨 변경 핸들러
  const handleLevelChange = (newLevel: number) => {
    setLevel(newLevel);
  };

  const isPlaying = status === 'stimulus' || status === 'waiting';

  return (
    <div className="flex flex-col items-center">
      {/* 게임 타이틀 */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">듀얼 엔백</h2>
        <p className="text-sm text-gray-500">작업 기억력 훈련</p>
      </div>

      {/* 설명 및 대기 화면 */}
      {showInstructions && status === 'ready' && (
        <div className="flex flex-col items-center gap-6 py-4 max-w-md">
          {/* 게임 설명 */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 text-center">
            <h3 className="font-bold text-indigo-800 mb-3">게임 방법</h3>
            <p className="text-sm text-indigo-700 mb-4">
              지금 나오는 <strong>사각형 위치</strong>나{' '}
              <strong>알파벳 소리</strong>가{' '}
              <strong className="text-indigo-600">{level}단계 전</strong>과
              똑같다면 버튼을 누르세요!
            </p>
            <div className="flex justify-center gap-4 text-xs">
              <div className="bg-indigo-100 px-3 py-2 rounded-lg">
                <span className="font-bold">위치 일치</span>
                <span className="block text-indigo-600 mt-1">A 키</span>
              </div>
              <div className="bg-purple-100 px-3 py-2 rounded-lg">
                <span className="font-bold">소리 일치</span>
                <span className="block text-purple-600 mt-1">L 키</span>
              </div>
            </div>
          </div>

          {/* 레벨 선택 */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">N-Back 레벨:</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => handleLevelChange(n)}
                  className={`
                    w-10 h-10 rounded-lg font-bold transition-all
                    ${
                      level === n
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* 미리보기 그리드 */}
          <div className="opacity-40">
            <GridBoard activePosition={null} positionFeedback="none" />
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

      {/* 게임 진행 중 */}
      {(status === 'playing' || isPlaying) && (
        <div className="flex flex-col items-center gap-6 w-full">
          {/* 상태 표시 바 */}
          <div className="flex items-center justify-between w-full max-w-md px-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">N-Back:</span>
              <span className="text-lg font-bold text-indigo-600">{level}단계</span>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-500">진행: </span>
              <span className="text-lg font-bold text-gray-800">
                {currentTrialIndex + 1}/{totalTrials}
              </span>
            </div>
          </div>

          {/* 진행률 바 */}
          <div className="w-full max-w-md h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
              style={{ width: `${((currentTrialIndex + 1) / totalTrials) * 100}%` }}
            />
          </div>

          {/* 실시간 점수 */}
          <div className="flex gap-4 text-sm">
            <span className="text-emerald-600">
              정답: <strong>{score.correct}</strong>
            </span>
            <span className="text-red-500">
              오답: <strong>{score.wrong}</strong>
            </span>
            <span className="text-gray-400">
              놓침: <strong>{score.missed}</strong>
            </span>
          </div>

          {/* 그리드 */}
          <GridBoard
            activePosition={activePosition}
            positionFeedback={positionFeedback}
          />

          {/* 컨트롤 패널 */}
          <ControlPanel
            onPositionMatch={handlePositionMatch}
            onSoundMatch={handleSoundMatch}
            positionFeedback={positionFeedback}
            soundFeedback={soundFeedback}
            disabled={!isPlaying}
          />
        </div>
      )}

      {/* 게임 완료 */}
      {status === 'finished' && scoreResult && (
        <div className="flex flex-col items-center gap-6 py-6">
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
            <p className="text-gray-500">N-Back {level}단계 도전 결과</p>
          </div>

          {/* 피드백 메시지 */}
          <div className="bg-gray-50 px-5 py-3 rounded-xl max-w-sm">
            <p className="text-sm text-gray-700 text-center">{scoreResult.feedback}</p>
          </div>

          {/* 결과 통계 */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
            <div className="bg-emerald-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">{score.correct}</p>
              <p className="text-xs text-emerald-700">정답</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-red-500">{score.wrong}</p>
              <p className="text-xs text-red-600">오답</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-500">{score.missed}</p>
              <p className="text-xs text-gray-600">놓침</p>
            </div>
          </div>

          {/* 정확도 */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">정확도</p>
            <p className="text-3xl font-bold text-indigo-600">{accuracy}%</p>
          </div>

          {/* 다음 티어 안내 */}
          {nextTierInfo && (
            <div className="text-center text-sm text-gray-500">
              <span className="font-medium text-indigo-600">{nextTierInfo.nextGrade}</span> 등급까지{' '}
              <span className="font-bold">레벨 {nextTierInfo.required}</span> 도전!
            </div>
          )}

          {/* 획득 점수 */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 rounded-2xl border border-indigo-100">
            <p className="text-sm text-gray-500 text-center mb-1">획득 점수</p>
            <p className="text-3xl font-bold text-indigo-600 text-center">
              +{scoreResult.score.toLocaleString()}점
            </p>
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
