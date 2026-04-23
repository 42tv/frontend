'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChatMessage } from '@/app/_types';

// ── Types ─────────────────────────────────────────────────────────────────

type DemoStyle =
  | 'float'
  | 'spotlight'
  | 'chyron'
  | 'pop'
  | 'gradient'
  | 'bottom';

interface TimedMessage extends ChatMessage {
  msgId: string;
  createdAt: number;
}

// ── Style metadata ────────────────────────────────────────────────────────

const STYLE_META: { id: DemoStyle; name: string; desc: string; size: string }[] = [
  { id: 'float',     name: '플로팅',       desc: '위로 떠오르다 서서히 사라짐',     size: '300 × 자유' },
  { id: 'spotlight', name: '스포트라이트', desc: '최신 메시지 하나를 크게 강조',     size: '380 × 자유' },
  { id: 'chyron',    name: '자막형',       desc: 'TV 뉴스 자막처럼 하단에 고정',    size: '전체 × 60' },
  { id: 'pop',       name: '팝업',         desc: '메시지가 알림처럼 팝업으로 등장', size: '300 × 자유' },
  { id: 'gradient',  name: '그라디언트',   desc: '유저 컬러로 물드는 컬러풀 카드',  size: '280 × 자유' },
  { id: 'bottom',    name: '바텀 스택',    desc: '하단 고정, 위로 갈수록 투명해짐', size: '300 × 자유' },
];

// ── Mock message pool ────────────────────────────────────────────────────

const POOL: ChatMessage[] = [
  { type: 'chat', user_idx: 1,  user_id: 'luna42',    nickname: '루나',       message: '오늘 방송 너무 재밌어요!',         profile_img: '', role: 'viewer',      grade: 'A',  color: '#ff7a45' },
  { type: 'chat', user_idx: 4,  user_id: 'bj_demo',   nickname: '방송자',     message: '다들 반가워요 🎉',                 profile_img: '', role: 'broadcaster', grade: 'BJ', color: '#f59e0b' },
  { type: 'chat', user_idx: 2,  user_id: 'soapple',   nickname: '사과맛캔디', message: '와 진짜 대박이다',                 profile_img: '', role: 'member',      grade: 'S',  color: '#2f9c95' },
  { type: 'chat', user_idx: 6,  user_id: 'gamer_x',   nickname: '게이머X',    message: '이 플레이 어떻게 한 거예요?',      profile_img: '', role: 'viewer',      grade: 'C',  color: '#8b5cf6' },
  { type: 'chat', user_idx: 3,  user_id: 'staff_a',   nickname: '스태프A',    message: '오늘 이벤트 잊지 마세요!',         profile_img: '', role: 'manager',     grade: 'M',  color: '#5b8dee' },
  { type: 'chat', user_idx: 5,  user_id: 'viewer99',  nickname: '별빛고양이', message: '방금 들어왔는데 분위기 좋다~',     profile_img: '', role: 'viewer',      grade: 'B',  color: '#ec4899' },
  { type: 'chat', user_idx: 7,  user_id: 'fan_love',  nickname: '진성팬',     message: '매일 챙겨봅니다 ㅠㅠ 최고예요',   profile_img: '', role: 'member',      grade: 'A',  color: '#06b6d4' },
  { type: 'chat', user_idx: 9,  user_id: 'pro',       nickname: '고인물',     message: '10년째 팬인데 오늘이 제일 재밌네', profile_img: '', role: 'member',      grade: 'S',  color: '#34d399' },
  { type: 'chat', user_idx: 8,  user_id: 'night_owl', nickname: '야행성',     message: '오늘도 늦게까지 달려요!',          profile_img: '', role: 'viewer',      grade: 'D',  color: '#a78bfa' },
  { type: 'chat', user_idx: 10, user_id: 'laugh_99',  nickname: '웃음99',     message: 'ㅋㅋㅋㅋ 진짜 미쳤다',            profile_img: '', role: 'viewer',      grade: 'B',  color: '#fb923c' },
  { type: 'chat', user_idx: 12, user_id: 'champ22',   nickname: '챔피언',     message: '오늘 우승 각이다! 믿어요',         profile_img: '', role: 'member',      grade: 'A',  color: '#fbbf24' },
  { type: 'chat', user_idx: 11, user_id: 'newbie1',   nickname: '입문자',     message: '처음 왔는데 너무 재밌네요',        profile_img: '', role: 'viewer',      grade: 'F',  color: '#94a3b8' },
];

