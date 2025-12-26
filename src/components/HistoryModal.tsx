/**
 * HistoryModal.tsx
 * 점수 획득 히스토리를 보여주는 모달 컴포넌트
 */

import { X, Clock, Trash2, Trophy } from 'lucide-react';
import { useGameStore, type GameHistoryEntry } from '../store/useGameStore';
import { games } from '../constants/gameData';
import { getTierFromScore, getTierEmoji } from '../utils/scoringUtils';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 게임 ID로 게임 이름 찾기
 */
function getGameName(gameId: string): string {
  const game = games.find((g) => g.id === gameId);
  return game?.name ?? gameId;
}

/**
 * ISO 문자열을 상대 시간으로 변환
 */
function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;

  // 7일 이상이면 날짜 표시
  return date.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * 히스토리 항목 컴포넌트
 */
function HistoryItem({ entry }: { entry: GameHistoryEntry }) {
  const gameName = getGameName(entry.gameId);
  const tier = getTierFromScore(entry.score);

  return (
    <div className="flex items-center justify-between py-3 px-4 bg-white rounded-xl border border-gray-100 hover:border-indigo-200 transition-colors">
      <div className="flex items-center gap-3">
        {/* 티어 배지 */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
          style={{ backgroundColor: tier.color + '20' }}
        >
          {getTierEmoji(tier.grade)}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-800">{gameName}</p>
            <span
              className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white"
              style={{ backgroundColor: tier.color }}
            >
              {tier.grade}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{formatRelativeTime(entry.playedAt)}</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <span className="text-lg font-bold text-indigo-600">
          +{entry.score.toLocaleString()}
        </span>
        <span className="text-sm text-gray-500">점</span>
      </div>
    </div>
  );
}

export function HistoryModal({ isOpen, onClose }: HistoryModalProps) {
  const { totalScore, gameHistory, clearHistory } = useGameStore();

  if (!isOpen) return null;

  const handleClearHistory = () => {
    if (window.confirm('정말로 히스토리를 초기화하시겠습니까?\n총 점수도 0점으로 리셋됩니다.')) {
      clearHistory();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 컨텐츠 */}
      <div className="relative w-full max-w-md max-h-[80vh] bg-gray-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">점수 히스토리</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 총점 요약 */}
        <div className="px-5 py-4 bg-gradient-to-r from-indigo-500 to-purple-600">
          <p className="text-indigo-100 text-sm mb-1">누적 총 점수</p>
          <p className="text-3xl font-bold text-white">
            {totalScore.toLocaleString()}점
          </p>
          <p className="text-indigo-200 text-xs mt-1">
            총 {gameHistory.length}회 플레이
          </p>
        </div>

        {/* 히스토리 목록 */}
        <div className="flex-1 overflow-y-auto p-4">
          {gameHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 mb-1">아직 플레이 기록이 없어요</p>
              <p className="text-sm text-gray-400">
                게임을 플레이하면 여기에 기록됩니다!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {gameHistory.map((entry) => (
                <HistoryItem key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </div>

        {/* 푸터 */}
        {gameHistory.length > 0 && (
          <div className="px-5 py-3 bg-white border-t border-gray-200">
            <button
              onClick={handleClearHistory}
              className="flex items-center justify-center gap-2 w-full py-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              히스토리 초기화
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
