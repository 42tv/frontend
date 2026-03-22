import { WidgetConfig, WidgetChatStyle, WidgetFontSize } from '@/app/_types/widget';
import WidgetChatClient from './_components/WidgetChatClient';

interface PageProps {
  searchParams: Promise<{
    broadcasterId?: string;
    style?: string;
    maxMessages?: string;
    showProfileImage?: string;
    fontSize?: string;
    bgOpacity?: string;
    dev?: string;
  }>;
}

function parseConfig(params: Awaited<PageProps['searchParams']>): WidgetConfig | null {
  const broadcasterId = params.broadcasterId;
  if (!broadcasterId) return null;

  const validStyles: WidgetChatStyle[] = ['compact', 'bubble', 'notice'];
  const validFontSizes: WidgetFontSize[] = ['sm', 'md', 'lg'];

  const style = (params.style as WidgetChatStyle) || 'compact';
  const maxMessages = Math.min(Math.max(parseInt(params.maxMessages ?? '5', 10), 1), 30);
  const showProfileImage = params.showProfileImage !== 'false';
  const fontSize = (params.fontSize as WidgetFontSize) || 'sm';
  const bgOpacity = Math.min(Math.max(parseInt(params.bgOpacity ?? '55', 10), 0), 100);

  return {
    broadcasterId,
    style: validStyles.includes(style) ? style : 'compact',
    maxMessages,
    showProfileImage,
    fontSize: validFontSizes.includes(fontSize) ? fontSize : 'sm',
    bgOpacity,
  };
}

export default async function WidgetChatPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const config = parseConfig(params);
  const isDev = params.dev === 'true';

  if (!config) {
    return (
      <div className="m-4 rounded-xl border border-white/20 bg-black/70 p-4 text-sm text-white backdrop-blur-sm">
        <div className="font-semibold text-yellow-400">⚠️ 파라미터 누락</div>
        <div className="mt-1 text-white/70">
          URL에 <code className="rounded bg-white/10 px-1">broadcasterId</code> 파라미터가 필요합니다.
        </div>
        <div className="mt-2 text-xs text-white/50">
          예시: /widget/chat?broadcasterId=yourId&amp;dev=true
        </div>
      </div>
    );
  }

  return <WidgetChatClient config={config} isDev={isDev} />;
}
