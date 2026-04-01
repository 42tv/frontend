'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { DonationMessage } from '@/app/_types';
import { WidgetGoalConfig } from '@/app/_types/widget';

// 기준: 1280px 뷰포트에서 1em = 16px
// 뷰포트가 커질수록 em 기준이 커져 모든 요소가 비례 확대
const BASE_FONT = '2.8vw';

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
    <div style={{ fontSize: BASE_FONT, width: '20em' }}>
      <div
        className="border border-white/10 backdrop-blur-sm"
        style={{
          borderRadius: '1.5em',
          padding: '1.25em',
          backgroundColor: `rgba(0,0,0,${goalConfig.bgOpacity / 100})`,
        }}
      >
        <div className="font-semibold uppercase text-[#79d9ff]" style={{ fontSize: '0.75em', letterSpacing: '0.16em' }}>
          Goal Mission
        </div>
        {goalConfig.goalLabel && (
          <div className="text-white/70" style={{ marginTop: '0.25em', fontSize: '0.875em' }}>
            {goalConfig.goalLabel}
          </div>
        )}
        <div className="font-bold text-[#7dd3fc]" style={{ marginTop: '0.5em', fontSize: '1.875em' }}>
          {pct.toFixed(0)}%
        </div>
        <div className="bg-white/10" style={{ marginTop: '0.75em', height: '0.75em', borderRadius: '9999px' }}>
          <div
            className="bg-gradient-to-r from-[#38bdf8] to-[#7dd3fc] transition-all duration-700"
            style={{ height: '0.75em', width: `${pct}%`, borderRadius: '9999px' }}
          />
        </div>
        <div className="flex items-center justify-between text-white/70" style={{ marginTop: '0.75em', fontSize: '0.875em' }}>
          <span>{total.toLocaleString()}원</span>
          <span className="text-white/50">/ {goalAmount.toLocaleString()}원</span>
        </div>
        <div className="text-right text-white/40" style={{ marginTop: '0.25em', fontSize: '0.625em' }}>
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
      className="border border-white/10 backdrop-blur-sm"
      style={{
        fontSize: BASE_FONT,
        width: '18.75em',
        borderRadius: '1.5em',
        padding: '1.5em',
        backgroundColor: `rgba(0,0,0,${goalConfig.bgOpacity / 100})`,
      }}
    >
      <div className="font-semibold uppercase text-[#a78bfa]" style={{ fontSize: '0.75em', letterSpacing: '0.16em' }}>
        Goal Mission
      </div>
      {goalConfig.goalLabel && (
        <div className="font-medium text-white/80" style={{ marginTop: '0.25em', fontSize: '0.875em' }}>
          {goalConfig.goalLabel}
        </div>
      )}
      <div className="flex items-center" style={{ marginTop: '1.25em', gap: '1.25em' }}>
        <div className="relative flex-shrink-0">
          <div
            style={{
              height: '7em',
              width: '7em',
              borderRadius: '9999px',
              background: `conic-gradient(#a78bfa 0% ${pct}%, rgba(255,255,255,0.08) ${pct}% 100%)`,
            }}
          />
          <div
            className="absolute flex flex-col items-center justify-center bg-black/70"
            style={{ inset: '0.625em', borderRadius: '9999px' }}
          >
            <span className="font-bold text-[#c4b5fd]" style={{ fontSize: '1.5em' }}>
              {pct.toFixed(0)}%
            </span>
            <span className="text-white/50" style={{ fontSize: '0.625em' }}>달성</span>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5em' }}>
          <div>
            <div className="text-white/50" style={{ fontSize: '0.75em' }}>누적 후원</div>
            <div className="font-bold text-white" style={{ fontSize: '1.125em' }}>{total.toLocaleString()}원</div>
          </div>
          <div>
            <div className="text-white/50" style={{ fontSize: '0.75em' }}>목표 금액</div>
            <div className="font-semibold text-[#c4b5fd]" style={{ fontSize: '1em' }}>{goalAmount.toLocaleString()}원</div>
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
      className="border border-white/10 backdrop-blur-sm"
      style={{
        fontSize: BASE_FONT,
        width: '31.25em',
        borderRadius: '1.5em',
        paddingLeft: '1.5em',
        paddingRight: '1.5em',
        paddingTop: '1.25em',
        paddingBottom: '1.25em',
        backgroundColor: `rgba(0,0,0,${goalConfig.bgOpacity / 100})`,
      }}
    >
      <div className="flex items-center justify-between">
        <div className="font-semibold uppercase text-[#86efac]" style={{ fontSize: '0.75em', letterSpacing: '0.16em' }}>
          Step Mission
        </div>
        <div className="font-semibold text-[#86efac]" style={{ fontSize: '0.75em' }}>
          {reachedCount} / {steps.length} 달성
        </div>
      </div>
      {goalConfig.goalLabel && (
        <div className="font-medium text-white/80" style={{ marginTop: '0.25em', fontSize: '0.875em' }}>
          {goalConfig.goalLabel}
        </div>
      )}
      <div className="flex items-center" style={{ marginTop: '1em', gap: '0.25em' }}>
        {steps.map((step, i) => (
          <div key={i} className="relative flex flex-1 flex-col items-center" style={{ gap: '0.375em' }}>
            <div
              className={`flex items-center justify-center font-bold transition-all ${
                step.reached
                  ? 'bg-[#22c55e] text-white shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                  : 'border border-white/20 bg-white/5 text-white/40'
              }`}
              style={{ height: '2em', width: '2em', borderRadius: '9999px', fontSize: '0.75em' }}
            >
              {step.reached ? '✓' : i + 1}
            </div>
            <span
              className={`font-semibold ${step.reached ? 'text-[#86efac]' : 'text-white/30'}`}
              style={{ fontSize: '0.625em' }}
            >
              {(step.amount / 10000).toFixed(0)}만
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between" style={{ marginTop: '1em', fontSize: '0.875em' }}>
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

  const widget =
    goalConfig.style === 'goal_bar' ? <GoalBar total={total} goalConfig={goalConfig} /> :
    goalConfig.style === 'goal_ring' ? <GoalRing total={total} goalConfig={goalConfig} /> :
    <GoalStep total={total} goalConfig={goalConfig} />;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {widget}
    </div>
  );
}
