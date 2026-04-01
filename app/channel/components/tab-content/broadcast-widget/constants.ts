import { WidgetChatConfig, WidgetGoalConfig, WidgetType } from "@/app/_types/widget";
import { ChatOption, SupportOption, CompactMsg, GradientMsg } from "./types";

const WIDGET_BASE = 'http://localhost:3001';

const WIDGET_PATH: Record<WidgetType, string> = {
  CHAT: '/widget/chat',
  GOAL: '/widget/goal',
  RANKING: '/widget/ranking',
};

export function buildWidgetUrl(widgetType: WidgetType, token: string) {
  return `${WIDGET_BASE}${WIDGET_PATH[widgetType]}?token=${token}`;
}

export function buildPreviewUrl(widgetType: WidgetType, token: string) {
  return `${WIDGET_BASE}${WIDGET_PATH[widgetType]}?token=${token}&dev=true`;
}

export const DEFAULT_CHAT_CONFIG: WidgetChatConfig = {
  style: 'default',
  maxMessages: 5,
  showProfileImage: true,
  fontSize: 14,
  showUserId: true,
};

export const DEFAULT_GOAL_CONFIG: WidgetGoalConfig = {
  style: 'goal_bar',
  goalAmount: null,
  goalLabel: null,
  bgOpacity: 55,
  fontSize: 14,
  animationType: 'slide',
};


export const chatOptions: ChatOption[] = [
  {
    id: "default",
    name: "기본 카드",
    badge: "기본형",
    description: "작은 채팅 박스를 여러 줄로 쌓아 방송 화면을 많이 가리지 않습니다.",
    useCase: "게임, 캠 방송처럼 메인 화면 집중도가 중요한 방송",
    size: "300 x 420",
    position: "우측 상단",
  },
  {
    id: "gradient",
    name: "그래디언트",
    badge: "컬러형",
    description: "유저 고유 색상으로 물드는 그래디언트 카드로 채팅에 생동감을 더합니다.",
    useCase: "소통 방송, 컬러풀한 분위기를 원하는 방송",
    size: "280 x 자유",
    position: "우측 상단",
  },
];

export const supportOptions: SupportOption[] = [
  {
    id: "goal_bar",
    name: "진행바형",
    badge: "기본형",
    description: "가로 진행 바로 목표 달성률을 직관적으로 보여줍니다. 누적 금액과 남은 금액을 함께 표시합니다.",
    useCase: "미션 방송, 공약 달성형 방송, 장기 이벤트",
    size: "340 x 220",
    position: "우측 중단",
  },
  {
    id: "goal_ring",
    name: "링 게이지형",
    badge: "원형형",
    description: "원형 링 게이지로 달성률을 시각적으로 표현합니다. 중앙에 퍼센트를 크게 표시해 눈에 띕니다.",
    useCase: "인터랙티브 방송, 시청자 참여 유도, 고급스러운 연출",
    size: "320 x 320",
    position: "우측 상단",
  },
  {
    id: "goal_step",
    name: "단계 달성형",
    badge: "단계형",
    description: "여러 단계 목표를 마일스톤으로 나열해 단계별 달성 현황을 보여줍니다.",
    useCase: "다단계 미션 방송, 등급별 공약 이벤트, 멀티 목표 방송",
    size: "380 x 180",
    position: "하단 중앙",
  },
];

export const COMPACT_MOCK: Omit<CompactMsg, 'id'>[] = [
  { nickname: "별빛사냥꾼", user: "42lover",      message: "오늘 텐션 좋네요",           color: "#ffb18d", grade: "A" },
  { nickname: "민지",       user: "minji_7",      message: "팬미팅 후기 풀어주세요",      color: "#7dd3fc", grade: "S" },
  { nickname: "보라티비",   user: "boraTV",       message: "배경음 너무 잘 어울려요",      color: "#86efac", grade: "B" },
  { nickname: "별을쫓는자", user: "star_chaser",  message: "방금 클립 저장했어요",         color: "#c4b5fd", grade: "A" },
  { nickname: "쿨가이",     user: "coolDude99",   message: "진짜 미쳤다 이 장면",         color: "#fda4af", grade: "B" },
  { nickname: "젤리",       user: "jelly_2030",   message: "구독하고 왔어요!",            color: "#fdba74", grade: "S" },
  { nickname: "나나",       user: "nana_watch",   message: "오늘도 화이팅!!",             color: "#67e8f9", grade: "A" },
  { nickname: "드림보이",   user: "dream_boy",    message: "처음 왔는데 분위기 최고",      color: "#a3e635", grade: "B" },
  { nickname: "해바라기",   user: "sunflower_k",  message: "방송 시작하자마자 들어왔어요", color: "#f0abfc", grade: "S" },
  { nickname: "맥스",       user: "max_gamer",    message: "이 BGM 제목이 뭐예요?",       color: "#fb923c", grade: "A" },
  { nickname: "헤이즐",     user: "hazel_r",      message: "리액션 너무 웃겨 ㅋㅋㅋ",     color: "#34d399", grade: "B" },
  { nickname: "픽셀",       user: "pixel_bro",    message: "오늘 방송 진짜 길게 하죠?",    color: "#60a5fa", grade: "A" },
];

export const GRADIENT_MOCK: Omit<GradientMsg, 'id'>[] = [
  { nickname: "루나",       user: "luna_42",      message: "오늘 방송 너무 재밌어요!",    color: "#ff7a45" },
  { nickname: "게이머X",    user: "gamer_x99",    message: "이 플레이 어떻게 한 거예요?", color: "#8b5cf6" },
  { nickname: "별빛고양이", user: "starcat_k",    message: "분위기 최고예요~",            color: "#ec4899" },
  { nickname: "달빛소나타", user: "moonsonata",   message: "목소리가 진짜 좋으세요",      color: "#06b6d4" },
  { nickname: "초코파이",   user: "choco_pie77",  message: "오늘 컨셉 너무 귀여워요",     color: "#f59e0b" },
  { nickname: "소라",       user: "sora_k",       message: "친구한테 방송 알렸어요",      color: "#10b981" },
  { nickname: "하늘바라기", user: "sky_watcher",  message: "같이 응원합니다!",            color: "#3b82f6" },
  { nickname: "레인보우",   user: "rainbow_j",    message: "매일 보러 오는 사람",         color: "#a855f7" },
  { nickname: "도리토스",   user: "doritos_fan",  message: "다음 방송은 언제예요?",       color: "#ef4444" },
  { nickname: "봄날",       user: "spring_dream", message: "오늘도 행복하게 보고 갑니다", color: "#14b8a6" },
  { nickname: "올빼미",     user: "night_owl",    message: "이 노래 제목 뭐예요?",        color: "#f97316" },
  { nickname: "귀여운물고기", user: "cutefish",   message: "처음 왔는데 이미 팬됐어요",   color: "#84cc16" },
];

export const PREVIEW_INTERVAL = 1600;
export const MAX_VISIBLE = 6;