const MAX_VISIBLE = 7;
const FLOAT_LIFETIME = 6000;
let counter = 0;

// ── Shared sub-components ─────────────────────────────────────────────────

function Avatar({ msg, size = 28 }: { msg: ChatMessage; size?: number }) {
  const label =
    msg.role === 'broadcaster' ? 'BJ' :
    msg.role === 'manager'     ? 'M'  :
    (msg.grade?.charAt(0).toUpperCase() ?? '?');
  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white"
      style={{
        width: size, height: size,
        fontSize: size * 0.32,
        background: `linear-gradient(135deg, ${msg.color}cc, ${msg.color}55)`,
        boxShadow: `0 0 6px ${msg.color}44`,
      }}
    >
      {label}
    </div>
  );
}

function Badge({ role }: { role: ChatMessage['role'] }) {
  if (role === 'broadcaster') return <span className="rounded-sm px-1 py-0.5 text-[8px] font-bold bg-red-500/80 text-white leading-none">BJ</span>;
  if (role === 'manager')     return <span className="rounded-sm px-1 py-0.5 text-[8px] font-bold bg-blue-500/80 text-white leading-none">MOD</span>;
  return null;
}

// ── ★ 새 스타일 렌더러 ─────────────────────────────────────────────────────

// 1. Spotlight — 최신 메시지 하나를 크게 강조
function SpotlightWidget({ messages }: { messages: TimedMessage[] }) {
  const m = messages[messages.length - 1];
  if (!m) return null;
  return (
    <div
      className="w-[380px] p-6 rounded-3xl text-center"
      style={{
        background: `radial-gradient(ellipse at top, ${m.color}22 0%, rgba(0,0,0,.82) 70%)`,
        border: `1px solid ${m.color}33`,
        boxShadow: `0 0 40px ${m.color}18, 0 8px 32px rgba(0,0,0,.5)`,
        backdropFilter: 'blur(20px)',
      }}
    >
      <Avatar msg={m} size={52} />
      <div className="mt-3 flex items-center justify-center gap-2">
        <span className="text-base font-bold" style={{ color: m.color }}>{m.nickname}</span>
        <Badge role={m.role} />
      </div>
      <div
        className="mt-3 text-[15px] text-white/90 leading-relaxed"
        style={{ textShadow: '0 1px 6px rgba(0,0,0,.6)' }}
      >
        &ldquo;{m.message}&rdquo;
      </div>
      <div className="mt-4 h-[1px] rounded-full mx-8" style={{ background: `linear-gradient(90deg, transparent, ${m.color}55, transparent)` }} />
    </div>
  );
}

// 2. Chyron — TV 뉴스 자막형 (하단 전체)
function ChyronWidget({ messages }: { messages: TimedMessage[] }) {
  const m = messages[messages.length - 1];
  if (!m) return (
    <div className="w-full h-[60px] flex items-center px-8" style={{ background: 'rgba(0,0,0,.85)' }}>
      <span className="text-white/20 text-sm">대기 중...</span>
    </div>
  );
  return (
    <div className="w-full flex items-stretch overflow-hidden" style={{ height: 60 }}>
      {/* 컬러 태그 */}
      <div
        className="flex-shrink-0 flex items-center justify-center px-5 text-black font-black text-xs uppercase tracking-widest"
        style={{ background: m.color, minWidth: 90 }}
      >
        CHAT
      </div>
      {/* 닉네임 영역 */}
      <div
        className="flex-shrink-0 flex items-center px-5 gap-2"
        style={{ background: `${m.color}22`, borderRight: `1px solid ${m.color}44` }}
      >
        <Avatar msg={m} size={26} />
        <span className="font-bold text-sm whitespace-nowrap" style={{ color: m.color }}>{m.nickname}</span>
        <Badge role={m.role} />
      </div>
      {/* 메시지 */}
      <div
        className="flex-1 flex items-center px-6"
        style={{ background: 'rgba(0,0,0,.88)' }}
      >
        <span className="text-white text-[15px] leading-snug">{m.message}</span>
      </div>
    </div>
  );
}

