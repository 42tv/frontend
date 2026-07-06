'use client';
import { useState } from 'react';
import PageHeader from '../components-shared/ui/PageHeader';
import TabNav from '../components-shared/ui/TabNav';
import PaymentsTab from './components/PaymentsTab';
import CoinsTab from './components/CoinsTab';
import DonationsTab from './components/DonationsTab';

type PaymentsPageTab = 'payments' | 'coins' | 'donations';

const tabs = [
  { key: 'payments', label: '결제 내역' },
  { key: 'coins', label: '코인 관리' },
  { key: 'donations', label: '후원 내역' },
] as const;

export default function AdminPaymentsPage() {
  const [activeTab, setActiveTab] = useState<PaymentsPageTab>('payments');

  return (
    <div className="space-y-6">
      <PageHeader title="결제 · 코인 · 후원" description="결제 트랜잭션, 코인 잔액/지급, 후원 내역을 관리하세요" />
      <TabNav tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      {activeTab === 'payments' && <PaymentsTab />}
      {activeTab === 'coins' && <CoinsTab />}
      {activeTab === 'donations' && <DonationsTab />}
    </div>
  );
}
