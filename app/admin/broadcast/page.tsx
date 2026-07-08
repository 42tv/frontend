'use client';
import { useState } from 'react';
import TabNav from '../components-shared/ui/TabNav';
import LiveMonitorTab from './components/LiveMonitorTab';
import ChatManageTab from './components/ChatManageTab';

type BroadcastTab = 'live' | 'chat';

const tabs = [
  { key: 'live', label: '라이브 모니터링' },
  { key: 'chat', label: '채팅 관리' },
] as const;

export default function AdminBroadcastPage() {
  const [activeTab, setActiveTab] = useState<BroadcastTab>('live');

  return (
    <div className="space-y-6">
      <TabNav tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      {activeTab === 'live' && <LiveMonitorTab />}
      {activeTab === 'chat' && <ChatManageTab />}
    </div>
  );
}