// 3. Pop — 알림 팝업 (최신 메시지 한 개)
function PopWidget({ messages }: { messages: TimedMessage[] }) {
  const m = messages[messages.length - 1];
  if (!m) return null;
  return (
    <div
      key={m.msgId}
      className="w-[300px] flex gap-3 p-4 rounded-2xl"
      style={{
        background: 'rgba(14,14,24,.94)',
        backdropFilter: 'blur(24px)',
        border: `1px solid ${m.color}33`,
        boxShadow: `0 8px 32px rgba(0,0,0,.55), 0 0 0 1px ${m.color}22, 0 0 24px ${m.color}14`,
      }}
    >
      <Avatar msg={m} size={38} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-sm font-bold" style={{ color: m.color }}>{m.nickname}</span>
          <Badge role={m.role} />
        </div>
        <div className="text-[13px] text-white/85 leading-snug break-words">{m.message}</div>
      </div>
      {/* 하단 컬러 바 */}
      <div
        className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full"
        style={{ background: `linear-gradient(90deg, ${m.color}, transparent)` }}
      />
    </div>
  );
}

// 4. Gradient — 유저 컬러 그라디언트 카드
function GradientWidget({ messages }: { messages: TimedMessage[] }) {
  return (
    <div className="flex flex-col gap-2 w-[280px]">
      {messages.map((m) => (
        <div
          key={m.msgId}
          className="px-3.5 py-2.5 rounded-xl"
          style={{
            background: `linear-gradient(135deg, ${m.color}30 0%, ${m.color}0a 100%)`,
            border: `1px solid ${m.color}44`,
            boxShadow: `0 4px 16px ${m.color}14`,
          }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Avatar msg={m} size={16} />
            <span className="text-[11px] font-bold" style={{ color: m.color }}>{m.nickname}</span>
            <Badge role={m.role} />
          </div>
          <div className="text-[13px] text-white/90 leading-snug break-words">{m.message}</div>
        </div>
      ))}
    </div>
  );
}

// 5. Bottom Stack — 하단 고정, 위로 갈수록 투명
function BottomWidget({ messages }: { messages: TimedMessage[] }) {
  const reversed = [...messages].reverse();
  const opacities = [1, 0.65, 0.38, 0.2, 0.1, 0.05];
  return (
    <div className="flex flex-col-reverse gap-1 w-[300px]">
      {reversed.map((m, i) => (
        <div
          key={m.msgId}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{
            background: `rgba(0,0,0,${Math.max(0.55 - i * 0.08, 0.1)})`,
            border: `1px solid rgba(255,255,255,${Math.max(0.07 - i * 0.01, 0)})`,
            opacity: opacities[i] ?? 0,
          }}
        >
          {i === 0 && <Avatar msg={m} size={16} />}
          <span
            className="text-[11px] font-bold flex-shrink-0"
            style={{ color: i === 0 ? m.color : 'rgba(255,255,255,0.6)' }}
          >
            {m.nickname}
          </span>
          <span className="text-[13px] text-white/85 break-words leading-snug">{m.message}</span>
        </div>
      ))}
    </div>
  );
}

// ── 기존 스타일 렌더러 ────────────────────────────────────────────────────

function FloatWidget({ messages }: { messages: TimedMessage[] }) {
  const reversed = [...messages].reverse();
  return (
    <div className="flex flex-col-reverse gap-1.5 w-[300px]">
      {reversed.map((m, i) => {
        const age = Date.now() - m.createdAt;
        const opacity = age > FLOAT_LIFETIME * 0.65
          ? Math.max(0, 1 - (age - FLOAT_LIFETIME * 0.65) / (FLOAT_LIFETIME * 0.35))
          : 1;
        return (
          <div
            key={m.msgId}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{
              background: 'rgba(0,0,0,.55)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,.07)',
              opacity,
              transform: `translateY(${-i * 2}px)`,
              transition: 'opacity 0.4s',
            }}
          >
            <Avatar msg={m} size={18} />
            <span className="text-[11px] font-bold flex-shrink-0" style={{ color: m.color }}>{m.nickname}</span>
            <Badge role={m.role} />
            <span className="text-[13px] text-white/85 break-words">{m.message}</span>
          </div>
        );
      })}
    </div>
  );
}


// ── Widget position ───────────────────────────────────────────────────────

function WidgetPosition({ style, children }: { style: DemoStyle; children: React.ReactNode }) {
  const base = 'absolute pointer-events-none';
  const positions: Record<DemoStyle, string> = {
    float:     `${base} bottom-24 right-6`,
    spotlight: `${base} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`,
    chyron:    `${base} bottom-14 left-0 right-0`,
    pop:       `${base} top-8 right-6`,
    gradient:  `${base} top-8 right-6`,
    bottom:    `${base} bottom-24 right-6`,
  };
  return <div className={positions[style]}>{children}</div>;
}

// ── Main demo page ────────────────────────────────────────────────────────

