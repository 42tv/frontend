'use client';
import { useState } from 'react';
import TabNav from '../components-shared/ui/TabNav';
import PaymentStatsTab from './components/PaymentStatsTab';
import TopupsTab from './components/TopupsTab';
import RefundRequestsTab from './components/RefundRequestsTab';
import SettlementTab from '../settlement/components/SettlementTab';

type PaymentsPageTab = 'stats' | 'topups' | 'refund-requests' | 'settlements';

const tabs = [
  { key: 'stats', label: '결제 통계' },
  { key: 'topups', label: '충전 내역' },
  { key: 'refund-requests', label: '환불 요청' },
  { key: 'settlements', label: '정산 신청' },
] as const;

export default function AdminPaymentsPage() {
  const [activeTab, setActiveTab] = useState<PaymentsPageTab>('stats');

  return (
    <div className="space-y-6">
      <TabNav tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      {activeTab === 'stats' && <PaymentStatsTab />}
      {activeTab === 'topups' && <TopupsTab />}
      {activeTab === 'refund-requests' && <RefundRequestsTab />}
      {activeTab === 'settlements' && <SettlementTab />}
    </div>
  );
}
