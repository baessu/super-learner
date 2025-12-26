/**
 * ToolsPage.tsx
 * 학습 도구 목록 페이지
 */

import { Link } from 'react-router-dom';
import { Wrench, Brain, BookOpen, Calculator, Target, Zap } from 'lucide-react';

// 도구 데이터 타입
interface ToolData {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  emoji: string;
  route: string;
  color: string;
  isComingSoon: boolean;
}

// 도구 목록
const tools: ToolData[] = [
  {
    id: 'reading-diagnosis',
    name: '슈퍼 러닝 자가 진단',
    description: '읽기 속도와 이해력을 측정하여 학습 유형을 진단합니다',
    icon: <Target className="w-5 h-5" />,
    emoji: '📊',
    route: '/tools/reading-diagnosis',
    color: 'from-blue-500 to-indigo-500',
    isComingSoon: false,
  },
  {
    id: 'major-system',
    name: '기억술 변환기',
    description: '숫자 ↔ 한글 초성 변환으로 숫자를 쉽게 기억하세요',
    icon: <Brain className="w-5 h-5" />,
    emoji: '🧠',
    route: '/tools/major-system',
    color: 'from-[#E87C63] to-[#D66B53]',
    isComingSoon: false,
  },
  {
    id: 'speed-training',
    name: 'RSVP 속도 훈련',
    description: '빠른 시각 프레젠테이션으로 읽기 속도를 향상시킵니다',
    icon: <Zap className="w-5 h-5" />,
    emoji: '⚡',
    route: '/tools/speed-training',
    color: 'from-amber-500 to-orange-500',
    isComingSoon: false,
  },
  {
    id: 'memory-palace',
    name: '기억의 궁전',
    description: '장소법을 활용한 기억력 훈련 도구',
    icon: <BookOpen className="w-5 h-5" />,
    emoji: '🏛️',
    route: '/tools/memory-palace',
    color: 'from-purple-500 to-indigo-500',
    isComingSoon: true,
  },
  {
    id: 'spaced-repetition',
    name: '간격 반복 학습',
    description: '효율적인 복습 주기를 관리하는 플래시카드',
    icon: <Calculator className="w-5 h-5" />,
    emoji: '📚',
    route: '/tools/spaced-repetition',
    color: 'from-emerald-500 to-teal-500',
    isComingSoon: true,
  },
];

/**
 * 도구 카드 컴포넌트
 */
function ToolCard({ tool }: { tool: ToolData }) {
  const isAvailable = !tool.isComingSoon;

  const content = (
    <div
      className={`
        bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden
        transition-all duration-300
        ${isAvailable ? 'hover:shadow-lg hover:-translate-y-1' : ''}
        ${!isAvailable ? 'grayscale opacity-60' : ''}
      `}
    >
      {/* 썸네일 */}
      <div
        className={`h-32 bg-gradient-to-br ${tool.color} flex items-center justify-center relative`}
      >
        <span
          className={`
            text-5xl transition-all duration-300
            ${isAvailable ? 'opacity-80 group-hover:opacity-100 group-hover:scale-110' : 'opacity-50'}
          `}
        >
          {tool.emoji}
        </span>

        {/* 준비 중 배지 */}
        {!isAvailable && (
          <span
            className="absolute top-3 right-3 bg-gray-800 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-md"
            style={{ filter: 'none' }}
          >
            준비 중
          </span>
        )}
      </div>

      {/* 콘텐츠 */}
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div
            className={`
              w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
              ${isAvailable ? 'bg-[#FEF2F0] text-[#E87C63]' : 'bg-gray-100 text-gray-400'}
            `}
          >
            {tool.icon}
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-800">{tool.name}</h3>
            <p className="text-xs text-gray-500 line-clamp-2">{tool.description}</p>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div
          className={`
            flex items-center text-sm font-medium
            ${isAvailable ? 'text-[#E87C63]' : 'text-gray-400'}
          `}
        >
          <Wrench className="w-4 h-4 mr-1.5" />
          {isAvailable ? '도구 열기' : '곧 출시'}
          {isAvailable && (
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
          )}
        </div>
      </div>
    </div>
  );

  if (isAvailable) {
    return (
      <Link to={tool.route} className="group block">
        {content}
      </Link>
    );
  }

  return <div className="cursor-not-allowed">{content}</div>;
}

export function ToolsPage() {
  const availableCount = tools.filter((t) => !t.isComingSoon).length;

  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">학습 도구</h2>
        <p className="text-gray-600">
          기억력 향상을 위한 {tools.length}개의 도구 중 {availableCount}개를 사용할
          수 있습니다.
        </p>
      </div>

      {/* 도구 설명 */}
      <div className="mb-8 p-5 bg-gradient-to-r from-[#FEF2F0] to-orange-50 rounded-2xl border border-[#FADAD4]">
        <h3 className="font-bold text-gray-800 mb-2">💡 학습 도구란?</h3>
        <p className="text-sm text-gray-600">
          게임과 달리 점수를 측정하지 않고, 기억술 기법을 연습하고 활용할 수 있는
          실용적인 도구들입니다. 숫자 암기, 단어 연상 등 다양한 기억 전략을 익혀보세요.
        </p>
      </div>

      {/* 도구 카드 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
