'use client';
import { useState } from 'react';
import TabNav from '../components-shared/ui/TabNav';
import LiveMonitorTab from './components/LiveMonitorTab';
import ChannelsTab from './components/ChannelsTab';
import ChatManageTab from './components/ChatManageTab';

type BroadcastTab = 'live' | 'channels' | 'chat';

const tabs = [
  { key: 'live', label: '라이브 모니터링' },
  { key: 'channels', label: '채널/스트림 관리' },
  { key: 'chat', label: '채팅 관리' },
] as const;

export default function AdminBroadcastPage() {
  const [activeTab, setActiveTab] = useState<BroadcastTab>('live');

  return (
    <div className="space-y-6">
      <TabNav tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      {activeTab === 'live' && <LiveMonitorTab />}
      {activeTab === 'channels' && <ChannelsTab />}
      {activeTab === 'chat' && <ChatManageTab />}
    </div>
  );
}