export default function WidgetChatDemoPage() {
  const [activeStyle, setActiveStyle] = useState<DemoStyle>('float');
  const [messages, setMessages] = useState<TimedMessage[]>([]);
  const [tick, setTick] = useState(0);

  // 1.5초마다 새 메시지 추가
  useEffect(() => {
    const id = setInterval(() => {
      const base = POOL[counter % POOL.length];
      counter++;
      const newMsg: TimedMessage = { ...base, msgId: `${Date.now()}-${counter}`, createdAt: Date.now() };
      setMessages((prev) => {
        const next = [...prev, newMsg];
        return next.length > MAX_VISIBLE ? next.slice(next.length - MAX_VISIBLE) : next;
      });
    }, 1500);
    return () => clearInterval(id);
  }, []);

  // float / slide 계열: 오래된 메시지 제거 + opacity 재계산
  useEffect(() => {
    if (activeStyle !== 'float') return;
    const id = setInterval(() => {
      setMessages((prev) => prev.filter((m) => Date.now() - m.createdAt < FLOAT_LIFETIME));
      setTick((t) => t + 1);
    }, 300);
    return () => clearInterval(id);
  }, [activeStyle]);

  // 스타일 변경 시 메시지 초기화
  const handleStyleChange = useCallback((s: DemoStyle) => {
    setActiveStyle(s);
    setMessages([]);
    counter = 0;
  }, []);

  const meta = STYLE_META.find((s) => s.id === activeStyle)!;

  function renderWidget() {
    switch (activeStyle) {
      case 'float':     return <FloatWidget     messages={messages} key={tick} />;
      case 'spotlight': return <SpotlightWidget messages={messages} />;
      case 'chyron':    return <ChyronWidget    messages={messages} />;
      case 'pop':       return <PopWidget       messages={messages} />;
      case 'gradient':  return <GradientWidget  messages={messages} />;
      case 'bottom':    return <BottomWidget    messages={messages} />;
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden select-none" style={{ background: '#08090e' }}>

      {/* 배경 — 스트리밍 화면 시뮬레이션 */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 38%, #1a1f35 0%, #08090e 70%)' }} />
      <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,.5) 39px,rgba(255,255,255,.5) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,255,255,.5) 39px,rgba(255,255,255,.5) 40px)' }} />

      {/* 가짜 HUD */}
      <div className="absolute top-4 left-4 flex items-center gap-2 opacity-25">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-white text-xs font-mono tracking-widest">LIVE</span>
      </div>
      <div className="absolute top-4 right-[340px] opacity-[0.12] font-mono text-xs text-right leading-5">
        <div className="text-white/60">SCORE <span className="text-white font-bold">48,200</span></div>
        <div className="text-white/60">LEVEL <span className="text-white font-bold">23</span></div>
        <div className="text-white/60">HP    <span className="text-green-400 font-bold">███░░</span></div>
      </div>

      {/* 위젯 오버레이 */}
      <WidgetPosition style={activeStyle}>
        {renderWidget()}
      </WidgetPosition>

      {/* 하단 컨트롤 패널 */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10"
        style={{
          background: 'linear-gradient(0deg, rgba(0,0,0,.96) 0%, rgba(0,0,0,.75) 100%)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,.06)',
        }}
      >
        {/* 현재 스타일 정보 */}
        <div className="flex items-center justify-between px-6 pt-3 pb-2">
          <div className="flex items-center gap-3">
            <span className="text-white font-semibold">{meta.name}</span>
            <span className="text-white/35 text-sm">{meta.desc}</span>
          </div>
          <span className="text-white/20 text-xs font-mono">{meta.size}</span>
        </div>

        {/* 스타일 버튼 */}
        <div className="flex gap-2 px-6 pb-4">
          {STYLE_META.map((s) => (
            <button
              key={s.id}
              onClick={() => handleStyleChange(s.id)}
              className="flex-shrink-0 flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer"
              style={
                s.id === activeStyle
                  ? { background: 'rgba(255,255,255,.13)', border: '1px solid rgba(255,255,255,.24)', boxShadow: '0 0 16px rgba(255,255,255,.06)' }
                  : { background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }
              }
            >
              <span className={`text-sm font-semibold ${s.id === activeStyle ? 'text-white' : 'text-white/50'}`}>{s.name}</span>
              <span className={`text-[10px] text-center leading-tight ${s.id === activeStyle ? 'text-white/55' : 'text-white/22'}`}>{s.desc}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
