export type WidgetChatStyle = 'default' | 'gradient';
export type WidgetGoalStyle = 'goal_bar' | 'goal_ring' | 'goal_step';
export type WidgetRankingStyle = 'list' | 'podium';
export type WidgetFontSize = number;
export type WidgetType = 'CHAT' | 'GOAL' | 'RANKING';

export interface WidgetChatConfig {
  style: WidgetChatStyle;
  maxMessages: number;
  showProfileImage: boolean;
  fontSize: WidgetFontSize;
  showUserId: boolean;
}

export interface WidgetGoalConfig {
  style: WidgetGoalStyle;
  goalAmount: number | null;
  goalLabel: string | null;
  bgOpacity: number;
  fontSize: WidgetFontSize;
  animationType: string;
}

export interface WidgetRankingConfig {
  style: WidgetRankingStyle;
  displayCount: number;
}

export interface WidgetTokenInfo {
  token: string;
  widgetType: WidgetType;
  widgetUrl: string;
  previewUrl: string;
  config: WidgetChatConfig | WidgetGoalConfig;
}

// OBS용 공개 조회 응답
export interface WidgetConfigResponse {
  widgetType: WidgetType;
  broadcasterId: string;
  config: WidgetChatConfig | WidgetGoalConfig;
}

