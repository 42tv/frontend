'use client';
import { useState } from 'react';
import TabNav from '../components-shared/ui/TabNav';
import UserListTab from './components/UserListTab';
import UserStatsTab from './components/UserStatsTab';

type UsersTab = 'list' | 'stats';

const tabs = [
  { key: 'list', label: '회원 검색' },
  { key: 'stats', label: '회원 통계' },
] as const;

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState<UsersTab>('list');

  return (
    <div className="space-y-6">
      <TabNav tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      {activeTab === 'list' && <UserListTab />}
      {activeTab === 'stats' && <UserStatsTab />}
    </div>
  );
}
