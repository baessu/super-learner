/**
 * App.tsx
 * 애플리케이션의 루트 컴포넌트
 * - React Router를 이용한 라우팅 설정
 * - 페이지: 홈, 게임 목록, 도구 목록
 */

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Layout } from './layout/Layout';

// 페이지
import { HomePage } from './pages/HomePage';
import { GamesPage } from './pages/GamesPage';
import { ToolsPage } from './pages/ToolsPage';

// 게임
import SchulteTable from './games/schulte-table';
import SchulteLv2 from './games/schulte-lv2';
import DualNBack from './games/dual-n-back';
import RandomImages from './games/20-random-images';
import CameraMind from './games/camera-mind';
import MemoryFlash from './games/memory-flash';
import StroopTest from './games/stroop-test';

// 도구
import MajorSystem from './tools/major-system';
import ReadingDiagnosis from './tools/reading-diagnosis';
import SpeedTraining from './tools/speed-training';

/**
 * 게임 플레이 페이지 (임시 - 미구현 게임용)
 */
function GamePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🎮</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">게임 준비 중</h2>
        <p className="text-gray-600 mb-6">곧 멋진 게임이 이곳에 추가됩니다!</p>
        <Link
          to="/games"
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors"
        >
          게임 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

/**
 * 도구 페이지 (임시 - 미구현 도구용)
 */
function ToolPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#FEF2F0] rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🔧</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">도구 준비 중</h2>
        <p className="text-gray-600 mb-6">곧 유용한 도구가 이곳에 추가됩니다!</p>
        <Link
          to="/tools"
          className="inline-flex items-center px-6 py-3 bg-[#E87C63] text-white font-medium rounded-xl hover:bg-[#D66B53] transition-colors"
        >
          도구 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

/**
 * 메인 App 컴포넌트
 */
function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* 메인 페이지 */}
          <Route path="/" element={<HomePage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/tools" element={<ToolsPage />} />

          {/* 게임들 */}
          <Route path="/game/schulte-table" element={<SchulteTable />} />
          <Route path="/game/schulte-table-l2" element={<SchulteLv2 />} />
          <Route path="/game/dual-n-back" element={<DualNBack />} />
          <Route path="/game/random-images" element={<RandomImages />} />
          <Route path="/game/camera-mind" element={<CameraMind />} />
          <Route path="/game/memory-flash" element={<MemoryFlash />} />
          <Route path="/game/stroop-test" element={<StroopTest />} />
          <Route path="/game/:gameId" element={<GamePage />} />

          {/* 도구들 */}
          <Route path="/tools/major-system" element={<MajorSystem />} />
          <Route path="/tools/reading-diagnosis" element={<ReadingDiagnosis />} />
          <Route path="/tools/speed-training" element={<SpeedTraining />} />
          <Route path="/tools/:toolId" element={<ToolPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
