'use client';
import { useState } from 'react';
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
      <TabNav tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      {activeTab === 'payments' && <PaymentsTab />}
      {activeTab === 'coins' && <CoinsTab />}
      {activeTab === 'donations' && <DonationsTab />}
    </div>
  );
}
