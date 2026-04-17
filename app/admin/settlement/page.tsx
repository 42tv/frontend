'use client';
import { useState } from 'react';
import PayoutCoinTab from './components/PayoutCoinTab';
import SettlementTab from './components/SettlementTab';

type MainTab = 'payout' | 'settlement';

export default function SettlementManagementPage() {
  const [activeTab, setActiveTab] = useState<MainTab>('settlement');

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">정산 관리</h1>
        <p className="text-muted-foreground">PayoutCoin 현황 및 정산 요청을 관리하세요</p>
      </div>

      {/* 메인 탭 */}
      <div className="border-b border-border">
        <div className="flex gap-0">
          {([
            { key: 'settlement', label: '정산 요청 목록' },
            { key: 'payout', label: 'PayoutCoin 현황' },
          ] as const).map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === t.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === 'settlement' ? <SettlementTab /> : <PayoutCoinTab />}
    </div>
  );
}
