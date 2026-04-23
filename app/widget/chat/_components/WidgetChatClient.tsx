'use client';

import { WidgetChatConfig } from '@/app/_types/widget';
import { useWidgetSocket } from '../_hooks/useWidgetSocket';
import WidgetChatList from './WidgetChatList';

interface WidgetChatClientProps {
  token: string;
  chatConfig: WidgetChatConfig;
}

export default function WidgetChatClient({ token, chatConfig }: WidgetChatClientProps) {
  const { messages, status, errorMessage } = useWidgetSocket(token, chatConfig.maxMessages);

  if (status === 'error') {
    return (
      <div className="m-4 rounded-xl border border-red-500/30 bg-red-950/70 p-4 text-sm text-white backdrop-blur-sm">
        <div className="font-semibold text-red-400">⚠️ 연결 오류</div>
        <div className="mt-1 text-white/70">{errorMessage}</div>
      </div>
    );
  }

  return (
    <div className="p-3 w-full">
      <WidgetChatList messages={messages} config={chatConfig} />
    </div>
  );
}
