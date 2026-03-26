import axiosInstance from './auto_refresh_axios';
import {
  WidgetTokenInfo,
  WidgetChatConfig,
  WidgetDonationConfig,
  WidgetConfigResponse,
} from '@/app/_types/widget';

const BACKEND_ORIGIN = `http://${process.env.NEXT_PUBLIC_BACKEND}:${process.env.NEXT_PUBLIC_BACKEND_PORT}`;

// 서버 컴포넌트용 — Next.js rewrite를 거치지 않으므로 백엔드에 직접 요청 (인증 불필요)
export async function getWidgetConfig(token: string): Promise<WidgetConfigResponse | null> {
  const res = await fetch(`${BACKEND_ORIGIN}/widget/config/${token}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

// 대시보드 호출용 — 인증 필요
export async function getMyWidgets(): Promise<WidgetTokenInfo[]> {
  const res = await axiosInstance.get('/api/widget/my');
  return res.data;
}

export async function createWidgetToken(widgetType: 'CHAT' | 'DONATION'): Promise<WidgetTokenInfo> {
  const res = await axiosInstance.post('/api/widget', { widgetType });
  return res.data;
}

export async function updateChatConfig(token: string, config: WidgetChatConfig): Promise<void> {
  await axiosInstance.put(`/api/widget/${token}/chat-config`, config);
}

export async function updateDonationConfig(token: string, config: WidgetDonationConfig): Promise<void> {
  await axiosInstance.put(`/api/widget/${token}/donation-config`, config);
}
