/**
 * HomePage.tsx
 * 홈 대시보드 페이지 - 요약 정보 및 빠른 접근
 */

import { Link } from 'react-router-dom';
import { Gamepad2, Wrench, Trophy, TrendingUp, Clock, Target } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { games } from '../constants/gameData';
import { getTierFromScore, getTierEmoji, type TierGrade } from '../utils/scoringUtils';

/**
 * 통계 카드 컴포넌트
 */
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="card p-4 flex items-center gap-4">
      <div
        className={`icon-box-lg rounded-xl ${color}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

/**
 * 퀵 액세스 카드 컴포넌트
 */
function QuickAccessCard({
  to,
  icon,
  title,
  description,
  color,
  buttonText,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  buttonText: string;
}) {
  return (
    <Link
      to={to}
      className="group card-interactive p-6"
    >
      <div className={`icon-box-xl rounded-2xl mb-4 ${color}`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      <div className="flex items-center text-sm font-medium text-primary-600 group-hover:text-primary-700">
        {buttonText}
        <svg
          className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  );
}

/**
 * 최근 기록 아이템 컴포넌트
 */
function RecentHistoryItem({
  gameName,
  score,
  time,
}: {
  gameName: string;
  score: number;
  time: string;
}) {
  const tier = getTierFromScore(score);

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
          style={{ backgroundColor: tier.color + '20' }}
        >
          {getTierEmoji(tier.grade)}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-800">{gameName}</p>
            <span
              className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white"
              style={{ backgroundColor: tier.color }}
            >
              {tier.grade}
            </span>
          </div>
          <p className="text-xs text-gray-400">{time}</p>
        </div>
      </div>
      <span className="text-sm font-bold text-primary-600">+{score.toLocaleString()}</span>
    </div>
  );
}

/**
 * 티어 통계 정보
 */
const TIER_CONFIG: { grade: TierGrade; color: string }[] = [
  { grade: 'S', color: '#FFD700' },
  { grade: 'A', color: '#C0C0C0' },
  { grade: 'B', color: '#CD7F32' },
  { grade: 'C', color: '#4A90D9' },
  { grade: 'D', color: '#808080' },
];

/**
 * 게임별 최고 티어 컴포넌트
 */
function GameBestTiersCard({ bestScores }: { bestScores: Record<string, number> }) {
  const playedGameIds = Object.keys(bestScores);

  if (playedGameIds.length === 0) return null;

  // 플레이한 게임만 필터링하고 티어 정보 추가
  const gameWithTiers = playedGameIds
    .map((gameId) => {
      const game = games.find((g) => g.id === gameId);
      if (!game) return null;
      const tier = getTierFromScore(bestScores[gameId]);
      return { game, tier, score: bestScores[gameId] };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => b.score - a.score); // 점수 높은 순 정렬

  return (
    <div className="card p-5">
      <h3 className="section-title">게임별 최고 기록</h3>
      <div className="space-y-3">
        {gameWithTiers.map(({ game, tier, score }) => (
          <div
            key={game.id}
            className="flex items-center justify-between p-3 rounded-xl"
            style={{ backgroundColor: tier.color + '10' }}
          >
            <div className="flex items-center gap-3">
              {/* 게임 아이콘 */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                style={{ backgroundColor: tier.color + '20' }}
              >
                {getTierEmoji(tier.grade)}
              </div>
              <div>
                <p className="font-medium text-gray-800">{game.name}</p>
                <p className="text-xs text-gray-500">{tier.percentile}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="px-2 py-1 rounded-lg text-sm font-bold text-white"
                style={{ backgroundColor: tier.color }}
              >
                {tier.grade}
              </span>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-700">{score.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400">최고점</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 티어 통계 컴포넌트
 */
function TierStatsCard({ tierCounts, totalPlays }: { tierCounts: Record<TierGrade, number>; totalPlays: number }) {
  if (totalPlays === 0) return null;

  const maxCount = Math.max(...Object.values(tierCounts), 1);

  return (
    <div className="card p-5">
      <h3 className="section-title">티어 통계</h3>
      <div className="space-y-3">
        {TIER_CONFIG.map(({ grade, color }) => {
          const count = tierCounts[grade];
          const percentage = totalPlays > 0 ? Math.round((count / totalPlays) * 100) : 0;
          const barWidth = (count / maxCount) * 100;

          return (
            <div key={grade} className="flex items-center gap-3">
              {/* 티어 배지 */}
              <div className="flex items-center gap-2 w-24 flex-shrink-0">
                <span className="text-xl">{getTierEmoji(grade)}</span>
                <span
                  className="px-2 py-0.5 rounded text-xs font-bold text-white"
                  style={{ backgroundColor: color }}
                >
                  {grade}
                </span>
              </div>

              {/* 바 그래프 */}
              <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden relative">
                <div
                  className="h-full rounded-lg transition-all duration-500"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: color + '40',
                    borderRight: count > 0 ? `3px solid ${color}` : 'none',
                  }}
                />
                {count > 0 && (
                  <span className="absolute inset-0 flex items-center px-3 text-xs font-medium text-gray-700">
                    {count}회 ({percentage}%)
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 요약 */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
        <span className="text-gray-500">총 {totalPlays}회 플레이</span>
        {tierCounts['S'] > 0 && (
          <span className="text-amber-600 font-medium">
            👑 S등급 {tierCounts['S']}회 달성!
          </span>
        )}
      </div>
    </div>
  );
}

export function HomePage() {
  const { totalScore, bestScores, gameHistory } = useGameStore();

  // 통계 계산
  const availableGames = games.filter((g) => !g.isComingSoon).length;
  const playedGames = Object.keys(bestScores).length;
  const totalPlays = gameHistory.length;

  // 티어별 카운트 계산
  const tierCounts: Record<TierGrade, number> = { S: 0, A: 0, B: 0, C: 0, D: 0 };
  gameHistory.forEach((entry) => {
    const tier = getTierFromScore(entry.score);
    tierCounts[tier.grade]++;
  });

  // 최근 5개 기록
  const recentHistory = gameHistory.slice(0, 5);

  // 게임 이름 찾기 헬퍼
  const getGameName = (gameId: string) => {
    const game = games.find((g) => g.id === gameId);
    return game?.name ?? gameId;
  };

  // 상대 시간 변환 헬퍼
  const formatRelativeTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    return `${diffDays}일 전`;
  };

  return (
    <div className="space-y-8">
      {/* 환영 메시지 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          오늘의 훈련을 시작해볼까요? 👋
        </h2>
        <p className="text-gray-600">
          두뇌 훈련으로 집중력과 기억력을 향상시키세요.
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Trophy className="w-6 h-6 text-primary-600" />}
          label="총 점수"
          value={totalScore.toLocaleString()}
          color="bg-primary-100"
        />
        <StatCard
          icon={<Target className="w-6 h-6 text-success-600" />}
          label="플레이한 게임"
          value={`${playedGames} / ${availableGames}`}
          color="bg-success-100"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
          label="총 플레이 횟수"
          value={totalPlays}
          color="bg-purple-100"
        />
        <StatCard
          icon={<Clock className="w-6 h-6 text-warning-600" />}
          label="오늘 플레이"
          value={
            gameHistory.filter((h) => {
              const today = new Date().toDateString();
              return new Date(h.playedAt).toDateString() === today;
            }).length
          }
          color="bg-warning-100"
        />
      </div>

      {/* 퀵 액세스 */}
      <div>
        <h3 className="section-title">바로가기</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <QuickAccessCard
            to="/games"
            icon={<Gamepad2 className="w-7 h-7 text-primary-600" />}
            title="두뇌 훈련 게임"
            description="슐테 테이블, 듀얼 엔백 등 다양한 두뇌 훈련 게임을 플레이하세요."
            color="bg-primary-100"
            buttonText="게임 보기"
          />
          <QuickAccessCard
            to="/tools"
            icon={<Wrench className="w-7 h-7 text-accent-400" />}
            title="학습 도구"
            description="기억술 변환기 등 기억력 향상을 위한 실용적인 도구를 사용하세요."
            color="bg-accent-50"
            buttonText="도구 보기"
          />
        </div>
      </div>

      {/* 게임별 최고 기록 */}
      {Object.keys(bestScores).length > 0 && (
        <GameBestTiersCard bestScores={bestScores} />
      )}

      {/* 티어 통계 & 최근 기록 */}
      {recentHistory.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 티어 통계 */}
          <TierStatsCard tierCounts={tierCounts} totalPlays={totalPlays} />

          {/* 최근 기록 */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title !mb-0">최근 기록</h3>
            </div>
            <div>
              {recentHistory.map((entry) => (
                <RecentHistoryItem
                  key={entry.id}
                  gameName={getGameName(entry.gameId)}
                  score={entry.score}
                  time={formatRelativeTime(entry.playedAt)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 빈 상태 */}
      {recentHistory.length === 0 && (
        <div className="empty-state">
          <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gamepad2 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">아직 플레이 기록이 없어요</h3>
          <p className="text-gray-500 mb-4">
            첫 번째 게임을 플레이하고 두뇌 훈련을 시작해보세요!
          </p>
          <Link
            to="/games"
            className="btn btn-primary px-6 py-3"
          >
            게임 시작하기
          </Link>
        </div>
      )}
    </div>
  );
}
