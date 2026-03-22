export type WidgetChatStyle = 'compact' | 'bubble' | 'notice';
export type WidgetFontSize = 'sm' | 'md' | 'lg';

export interface WidgetConfig {
  broadcasterId: string;
  style: WidgetChatStyle;
  maxMessages: number;
  showProfileImage: boolean;
  fontSize: WidgetFontSize;
  bgOpacity: number; // 0-100
}
