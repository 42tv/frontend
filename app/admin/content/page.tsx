'use client';
import { useState } from 'react';
import TabNav from '../components-shared/ui/TabNav';
import ArticlesTab from './components/ArticlesTab';
import TermsTab from './components/TermsTab';

type ContentTab = 'articles' | 'terms';

const tabs = [
  { key: 'articles', label: '공지/게시글' },
  { key: 'terms', label: '약관 관리' },
] as const;

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<ContentTab>('articles');

  return (
    <div className="space-y-6">
      <TabNav tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      {activeTab === 'articles' && <ArticlesTab />}
      {activeTab === 'terms' && <TermsTab />}
    </div>
  );
}
