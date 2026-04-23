import axiosInstance from './auto_refresh_axios';
import {
  WidgetTokenInfo,
  WidgetChatConfig,
  WidgetGoalConfig,
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

export async function updateChatConfig(config: WidgetChatConfig): Promise<void> {
  await axiosInstance.put('/api/widget/chat-config', {
    style: config.style,
    max_messages: config.maxMessages,
    show_profile_image: config.showProfileImage,
    font_size: config.fontSize,
    show_user_id: config.showUserId,
  });
}

export async function updateGoalConfig(config: WidgetGoalConfig): Promise<void> {
  await axiosInstance.put('/api/widget/goal-config', {
    style: config.style,
    goal_amount: config.goalAmount,
    goal_label: config.goalLabel,
    bg_opacity: config.bgOpacity,
    font_size: config.fontSize,
    animation_type: config.animationType,
  });
}
