'use client';
import { useState } from 'react';
import TabNav from '../components-shared/ui/TabNav';
import UserListTab from './components/UserListTab';
import SanctionsTab from './components/SanctionsTab';
import VerificationTab from './components/VerificationTab';

type UsersTab = 'list' | 'sanctions' | 'verification';

const tabs = [
  { key: 'list', label: '회원 검색' },
  { key: 'sanctions', label: '제재 관리' },
  { key: 'verification', label: '본인인증 현황' },
] as const;

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState<UsersTab>('list');

  return (
    <div className="space-y-6">
      <TabNav tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      {activeTab === 'list' && <UserListTab />}
      {activeTab === 'sanctions' && <SanctionsTab />}
      {activeTab === 'verification' && <VerificationTab />}
    </div>
  );
}
