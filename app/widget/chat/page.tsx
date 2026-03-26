import { WidgetChatConfig } from '@/app/_types/widget';
import { getWidgetConfig } from '@/app/_apis/widget';
import WidgetChatClient from './_components/WidgetChatClient';

interface PageProps {
  searchParams: Promise<{
    token?: string;
  }>;
}

const DEFAULT_CHAT_CONFIG: WidgetChatConfig = {
  style: 'gradient',
  maxMessages: 5,
  showProfileImage: true,
  fontSize: 'sm',
  bgOpacity: 55,
  bgColor: '#000000',
  fontColor: '#ffffff',
  messageDuration: 5000,
  showBadges: true,
};

export default async function WidgetChatPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = params.token;

  if (!token) {
    return (
      <div className="m-4 rounded-xl border border-white/20 bg-black/70 p-4 text-sm text-white backdrop-blur-sm">
        <div className="font-semibold text-yellow-400">⚠️ 파라미터 누락</div>
        <div className="mt-1 text-white/70">
          URL에 <code className="rounded bg-white/10 px-1">token</code> 파라미터가 필요합니다.
        </div>
        <div className="mt-2 text-xs text-white/50">
          예시: /widget/chat?token=01ARZ3NDEKTSV4RRFFQ69G5FAV
        </div>
      </div>
    );
  }

  const widgetData = await getWidgetConfig(token);

  if (!widgetData) {
    return (
      <div className="m-4 rounded-xl border border-white/20 bg-black/70 p-4 text-sm text-white backdrop-blur-sm">
        <div className="font-semibold text-red-400">⚠️ 위젯을 찾을 수 없습니다.</div>
        <div className="mt-1 text-white/70">유효하지 않은 토큰이거나 삭제된 위젯입니다.</div>
      </div>
    );
  }

  const chatConfig = widgetData.chatConfig ?? DEFAULT_CHAT_CONFIG;

  return <WidgetChatClient token={token} chatConfig={chatConfig} />;
}
