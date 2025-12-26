/**
 * Layout.tsx
 * 애플리케이션의 기본 레이아웃 컴포넌트
 * - 헤더: 로고, 네비게이션, 총 점수 표시
 * - 메인: 자식 컴포넌트 렌더링 영역
 * - 푸터: 저작권 및 기타 정보
 */

import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { History } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { HistoryModal } from '../components/HistoryModal';
import { Navigation, MobileBottomNav } from '../components/Navigation';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { totalScore, gameStatus, currentSession } = useGameStore();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-warm-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b border-warm-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* 로고 영역 */}
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-800">
                  슈퍼 러너
                </h1>
                <p className="text-xs text-gray-500">
                  두뇌 훈련 플랫폼
                </p>
              </div>
            </Link>

            {/* 네비게이션 */}
            <div className="flex-1 flex justify-center">
              <Navigation />
            </div>

            {/* 점수 표시 영역 */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* 현재 게임 점수 (게임 중일 때만 표시) */}
              {gameStatus === 'playing' && currentSession && (
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-gray-500">현재 점수</p>
                  <p className="text-lg font-semibold text-indigo-600">
                    {currentSession.score.toLocaleString()}점
                  </p>
                </div>
              )}

              {/* 총 점수 (클릭 시 히스토리 모달) */}
              <button
                onClick={() => setIsHistoryOpen(true)}
                className="
                  group flex items-center gap-2
                  bg-gradient-to-r from-indigo-50 to-purple-50
                  px-3 sm:px-4 py-2 rounded-xl border border-indigo-100
                  hover:from-indigo-100 hover:to-purple-100
                  hover:border-indigo-200 transition-all
                "
              >
                <div className="text-left">
                  <p className="text-[10px] sm:text-xs text-gray-500">총 점수</p>
                  <p className="text-lg sm:text-xl font-bold text-indigo-600">
                    {totalScore.toLocaleString()}
                  </p>
                </div>
                <History className="w-4 h-4 text-indigo-400 group-hover:text-indigo-600 transition-colors hidden sm:block" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 sm:py-8 pb-20 md:pb-8">
        {children}
      </main>

      {/* 푸터 - 모바일에서는 숨김 (하단 네비게이션 사용) */}
      <footer className="hidden md:block bg-white border-t border-warm-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © 2024 슈퍼 러너. 당신의 두뇌를 깨우세요.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
              >
                이용약관
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
              >
                개인정보처리방침
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
              >
                문의하기
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* 히스토리 모달 */}
      <HistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />

      {/* 모바일 하단 네비게이션 */}
      <MobileBottomNav />
    </div>
  );
}
