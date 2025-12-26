/**
 * Navigation.tsx
 * 반응형 네비게이션 컴포넌트
 * - 데스크톱: 상단 헤더에 표시
 * - 모바일: 하단 고정 네비게이션 바
 */

import { NavLink, useLocation } from 'react-router-dom';
import { Gamepad2, Wrench, Home } from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  shortLabel?: string;
}

/**
 * 데스크톱용 네비게이션 아이템
 */
function DesktopNavItem({ to, icon, label }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
        ${
          isActive
            ? 'bg-indigo-100 text-indigo-700'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

/**
 * 모바일용 하단 네비게이션 아이템
 */
function MobileNavItem({ to, icon, label, shortLabel }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-all
        ${isActive ? 'text-indigo-600' : 'text-gray-400'}
      `}
    >
      {({ isActive }) => (
        <>
          <div className={`transition-transform ${isActive ? 'scale-110' : ''}`}>
            {icon}
          </div>
          <span className="text-[10px] font-medium">{shortLabel || label}</span>
        </>
      )}
    </NavLink>
  );
}

/**
 * 데스크톱 네비게이션 (헤더용)
 */
export function Navigation() {
  return (
    <nav className="hidden md:flex items-center gap-1 p-1 bg-gray-50 rounded-2xl">
      <DesktopNavItem
        to="/"
        icon={<Home className="w-4 h-4" />}
        label="홈"
      />
      <DesktopNavItem
        to="/games"
        icon={<Gamepad2 className="w-4 h-4" />}
        label="게임"
      />
      <DesktopNavItem
        to="/tools"
        icon={<Wrench className="w-4 h-4" />}
        label="학습 도구"
      />
    </nav>
  );
}

/**
 * 모바일 하단 네비게이션 바
 */
export function MobileBottomNav() {
  const location = useLocation();

  // 게임 플레이 중에는 하단 네비게이션 숨기기
  const isGamePlaying = location.pathname.startsWith('/game/') ||
                        location.pathname.startsWith('/tools/major-system');

  if (isGamePlaying) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
      <div className="flex items-center h-16">
        <MobileNavItem
          to="/"
          icon={<Home className="w-5 h-5" />}
          label="홈"
        />
        <MobileNavItem
          to="/games"
          icon={<Gamepad2 className="w-5 h-5" />}
          label="게임"
        />
        <MobileNavItem
          to="/tools"
          icon={<Wrench className="w-5 h-5" />}
          label="도구"
          shortLabel="도구"
        />
      </div>
    </nav>
  );
}
