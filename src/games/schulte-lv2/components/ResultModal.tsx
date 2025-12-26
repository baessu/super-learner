/**
 * ResultModal.tsx
 * 게임 결과 모달 컴포넌트
 */

import { Link } from 'react-router-dom';
import type { GameResult } from '../types';
import { formatTime, getNextTierRequirement, calculateScore } from '../scoringUtils';

interface ResultModalProps {
  result: GameResult;
  elapsedTime: number;
  onRetry: () => void;
}

export function ResultModal({ result, elapsedTime, onRetry }: ResultModalProps) {
  const { tier, level, timeSeconds } = result;
  const score = calculateScore(level, timeSeconds);
  const nextTierInfo = getNextTierRequirement(timeSeconds);

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* 티어 배지 */}
      <div className="text-center">
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
          style={{
            backgroundColor: tier.color + '20',
            borderColor: tier.color,
            borderWidth: 4,
          }}
        >
          <span className="text-6xl">{tier.emoji}</span>
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span
            className="px-4 py-1.5 rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: tier.color }}
          >
            {tier.grade} 등급
          </span>
          <span className="text-sm text-gray-500">Lv.{level}</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{tier.name}</h3>
        <p className="text-gray-600">
          기록:{' '}
          <span className="text-3xl font-bold text-[#E87C63]">
            {formatTime(elapsedTime)}
          </span>
          초
        </p>
      </div>

      {/* 피드백 메시지 */}
      <div className="bg-gray-50 px-5 py-4 rounded-xl max-w-sm">
        <p className="text-sm text-gray-700 text-center">{tier.feedback}</p>
      </div>

      {/* 다음 티어 안내 */}
      {nextTierInfo && (
        <div className="text-center text-sm text-gray-500">
          <span className="font-medium" style={{ color: tier.color }}>
            {nextTierInfo.nextGrade}
          </span>{' '}
          등급까지{' '}
          <span className="font-bold">{nextTierInfo.difference.toFixed(1)}초</span> 더
          빨라지면 도달!
        </div>
      )}

      {/* 점수 표시 */}
      <div className="bg-gradient-to-r from-[#FEF2F0] to-orange-50 px-6 py-4 rounded-2xl border border-[#FADAD4]">
        <p className="text-sm text-gray-500 text-center mb-1">획득 점수</p>
        <p className="text-3xl font-bold text-[#E87C63] text-center">
          +{score.toLocaleString()}점
        </p>
      </div>

      {/* 버튼들 */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
        <button
          onClick={onRetry}
          className="flex-1 px-6 py-3 bg-[#E87C63] text-white font-semibold rounded-xl hover:bg-[#D66B53] active:scale-95 transition-all"
        >
          다시 도전하기
        </button>
        <Link
          to="/games"
          className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 active:scale-95 transition-all text-center"
        >
          게임 목록으로
        </Link>
      </div>
    </div>
  );
}
