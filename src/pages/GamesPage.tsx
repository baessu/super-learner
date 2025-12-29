/**
 * GamesPage.tsx
 * 게임 목록 페이지 - 카테고리별 게임 표시
 */

import { GameCard } from '../components/GameCard';
import { useGameStore } from '../store/useGameStore';
import {
  games,
  categoryInfo,
  getGamesByCategory,
  type GameCategory,
} from '../constants/gameData';

// 카테고리 순서 정의
const categoryOrder: GameCategory[] = ['SPEED', 'MEMORY', 'FOCUS', 'LOGIC'];

/**
 * 카테고리 섹션 컴포넌트
 */
function CategorySection({
  category,
  bestScores,
}: {
  category: GameCategory;
  bestScores: Record<string, number>;
}) {
  const info = categoryInfo[category];
  const categoryGames = getGamesByCategory(category);

  return (
    <section className="mb-10">
      {/* 카테고리 헤더 */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`category-indicator bg-gradient-to-b ${info.color}`} />
        <div>
          <h3 className="section-title !mb-0">{info.name}</h3>
          <p className="text-xs text-gray-500">{info.description}</p>
        </div>
        <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
          {categoryGames.length}개
        </span>
      </div>

      {/* 게임 카드 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {categoryGames.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            bestScore={bestScores[game.id] ?? null}
          />
        ))}
      </div>
    </section>
  );
}

export function GamesPage() {
  const availableCount = games.filter((g) => !g.isComingSoon).length;
  const bestScores = useGameStore((state) => state.bestScores);

  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h2 className="page-title">
          두뇌 훈련 게임
        </h2>
        <p className="page-description">
          총 {games.length}개의 게임 중 {availableCount}개를 플레이할 수 있습니다.
        </p>
      </div>

      {/* 카테고리별 게임 목록 */}
      {categoryOrder.map((category) => (
        <CategorySection key={category} category={category} bestScores={bestScores} />
      ))}
    </div>
  );
}
