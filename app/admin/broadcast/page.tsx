'use client';
import { useState } from 'react';
import PageHeader from '../components-shared/ui/PageHeader';
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
      <PageHeader
        title="방송 관리"
        description="라이브 모니터링 · NCP 채널 관리 · 채팅/금칙어 관리 (NCP Live Station 기준)"
      />
      <TabNav tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      {activeTab === 'live' && <LiveMonitorTab />}
      {activeTab === 'channels' && <ChannelsTab />}
      {activeTab === 'chat' && <ChatManageTab />}
    </div>
  );
}
