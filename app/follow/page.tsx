'use client';
import React, { useState } from 'react';
import TabNav from '@/app/follow/components/TabNav';
import BookmarkContent from '@/app/follow/components/BookmarkContent';
import FanContent from '@/app/follow/components/FanContent';

const TABS = ['FAN', 'BOOKMARK'] as const;

export default function FollowPage() {
  const [activeTab, setActiveTab] = useState<string>(TABS[0]);

  return (
    <div className="min-h-screen bg-[#0d0d10] px-5 py-5 text-[#e2e2ea]">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-5">
        <section className="overflow-hidden rounded-2xl border border-[#2c2c38] bg-[#17171c]">
          <div className="relative p-6">
            <div className="absolute right-0 top-0 h-28 w-64 rounded-bl-full bg-accent/15 blur-2xl" />
            <div className="relative flex flex-col gap-2">
              <span className="w-fit rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                Pick
              </span>
              <h1 className="text-[28px] font-extrabold tracking-tight">내가 보는 BJ</h1>
              <p className="max-w-xl text-[13px] leading-6 text-[#a0a0b0]">
                팬클럽과 북마크한 방송자를 한 곳에서 확인하고, 방송 중인 채널만 빠르게 골라보세요.
              </p>
            </div>
          </div>
          <TabNav tabs={TABS} active={activeTab} onChange={setActiveTab} />
        </section>

        {activeTab === 'BOOKMARK' ? (
          <BookmarkContent />
        ) : (
          <FanContent />
        )}
      </div>
    </div>
  );
}
