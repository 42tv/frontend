export type WidgetChatStyle = 'compact' | 'gradient';
export type WidgetDonationStyle = 'banner' | 'card' | 'goal';
export type WidgetFontSize = 'sm' | 'md' | 'lg';
export type WidgetType = 'CHAT' | 'DONATION';

export interface WidgetChatConfig {
  style: WidgetChatStyle;
  maxMessages: number;
  showProfileImage: boolean;
  fontSize: WidgetFontSize;
  bgOpacity: number;
  bgColor: string;
  fontColor: string;
  messageDuration: number;
  showBadges: boolean;
  showUserId: boolean;
}

export interface WidgetDonationConfig {
  style: WidgetDonationStyle;
  minDisplayAmount: number;
  displayDuration: number;
  goalAmount: number | null;
  goalLabel: string | null;
  bgOpacity: number;
  fontSize: WidgetFontSize;
  animationType: string;
  soundEnabled: boolean;
}

export interface WidgetTokenInfo {
  token: string;
  widgetType: WidgetType;
  widgetUrl: string;
  previewUrl: string;
  chatConfig?: WidgetChatConfig;
  donationConfig?: WidgetDonationConfig;
}

// OBS용 공개 조회 응답
export interface WidgetConfigResponse {
  widgetType: WidgetType;
  broadcasterId: string;
  chatConfig?: WidgetChatConfig;
  donationConfig?: WidgetDonationConfig;
}

