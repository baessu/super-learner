/**
 * migrate-to-sanity.ts
 * 기존 gameData.ts 데이터를 Sanity CMS로 마이그레이션하는 스크립트
 *
 * 실행 방법:
 * 1. 환경 변수 설정: export SANITY_PROJECT_ID=xxx SANITY_TOKEN=xxx
 * 2. npx ts-node scripts/migrate-to-sanity.ts
 *
 * 또는 Sanity Studio에서 직접 입력 가능
 */

import { createClient } from '@sanity/client';

// ============================================
// Configuration
// ============================================

const projectId = process.env.SANITY_PROJECT_ID;
const token = process.env.SANITY_TOKEN; // Write 권한 필요
const dataset = process.env.SANITY_DATASET || 'production';

if (!projectId || !token) {
  console.error('❌ Missing environment variables:');
  console.error('   SANITY_PROJECT_ID and SANITY_TOKEN are required');
  console.error('');
  console.error('Usage:');
  console.error('  export SANITY_PROJECT_ID=your-project-id');
  console.error('  export SANITY_TOKEN=your-write-token');
  console.error('  npx ts-node scripts/migrate-to-sanity.ts');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
});

// ============================================
// Game Data (from gameData.ts)
// ============================================

type GameCategory = 'SPEED' | 'MEMORY' | 'FOCUS' | 'LOGIC';
type IconName = string;

interface GameData {
  id: string;
  name: string;
  description: string;
  category: GameCategory;
  level: number;
  thumbnail: string;
  icon: IconName;
  route: string;
  isComingSoon: boolean;
  estimatedTime: string;
  difficulty: number;
}

const games: GameData[] = [
  // SPEED - 속독 및 시야
  {
    id: 'schulte-table-l1',
    name: '슐테 테이블 Lv.1',
    description: '중앙을 응시하며 주변 숫자를 순서대로 찾으세요.',
    category: 'SPEED',
    level: 1,
    thumbnail: 'from-blue-500 to-indigo-500',
    icon: 'Grid3X3',
    route: '/game/schulte-table',
    isComingSoon: false,
    estimatedTime: '2분',
    difficulty: 2,
  },
  {
    id: 'schulte-table-l2',
    name: '슐테 테이블 Lv.2',
    description: '좌우 분할 보드에서 주변시야로 숫자를 찾으세요.',
    category: 'SPEED',
    level: 2,
    thumbnail: 'from-[#E87C63] to-orange-500',
    icon: 'LayoutGrid',
    route: '/game/schulte-table-l2',
    isComingSoon: false,
    estimatedTime: '2분',
    difficulty: 4,
  },
  {
    id: 'memory-flash',
    name: '메모리 플래시',
    description: '찰나의 순간 스쳐가는 정보를 포착하세요.',
    category: 'SPEED',
    level: 1,
    thumbnail: 'from-sky-500 to-cyan-500',
    icon: 'Zap',
    route: '/game/memory-flash',
    isComingSoon: false,
    estimatedTime: '3분',
    difficulty: 3,
  },
  // MEMORY - 기억력 강화
  {
    id: 'dual-n-back',
    name: '듀얼 엔백',
    description: '위치와 소리를 동시에 기억하여 IQ를 높이세요.',
    category: 'MEMORY',
    level: 1,
    thumbnail: 'from-purple-500 to-violet-500',
    icon: 'Brain',
    route: '/game/dual-n-back',
    isComingSoon: false,
    estimatedTime: '5분',
    difficulty: 4,
  },
  {
    id: 'random-images',
    name: '이미지 연상',
    description: '20개의 이미지를 스토리로 연결해 기억하세요.',
    category: 'MEMORY',
    level: 1,
    thumbnail: 'from-fuchsia-500 to-pink-500',
    icon: 'Images',
    route: '/game/random-images',
    isComingSoon: false,
    estimatedTime: '3분',
    difficulty: 3,
  },
  // FOCUS - 주의력 및 통제
  {
    id: 'stroop-test',
    name: '스트룹 테스트',
    description: '글자의 뜻에 속지 말고 색깔을 선택하세요.',
    category: 'FOCUS',
    level: 1,
    thumbnail: 'from-amber-500 to-orange-500',
    icon: 'Palette',
    route: '/game/stroop-test',
    isComingSoon: false,
    estimatedTime: '1분',
    difficulty: 3,
  },
  {
    id: 'camera-mind',
    name: '카메라 마인드',
    description: '가장 마지막에 나타난 원을 추적하여 찾으세요.',
    category: 'FOCUS',
    level: 1,
    thumbnail: 'from-yellow-500 to-amber-500',
    icon: 'Eye',
    route: '/game/camera-mind',
    isComingSoon: false,
    estimatedTime: '4분',
    difficulty: 3,
  },
];

// ============================================
// Migration Function
// ============================================

async function migrateGames() {
  console.log('🚀 Starting migration to Sanity...');
  console.log(`   Project: ${projectId}`);
  console.log(`   Dataset: ${dataset}`);
  console.log(`   Games to migrate: ${games.length}`);
  console.log('');

  let successCount = 0;
  let errorCount = 0;

  for (const game of games) {
    try {
      const doc = {
        _type: 'game',
        _id: `game-${game.id}`, // 고유 ID
        title: game.name,
        slug: {
          _type: 'slug',
          current: game.id,
        },
        description: game.description,
        category: game.category,
        level: game.level,
        gradientFallback: game.thumbnail,
        icon: game.icon,
        route: game.route,
        isComingSoon: game.isComingSoon,
        difficulty: game.difficulty,
        estimatedTime: game.estimatedTime,
        order: games.indexOf(game) * 10, // 순서 유지
      };

      await client.createOrReplace(doc);
      console.log(`✅ Migrated: ${game.name}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed: ${game.name}`, error);
      errorCount++;
    }
  }

  console.log('');
  console.log('📊 Migration Summary:');
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Failed: ${errorCount}`);
  console.log('');

  if (errorCount === 0) {
    console.log('🎉 Migration completed successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Open Sanity Studio: cd sanity && npm run dev');
    console.log('2. Add thumbnail images in the Studio');
    console.log('3. Set environment variables in .env:');
    console.log('   VITE_SANITY_PROJECT_ID=' + projectId);
    console.log('   VITE_SANITY_DATASET=' + dataset);
    console.log('   VITE_USE_SANITY=true');
  }
}

// Run migration
migrateGames().catch(console.error);
