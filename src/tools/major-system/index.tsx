/**
 * 기억술 변환기 (Korean Major System)
 * 숫자를 한글 단어로, 단어를 숫자로 변환하는 기억술 도구
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Zap, Settings, BookOpen } from 'lucide-react';
import { ConverterTab } from './components/ConverterTab';
import { SettingsTab } from './components/SettingsTab';
import { DictionaryTab } from './components/DictionaryTab';

type TabType = 'converter' | 'settings' | 'dictionary';

interface TabConfig {
  id: TabType;
  label: string;
  icon: React.ReactNode;
}

const TABS: TabConfig[] = [
  { id: 'converter', label: '변환기', icon: <Zap className="w-4 h-4" /> },
  { id: 'settings', label: '매핑 설정', icon: <Settings className="w-4 h-4" /> },
  { id: 'dictionary', label: '단어 사전', icon: <BookOpen className="w-4 h-4" /> },
];

// Coral 테마 색상
const CORAL = {
  primary: '#E87C63',
  light: '#FEF2F0',
  hover: '#D66B53',
  border: '#FADAD4',
};

export default function MajorSystem() {
  const [activeTab, setActiveTab] = useState<TabType>('converter');

  return (
    <div className="flex flex-col min-h-[calc(100vh-200px)]">
      {/* 헤더 */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">메인으로</span>
        </Link>

        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: CORAL.light }}
          >
            <span className="text-2xl">🧠</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">기억술 변환기</h1>
            <p className="text-sm text-gray-500">
              숫자 ↔ 한글 초성 변환으로 기억력을 높이세요
            </p>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
              text-sm font-medium transition-all
              ${
                activeTab === tab.id
                  ? 'bg-white shadow-sm text-gray-800'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
              }
            `}
            style={activeTab === tab.id ? { color: CORAL.primary } : undefined}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 탭 컨텐츠 */}
      <div className="flex-1">
        {activeTab === 'converter' && <ConverterTab />}
        {activeTab === 'settings' && <SettingsTab />}
        {activeTab === 'dictionary' && <DictionaryTab />}
      </div>
    </div>
  );
}
