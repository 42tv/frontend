'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { DonationMessage } from '@/app/_types';
import { WidgetDonationConfig } from '@/app/_types/widget';

interface OverlayEvent {
  op: string;
  broadcaster_id: string;
  payload: DonationMessage;
}

interface ActiveDonation {
  id: string;
  data: DonationMessage;
}

const MOCK_DONATIONS: DonationMessage[] = [
  { type: 'donation', amount: 1000, donor_nickname: '별빛고양이', message: '오늘도 방송 너무 재밌어요. 끝까지 달려봅시다.' },
  { type: 'donation', amount: 50000, donor_nickname: '감자별', message: '다음 주 합방도 기대할게요!' },
  { type: 'donation', amount: 500, donor_nickname: '도리토스', message: '화이팅!' },
];

function BannerAlert({ donation, onHide }: { donation: ActiveDonation; onHide: () => void }) {
  return (
    <div
      key={donation.id}
      className="w-full rounded-2xl border border-[#ff8c5c] bg-[#3b1e14]/90 px-5 py-4 shadow-xl backdrop-blur-sm"
      onAnimationEnd={onHide}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ffb18d]">
            Donation Alert
          </div>
          <div className="mt-1 text-lg font-semibold text-white">
            {donation.data.donor_nickname}님이 {donation.data.amount.toLocaleString()}원을 후원했습니다
          </div>
          {donation.data.message && (
            <div className="mt-1 text-sm text-white/75">&quot;{donation.data.message}&quot;</div>
          )}
        </div>
        <div className="shrink-0 rounded-xl bg-[#ff7a45] px-4 py-2 text-sm font-semibold text-white">
          +{donation.data.amount.toLocaleString()}
        </div>
      </div>
    </div>
  );
}

function CardAlert({ donation }: { donation: ActiveDonation }) {
  return (
    <div className="w-[360px] rounded-[28px] border border-white/10 bg-black/70 p-5 shadow-2xl backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#ff7a45] to-[#ffb18d]" />
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
            Premium Support
          </div>
          <div className="mt-1 text-xl font-semibold text-white">{donation.data.donor_nickname}님</div>
        </div>
      </div>
      <div className="mt-5 text-4xl font-bold text-[#ffb18d]">
        ₩ {donation.data.amount.toLocaleString()}
      </div>
      {donation.data.message && (
        <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-white/85">
          {donation.data.message}
        </div>
      )}
    </div>
  );
}

interface WidgetDonationClientProps {
  token: string;
  donationConfig: WidgetDonationConfig;
  isDev: boolean;
}

export default function WidgetDonationClient({ token, donationConfig, isDev }: WidgetDonationClientProps) {
  const [activeDonation, setActiveDonation] = useState<ActiveDonation | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showDonation = useCallback((data: DonationMessage) => {
    if (data.amount < donationConfig.minDisplayAmount) return;

    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);

    setActiveDonation({ id: `${Date.now()}`, data });

    hideTimerRef.current = setTimeout(() => {
      setActiveDonation(null);
    }, donationConfig.displayDuration);
  }, [donationConfig.minDisplayAmount, donationConfig.displayDuration]);

  // 소켓 연결
  useEffect(() => {
    if (isDev) return;

    const socket = io(
      `ws://${process.env.NEXT_PUBLIC_BACKEND}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/overlay`,
      {
        query: { token },
        transports: ['websocket'],
      }
    );

    socketRef.current = socket;

    socket.on('overlay_event', (event: OverlayEvent) => {
      if (event.op === 'donation') showDonation(event.payload);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, isDev, showDonation]);

  // 개발 모드 — 목업 후원 순차 표시
  useEffect(() => {
    if (!isDev) return;

    let index = 0;
    function showNext() {
      showDonation(MOCK_DONATIONS[index % MOCK_DONATIONS.length]);
      index++;
    }

    const timer = setTimeout(() => {
      showNext();
      const interval = setInterval(showNext, donationConfig.displayDuration + 1500);
      return () => clearInterval(interval);
    }, 800);

    return () => clearTimeout(timer);
  }, [isDev, showDonation, donationConfig.displayDuration]);

  // cleanup
  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  if (!activeDonation) return null;

  if (donationConfig.style === 'banner') {
    return (
      <div className="fixed left-0 right-0 top-0 p-4">
        <BannerAlert donation={activeDonation} onHide={() => setActiveDonation(null)} />
      </div>
    );
  }

  if (donationConfig.style === 'card') {
    return (
      <div className="fixed right-6 top-24">
        <CardAlert donation={activeDonation} />
      </div>
    );
  }

  // goal 스타일 — 목표 금액 기반 진행바
  const goalAmount = donationConfig.goalAmount ?? 500000;
  const progressPct = Math.min((activeDonation.data.amount / goalAmount) * 100, 100);

  return (
    <div className="fixed right-4 top-20 w-[320px] space-y-4">
      <div className="rounded-3xl border border-white/10 bg-black/70 p-5 backdrop-blur-sm">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#79d9ff]">
          Goal Mission
        </div>
        {donationConfig.goalLabel && (
          <div className="mt-1 text-sm text-white/70">{donationConfig.goalLabel}</div>
        )}
        <div className="mt-2 text-lg font-semibold text-white">
          {progressPct.toFixed(0)}% 달성
        </div>
        <div className="mt-4 h-3 rounded-full bg-white/10">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-[#38bdf8] to-[#7dd3fc] transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-white/75">
          <span>{activeDonation.data.amount.toLocaleString()} / {goalAmount.toLocaleString()}</span>
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-black/55 px-4 py-3 backdrop-blur-sm">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">Recent Support</div>
        <div className="mt-2 flex items-center justify-between text-sm text-white">
          <span>{activeDonation.data.donor_nickname}님</span>
          <span className="font-semibold text-[#79d9ff]">+{activeDonation.data.amount.toLocaleString()}</span>
        </div>
        {activeDonation.data.message && (
          <div className="mt-1 text-xs text-white/60">&quot;{activeDonation.data.message}&quot;</div>
        )}
      </div>
    </div>
  );
}
