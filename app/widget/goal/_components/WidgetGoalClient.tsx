'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { DonationMessage } from '@/app/_types';
import { WidgetGoalConfig } from '@/app/_types/widget';

interface OverlayEvent {
  op: string;
  broadcaster_id: string;
  payload: DonationMessage;
}

const MOCK_DONATIONS: DonationMessage[] = [
  { type: 'donation', amount: 30000, donor_nickname: '별빛고양이', message: '오늘도 파이팅!' },
  { type: 'donation', amount: 50000, donor_nickname: '감자별', message: '목표 달성 응원합니다' },
  { type: 'donation', amount: 20000, donor_nickname: '도리토스', message: '화이팅!' },
];

interface WidgetGoalClientProps {
  token: string;
  goalConfig: WidgetGoalConfig;
  isDev: boolean;
}

function GoalBar({ total, goalConfig }: { total: number; goalConfig: WidgetGoalConfig }) {
  const goalAmount = goalConfig.goalAmount ?? 500000;
  const pct = Math.min((total / goalAmount) * 100, 100);

  return (
    <div className="absolute right-4 top-20 w-[320px] space-y-3">
      <div
        className="rounded-3xl border border-white/10 p-5 backdrop-blur-sm"
        style={{ backgroundColor: `rgba(0,0,0,${goalConfig.bgOpacity / 100})` }}
      >
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#79d9ff]">
          Goal Mission
        </div>
        {goalConfig.goalLabel && (
          <div className="mt-1 text-sm text-white/70">{goalConfig.goalLabel}</div>
        )}
        <div className="mt-2 text-3xl font-bold text-[#7dd3fc]">{pct.toFixed(0)}%</div>
        <div className="mt-3 h-3 rounded-full bg-white/10">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-[#38bdf8] to-[#7dd3fc] transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-white/70">
          <span>{total.toLocaleString()}원</span>
          <span className="text-white/50">/ {goalAmount.toLocaleString()}원</span>
        </div>
        <div className="mt-1 text-right text-xs text-white/40">
          남은 금액 {Math.max(goalAmount - total, 0).toLocaleString()}원
        </div>
      </div>
    </div>
  );
}

function GoalRing({ total, goalConfig }: { total: number; goalConfig: WidgetGoalConfig }) {
  const goalAmount = goalConfig.goalAmount ?? 500000;
  const pct = Math.min((total / goalAmount) * 100, 100);

  return (
    <div
      className="absolute right-4 top-16 w-[300px] rounded-3xl border border-white/10 p-6 backdrop-blur-sm"
      style={{ backgroundColor: `rgba(0,0,0,${goalConfig.bgOpacity / 100})` }}
    >
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a78bfa]">
        Goal Mission
      </div>
      {goalConfig.goalLabel && (
        <div className="mt-1 text-sm font-medium text-white/80">{goalConfig.goalLabel}</div>
      )}
      <div className="mt-5 flex items-center gap-5">
        <div className="relative flex-shrink-0">
          <div
            className="h-28 w-28 rounded-full"
            style={{
              background: `conic-gradient(#a78bfa 0% ${pct}%, rgba(255,255,255,0.08) ${pct}% 100%)`,
            }}
          />
          <div className="absolute inset-[10px] flex flex-col items-center justify-center rounded-full bg-black/70">
            <span className="text-2xl font-bold text-[#c4b5fd]">{pct.toFixed(0)}%</span>
            <span className="text-[10px] text-white/50">달성</span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <div>
            <div className="text-xs text-white/50">누적 후원</div>
            <div className="text-lg font-bold text-white">{total.toLocaleString()}원</div>
          </div>
          <div>
            <div className="text-xs text-white/50">목표 금액</div>
            <div className="text-base font-semibold text-[#c4b5fd]">{goalAmount.toLocaleString()}원</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoalStep({ total, goalConfig }: { total: number; goalConfig: WidgetGoalConfig }) {
  const goalAmount = goalConfig.goalAmount ?? 150000;
  const stepCount = 5;
  const steps = Array.from({ length: stepCount }, (_, i) => {
    const amount = Math.round((goalAmount / stepCount) * (i + 1));
    return { amount, reached: total >= amount };
  });
  const reachedCount = steps.filter((s) => s.reached).length;
  const nextStep = steps.find((s) => !s.reached);

  return (
    <div
      className="absolute bottom-6 left-1/2 w-[calc(100%-32px)] max-w-[400px] -translate-x-1/2 rounded-3xl border border-white/10 px-6 py-5 backdrop-blur-sm"
      style={{ backgroundColor: `rgba(0,0,0,${goalConfig.bgOpacity / 100})` }}
    >
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#86efac]">
          Step Mission
        </div>
        <div className="text-xs font-semibold text-[#86efac]">
          {reachedCount} / {steps.length} 달성
        </div>
      </div>
      {goalConfig.goalLabel && (
        <div className="mt-1 text-sm font-medium text-white/80">{goalConfig.goalLabel}</div>
      )}
      <div className="mt-4 flex items-center gap-1">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                step.reached
                  ? "bg-[#22c55e] text-white shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                  : "border border-white/20 bg-white/5 text-white/40"
              }`}
            >
              {step.reached ? "✓" : i + 1}
            </div>
            <span
              className={`text-[10px] font-semibold ${
                step.reached ? "text-[#86efac]" : "text-white/30"
              }`}
            >
              {(step.amount / 10000).toFixed(0)}만
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-white/60">
          현재 <span className="font-semibold text-white">{total.toLocaleString()}원</span>
        </span>
        {nextStep && (
          <span className="text-white/40">다음 목표: {nextStep.amount.toLocaleString()}원</span>
        )}
      </div>
    </div>
  );
}

export default function WidgetGoalClient({ token, goalConfig, isDev }: WidgetGoalClientProps) {
  const [total, setTotal] = useState(0);
  const socketRef = useRef<Socket | null>(null);

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
      if (event.op === 'donation') {
        setTotal((prev) => prev + event.payload.amount);
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, isDev]);

  useEffect(() => {
    if (!isDev) return;

    let index = 0;
    const interval = setInterval(() => {
      setTotal((prev) => prev + MOCK_DONATIONS[index % MOCK_DONATIONS.length].amount);
      index++;
    }, 2500);

    return () => clearInterval(interval);
  }, [isDev]);

  if (goalConfig.style === 'goal_bar') return <GoalBar total={total} goalConfig={goalConfig} />;
  if (goalConfig.style === 'goal_ring') return <GoalRing total={total} goalConfig={goalConfig} />;
  return <GoalStep total={total} goalConfig={goalConfig} />;
}
