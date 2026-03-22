'use client';

import { useState, useEffect } from 'react';
import { ChatMessage } from '@/app/_types';
import { WidgetConfig } from '@/app/_types/widget';
import { useWidgetSocket } from '../_hooks/useWidgetSocket';
import WidgetChatList from './WidgetChatList';

const ALL_MOCK_MESSAGES: ChatMessage[] = [
  {
    type: 'chat', user_idx: 1, user_id: 'luna42', nickname: '루나',
    message: '오늘 방송 너무 재밌어요!', profile_img: '', role: 'viewer', grade: 'A', color: '#ff7a45',
  },
  {
    type: 'chat', user_idx: 2, user_id: 'soapple', nickname: '사과맛캔디',
    message: '채팅 위젯 진짜 예쁘다 ㅠㅠ', profile_img: '', role: 'member', grade: 'S', color: '#2f9c95',
  },
  {
    type: 'chat', user_idx: 3, user_id: 'managerA', nickname: '스태프A',
    message: '다들 반갑습니다 👋', profile_img: '', role: 'manager', grade: 'M', color: '#5b8dee',
  },
  {
    type: 'chat', user_idx: 4, user_id: 'broadcaster1', nickname: '방송자',
    message: '오늘도 잘 부탁드립니다 🎉', profile_img: '', role: 'broadcaster', grade: 'BJ', color: '#f59e0b',
  },
  {
    type: 'chat', user_idx: 5, user_id: 'viewer99', nickname: '별빛고양이',
    message: '방금 들어왔어요~ 방송 잘 보겠습니다', profile_img: '', role: 'viewer', grade: 'B', color: '#ec4899',
  },
];

function useDevMessages(enabled: boolean, maxMessages: number) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!enabled) return;

    // 0.7초 간격으로 한 개씩 추가 → 애니메이션 체감
    ALL_MOCK_MESSAGES.forEach((msg, i) => {
      const timer = setTimeout(() => {
        setMessages((prev) => {
          const next = [...prev, msg];
          return next.length > maxMessages ? next.slice(next.length - maxMessages) : next;
        });
      }, i * 700);
      return timer;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return messages;
}

interface WidgetChatClientProps {
  config: WidgetConfig;
  isDev: boolean;
}

export default function WidgetChatClient({ config, isDev }: WidgetChatClientProps) {
  const { messages: liveMessages, status, errorMessage } = useWidgetSocket(
    config.broadcasterId,
    config.maxMessages
  );
  const devMessages = useDevMessages(isDev, config.maxMessages);

  const messages = isDev ? devMessages : liveMessages;

  if (!isDev && status === 'error') {
    return (
      <div className="m-4 rounded-xl border border-red-500/30 bg-red-950/70 p-4 text-sm text-white backdrop-blur-sm">
        <div className="font-semibold text-red-400">⚠️ 연결 오류</div>
        <div className="mt-1 text-white/70">{errorMessage}</div>
      </div>
    );
  }

  if (!isDev && (status === 'idle' || status === 'connecting')) {
    return (
      <div className="m-4 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-xs text-white/50 backdrop-blur-sm">
        연결 중...
      </div>
    );
  }

  return (
    <div className="p-3 w-full">
      <WidgetChatList messages={messages} config={config} />
    </div>
  );
}
