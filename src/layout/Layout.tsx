/**
 * Layout.tsx
 * 애플리케이션의 기본 레이아웃 컴포넌트
 * - 헤더: 로고, 네비게이션, 총 점수 표시, 인증 버튼
 * - 메인: 자식 컴포넌트 렌더링 영역
 * - 푸터: 저작권 및 기타 정보
 */

import { useState, useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { History, Cloud, User, LogOut, ChevronDown, Edit3, Settings } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { HistoryModal } from '../components/HistoryModal';
import { Navigation, MobileBottomNav } from '../components/Navigation';
import { AuthModal } from '../components/AuthModal';
import { GuestNicknameModal } from '../components/GuestNicknameModal';
import { ProfileEditModal } from '../components/ProfileEditModal';
import { useAuth } from '../hooks/useAuth';
import { useMigration } from '../hooks/useMigration';
import { useAuthStore } from '../store/useAuthStore';
import { getGuestRecordCount } from '../utils/scoreStorage';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { totalScore, gameStatus, currentSession } = useGameStore();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isGuestNicknameModalOpen, setIsGuestNicknameModalOpen] = useState(false);
  const [isProfileEditModalOpen, setIsProfileEditModalOpen] = useState(false);

  // Auth & Migration
  const { user, isGuest, loading: authLoading, signOut } = useAuth();
  const migration = useMigration();
  const guestNickname = useAuthStore((state) => state.guestNickname);

  // 마이그레이션 메시지 표시
  useEffect(() => {
    if (migration.message) {
      // 3초 후 자동으로 메시지 닫기
      const timer = setTimeout(() => {
        migration.dismissMessage();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [migration.message, migration.dismissMessage]);

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
  };

  const guestRecordCount = getGuestRecordCount();

  return (
    <div className="min-h-screen flex flex-col bg-warm-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b border-warm-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* 로고 영역 */}
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity flex-shrink-0">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
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

            {/* 점수 및 인증 영역 */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* 현재 게임 점수 (게임 중일 때만 표시) */}
              {gameStatus === 'playing' && currentSession && (
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-gray-500">현재 점수</p>
                  <p className="text-lg font-semibold text-primary-600">
                    {currentSession.score.toLocaleString()}점
                  </p>
                </div>
              )}

              {/* 총 점수 (클릭 시 히스토리 모달) */}
              <button
                onClick={() => setIsHistoryOpen(true)}
                className="score-button group"
              >
                <div className="text-left">
                  <p className="text-[10px] sm:text-xs text-gray-500">총 점수</p>
                  <p className="text-lg sm:text-xl font-bold text-primary-600">
                    {totalScore.toLocaleString()}
                  </p>
                </div>
                <History className="w-4 h-4 text-primary-400 group-hover:text-primary-600 transition-colors hidden sm:block" />
              </button>

              {/* 인증 버튼 */}
              {!authLoading && (
                isGuest ? (
                  // 게스트: 닉네임 + 로그인 버튼
                  <div className="flex items-center gap-2">
                    {/* 게스트 닉네임 */}
                    <button
                      onClick={() => setIsGuestNicknameModalOpen(true)}
                      className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm transition-all"
                    >
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="max-w-24 truncate">{guestNickname}</span>
                      <Edit3 className="w-3 h-3 text-gray-400" />
                    </button>

                    {/* 로그인 버튼 */}
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="btn btn-accent shadow-sm"
                    >
                      <Cloud className="w-4 h-4" />
                      <span className="hidden sm:inline">
                        {guestRecordCount > 0 ? '기록 연동하기' : '로그인'}
                      </span>
                      {guestRecordCount > 0 && (
                        <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
                          {guestRecordCount}
                        </span>
                      )}
                    </button>
                  </div>
                ) : (
                  // 로그인 사용자: 프로필 메뉴
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-success-50 to-emerald-50 border border-success-200 hover:from-success-100 hover:to-emerald-100 transition-all"
                    >
                      {user?.user_metadata?.avatar_url ? (
                        <img
                          src={user.user_metadata.avatar_url}
                          alt="프로필"
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-success-500 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <span className="hidden sm:inline text-sm text-gray-700 max-w-24 truncate">
                        {user?.user_metadata?.full_name || user?.email?.split('@')[0] || '사용자'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>

                    {/* 드롭다운 메뉴 */}
                    {isUserMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setIsUserMenuOpen(false)}
                        />
                        <div className="dropdown-menu">
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {user?.user_metadata?.full_name || '사용자'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {user?.email}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setIsProfileEditModalOpen(true);
                              setIsUserMenuOpen(false);
                            }}
                            className="dropdown-item"
                          >
                            <Settings className="w-4 h-4" />
                            프로필 편집
                          </button>
                          <button
                            onClick={handleSignOut}
                            className="dropdown-item dropdown-item-danger"
                          >
                            <LogOut className="w-4 h-4" />
                            로그아웃
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )
              )}
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
              <a href="#" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">
                이용약관
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">
                개인정보처리방침
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">
                문의하기
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* 히스토리 모달 */}
      <HistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />

      {/* 인증 모달 */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* 게스트 닉네임 모달 */}
      <GuestNicknameModal isOpen={isGuestNicknameModalOpen} onClose={() => setIsGuestNicknameModalOpen(false)} />

      {/* 프로필 편집 모달 */}
      <ProfileEditModal isOpen={isProfileEditModalOpen} onClose={() => setIsProfileEditModalOpen(false)} />

      {/* 마이그레이션 토스트 */}
      {migration.message && (
        <div className={`toast bottom-20 md:bottom-4 right-4 left-4 md:left-auto ${migration.status === 'success' ? 'toast-success' : 'toast-error'}`}>
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">
              {migration.status === 'success' ? '🎉' : '⚠️'}
            </span>
            <div className="flex-1 min-w-0">
              <p className={`font-medium ${migration.status === 'success' ? 'text-success-700' : 'text-error-700'}`}>
                {migration.status === 'success' ? '기록 동기화 완료' : '동기화 실패'}
              </p>
              <p className={`text-sm mt-1 ${migration.status === 'success' ? 'text-success-600' : 'text-error-600'}`}>
                {migration.message}
              </p>
            </div>
            <button
              onClick={migration.dismissMessage}
              className={`flex-shrink-0 ${migration.status === 'success' ? 'text-success-600' : 'text-error-600'} hover:opacity-70`}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 모바일 하단 네비게이션 */}
      <MobileBottomNav />
    </div>
  );
}
