import { WidgetChatStyle, WidgetGoalStyle } from "@/app/_types/widget";

export type ChatOption = {
  id: WidgetChatStyle;
  name: string;
  badge: string;
  description: string;
  useCase: string;
  size: string;
  position: string;
};

export type SupportOption = {
  id: WidgetGoalStyle;
  name: string;
  badge: string;
  description: string;
  useCase: string;
  size: string;
  position: string;
};

export type CompactMsg = {
  id: number;
  nickname: string;
  user: string;
  message: string;
  color: string;
  grade: string;
};

export type GradientMsg = {
  id: number;
  nickname: string;
  user: string;
  message: string;
  color: string;
};
