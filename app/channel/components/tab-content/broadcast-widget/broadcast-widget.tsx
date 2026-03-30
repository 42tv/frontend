'use client';

import { useState, useEffect, useRef } from "react";
import {
  getMyWidgets,
  createWidgetToken,
  updateChatConfig,
  updateDonationConfig,
} from "@/app/_apis/widget";
import {
  WidgetTokenInfo,
  WidgetChatConfig,
  WidgetDonationConfig,
  WidgetChatStyle,
  WidgetDonationStyle,
} from "@/app/_types/widget";

type WidgetTab = "chat" | "support";

type TabItem = {
  id: WidgetTab;
  label: string;
  description: string;
};

type ChatOption = {
  id: WidgetChatStyle;
  name: string;
  badge: string;
  description: string;
  useCase: string;
  size: string;
  position: string;
};

type SupportOption = {
  id: WidgetDonationStyle;
  name: string;
  badge: string;
  description: string;
  useCase: string;
  size: string;
  position: string;
};

const DEFAULT_CHAT_CONFIG: WidgetChatConfig = {
  style: 'default',
  maxMessages: 5,
  showProfileImage: true,
  fontSize: 14,
  showUserId: true,
};

const DEFAULT_DONATION_CONFIG: WidgetDonationConfig = {
  style: 'banner',
  minDisplayAmount: 0,
  displayDuration: 5000,
  goalAmount: null,
  goalLabel: null,
  bgOpacity: 55,
  fontSize: 14,
  animationType: 'slide',
  soundEnabled: false,
};

const tabs: TabItem[] = [
  {
    id: "chat",
    label: "채팅",
    description: "실시간 채팅을 어떻게 보여줄지 선택합니다.",
  },
  {
    id: "support",
    label: "후원",
    description: "후원 알림을 어떤 형태로 띄울지 고릅니다.",
  },
];

const chatOptions: ChatOption[] = [
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

const supportOptions: SupportOption[] = [
  {
    id: "banner",
    name: "배너 알림",
    badge: "순간형",
    description: "후원 발생 시 상단 배너가 짧고 강하게 등장해 시선을 즉시 끕니다.",
    useCase: "짧은 반응을 반복적으로 받는 일반 방송",
    size: "840 x 110",
    position: "상단 중앙",
  },
  {
    id: "card",
    name: "카드 팝업",
    badge: "집중형",
    description: "후원자 이름, 금액, 메시지를 카드 한 장에 담아 또렷하게 보여줍니다.",
    useCase: "고액 후원 리액션, 감사 멘트 중심 방송",
    size: "420 x 240",
    position: "중앙 우측",
  },
  {
    id: "goal",
    name: "목표 진행형",
    badge: "누적형",
    description: "누적 후원량과 달성률을 함께 노출해 참여를 유도하는 구조입니다.",
    useCase: "미션 방송, 공약 달성형 방송, 장기 이벤트",
    size: "340 x 220",
    position: "우측 중단",
  },
];


type CompactMsg = { id: number; nickname: string; user: string; message: string; color: string; grade: string };
type GradientMsg = { id: number; nickname: string; user: string; message: string; color: string };

const COMPACT_MOCK: Omit<CompactMsg, 'id'>[] = [
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

const GRADIENT_MOCK: Omit<GradientMsg, 'id'>[] = [
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

const PREVIEW_INTERVAL = 1600;
const MAX_VISIBLE = 6;

function ChatPreview({ style, fontSize, showUserId, showProfileImage }: {
  style: WidgetChatStyle;
  fontSize: number;
  showUserId: boolean;
  showProfileImage: boolean;
}) {
  const isDefault = style === "default";
  const mockData = isDefault ? COMPACT_MOCK : GRADIENT_MOCK;

  const [msgs, setMsgs] = useState<(CompactMsg | GradientMsg)[]>(() =>
    mockData.slice(0, 3).map((m, i) => ({ ...m, id: i }))
  );
  const counterRef = useRef(mockData.length);
  const idxRef = useRef(3);

  useEffect(() => {
    const data = isDefault ? COMPACT_MOCK : GRADIENT_MOCK;
    setMsgs(data.slice(0, 3).map((m, i) => ({ ...m, id: i })));
    counterRef.current = data.length;
    idxRef.current = 3;

    const timer = setInterval(() => {
      const next = { ...data[idxRef.current % data.length], id: counterRef.current };
      counterRef.current++;
      idxRef.current++;
      setMsgs((prev) => {
        const updated = [...prev, next];
        return updated.length > MAX_VISIBLE ? updated.slice(1) : updated;
      });
    }, PREVIEW_INTERVAL);

    return () => clearInterval(timer);
  }, [isDefault]);

  return (
    <>
      <style>{`
        @keyframes msgSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* 채팅 목록 */}
      <div className="absolute inset-0 flex flex-col justify-end">
        <div className="px-3 pb-4 space-y-1.5">
          {style === "default"
            ? (msgs as CompactMsg[]).map((msg, i) => (
                <div
                  key={msg.id}
                  className="relative flex items-stretch overflow-hidden rounded-lg backdrop-blur-md"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.65) 0%, rgba(15,15,25,0.75) 100%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    animation: i === msgs.length - 1 ? 'msgSlideIn 0.35s ease-out' : undefined,
                  }}
                >
                  <div
                    className="w-[3px] flex-shrink-0 rounded-l-lg"
                    style={{ background: `linear-gradient(180deg, ${msg.color}cc 0%, ${msg.color}55 100%)` }}
                  />
                  <div className="flex-1 px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      {showProfileImage && (
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0"
                          style={{ backgroundColor: msg.color }}
                        >
                          {msg.grade}
                        </div>
                      )}
                      <span className="text-xs font-bold" style={{ color: msg.color }}>
                        {msg.nickname}
                        {showUserId && <span className="font-normal opacity-50">({msg.user})</span>}
                      </span>
                    </div>
                    <div className="mt-1 text-white/90" style={{ fontSize: `${fontSize}px` }}>{msg.message}</div>
                  </div>
                </div>
              ))
            : (msgs as GradientMsg[]).map((msg, i) => (
                <div
                  key={msg.id}
                  className="rounded-xl px-3 py-2"
                  style={{
                    background: `linear-gradient(135deg, ${msg.color}30 0%, ${msg.color}0a 100%)`,
                    border: `1px solid ${msg.color}44`,
                    boxShadow: `0 4px 16px ${msg.color}14`,
                    animation: i === msgs.length - 1 ? 'msgSlideIn 0.35s ease-out' : undefined,
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    {showProfileImage && (
                      <div className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: msg.color }} />
                    )}
                    <div className="text-xs font-bold" style={{ color: msg.color }}>
                      {msg.nickname}
                      {showUserId && <span className="font-normal opacity-50">({msg.user})</span>}
                    </div>
                  </div>
                  <div className="text-white/90" style={{ fontSize: `${fontSize}px` }}>{msg.message}</div>
                </div>
              ))
          }
        </div>
      </div>
    </>
  );
}

function SupportPreview({ style }: { style: WidgetDonationStyle }) {
  if (style === "banner") {
    return (
      <div className="absolute left-1/2 top-4 w-[calc(100%-32px)] max-w-[720px] -translate-x-1/2 rounded-2xl border border-[#ff8c5c] bg-[#3b1e14] px-5 py-4 shadow-xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ffb18d]">
              Donation Alert
            </div>
            <div className="mt-1 text-lg font-semibold text-white">
              `별빛고양이`님이 1,000원을 후원했습니다
            </div>
            <div className="mt-1 text-sm text-white/75">
              &quot;오늘도 방송 너무 재밌어요. 끝까지 달려봅시다.&quot;
            </div>
          </div>
          <div className="rounded-xl bg-[#ff7a45] px-4 py-2 text-sm font-semibold text-white">
            +1,000
          </div>
        </div>
      </div>
    );
  }

  if (style === "card") {
    return (
      <div className="absolute right-6 top-24 w-[360px] rounded-[28px] border border-white/10 bg-black/60 p-5 shadow-2xl backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#ff7a45] to-[#ffb18d]" />
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
              Premium Support
            </div>
            <div className="mt-1 text-xl font-semibold text-white">감자별님</div>
          </div>
        </div>
        <div className="mt-5 text-4xl font-bold text-[#ffb18d]">₩ 50,000</div>
        <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-white/85">
          다음 주 합방도 기대할게요. 오늘 텐션 유지해서 끝까지 갑시다.
        </div>
      </div>
    );
  }

  return (
    <div className="absolute right-4 top-20 w-[320px] space-y-4">
      <div className="rounded-3xl border border-white/10 bg-black/55 p-5 backdrop-blur-sm">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#79d9ff]">
          Goal Mission
        </div>
        <div className="mt-2 text-lg font-semibold text-white">
          리액션 미션 달성까지 78%
        </div>
        <div className="mt-4 h-3 rounded-full bg-white/10">
          <div className="h-3 w-[78%] rounded-full bg-gradient-to-r from-[#38bdf8] to-[#7dd3fc]" />
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-white/75">
          <span>390,000 / 500,000</span>
          <span>남은 금액 110,000</span>
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-black/45 px-4 py-3 backdrop-blur-sm">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
          Recent Support
        </div>
        <div className="mt-2 flex items-center justify-between text-sm text-white">
          <span>도리토스님</span>
          <span className="font-semibold text-[#79d9ff]">+30,000</span>
        </div>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
        checked ? 'bg-accent' : 'bg-bg-tertiary'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

function ChatDetailSettings({
  config,
  onChange,
}: {
  config: WidgetChatConfig;
  onChange: (patch: Partial<WidgetChatConfig>) => void;
}) {
  const [fontInput, setFontInput] = useState(String(config.fontSize));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm text-text-primary">폰트 크기 (px)</label>
          <span className="text-xs text-text-secondary">10 ~ 100</span>
        </div>
        <input
          type="text"
          value={fontInput}
          onChange={(e) => {
            const raw = e.target.value;
            if (!/^\d*$/.test(raw)) return;
            setFontInput(raw);
            const v = Number(raw);
            if (v >= 10 && v <= 100) {
              onChange({ fontSize: v });
            }
          }}
          onBlur={() => {
            const v = Number(fontInput);
            if (!fontInput || v < 10 || v > 100) setFontInput(String(config.fontSize));
          }}
          className="w-20 rounded-lg border border-border-primary bg-background px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
          placeholder="14"
        />
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-3">
        {([
          { key: 'showProfileImage', label: '프로필 이미지 표시', value: config.showProfileImage },
          { key: 'showUserId',       label: '아이디 표시',         value: config.showUserId },
        ] as { key: keyof WidgetChatConfig; label: string; value: boolean }[]).map(({ key, label, value }) => (
          <label key={key} className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => onChange({ [key]: e.target.checked })}
              className="h-4 w-4 rounded border-border-primary accent-[var(--accent)] cursor-pointer"
            />
            <span className="text-sm text-text-primary">{label}</span>
          </label>
        ))}
      </div>

    </div>
  );
}

function DonationDetailSettings({
  config,
  onChange,
}: {
  config: WidgetDonationConfig;
  onChange: (patch: Partial<WidgetDonationConfig>) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <label className="flex items-center justify-between text-sm text-text-primary">
          <span>알림 유지 시간</span>
          <span className="font-semibold text-accent">{(config.displayDuration / 1000).toFixed(1)}초</span>
        </label>
        <input
          type="range"
          min={1000}
          max={10000}
          step={500}
          value={config.displayDuration}
          onChange={(e) => onChange({ displayDuration: Number(e.target.value) })}
          className="mt-2 w-full accent-[var(--accent)]"
        />
        <div className="mt-1 flex justify-between text-xs text-text-secondary">
          <span>1초</span><span>10초</span>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-text-primary">최소 표시 금액 (원)</label>
        <input
          type="number"
          min={0}
          value={config.minDisplayAmount}
          onChange={(e) => onChange({ minDisplayAmount: Number(e.target.value) })}
          className="w-full rounded-lg border border-border-primary bg-background px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
          placeholder="0"
        />
        <p className="mt-1 text-xs text-text-secondary">이 금액 미만의 후원은 위젯에 표시되지 않습니다.</p>
      </div>

      {config.style === 'goal' && (
        <>
          <div>
            <label className="mb-1.5 block text-sm text-text-primary">목표 금액 (원)</label>
            <input
              type="number"
              min={0}
              value={config.goalAmount ?? ''}
              onChange={(e) => onChange({ goalAmount: e.target.value ? Number(e.target.value) : null })}
              className="w-full rounded-lg border border-border-primary bg-background px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
              placeholder="500000"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-text-primary">미션 문구</label>
            <input
              type="text"
              value={config.goalLabel ?? ''}
              onChange={(e) => onChange({ goalLabel: e.target.value || null })}
              className="w-full rounded-lg border border-border-primary bg-background px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
              placeholder="리액션 미션 달성!"
            />
          </div>
        </>
      )}

      <div className="flex items-center justify-between">
        <span className="text-sm text-text-primary">알림음</span>
        <Toggle
          checked={config.soundEnabled}
          onChange={(v) => onChange({ soundEnabled: v })}
        />
      </div>
    </div>
  );
}

function UrlRow({
  label,
  sublabel,
  url,
  onCopy,
  copied,
}: {
  label: string;
  sublabel: string;
  url: string | null;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div>
      <div className="mb-1.5 text-xs text-text-secondary">
        {label} <span className="text-text-tertiary">{sublabel}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 truncate rounded-lg border border-border-primary bg-background px-3 py-2 font-mono text-xs text-text-secondary">
          {url ?? '로딩 중...'}
        </div>
        <button
          type="button"
          onClick={onCopy}
          disabled={!url}
          className="rounded-lg border border-border-primary bg-background px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
        >
          {copied ? '복사됨 ✓' : '복사'}
        </button>
      </div>
    </div>
  );
}

export default function BroadcastWidget() {
  const [activeTab, setActiveTab] = useState<WidgetTab>("chat");
  const [chatToken, setChatToken] = useState<WidgetTokenInfo | null>(null);
  const [donationToken, setDonationToken] = useState<WidgetTokenInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [chatConfig, setChatConfig] = useState<WidgetChatConfig>(DEFAULT_CHAT_CONFIG);
  const [donationConfig, setDonationConfig] = useState<WidgetDonationConfig>(DEFAULT_DONATION_CONFIG);
  const [copied, setCopied] = useState(false);
  const [copiedDev, setCopiedDev] = useState(false);

  useEffect(() => {
    async function loadWidgets() {
      try {
        const widgets = await getMyWidgets();

        let chat = widgets.find((w) => w.widgetType === 'CHAT') ?? null;
        let donation = widgets.find((w) => w.widgetType === 'DONATION') ?? null;

        if (!chat) chat = await createWidgetToken('CHAT');
        if (!donation) donation = await createWidgetToken('DONATION');

        setChatToken(chat);
        setDonationToken(donation);
        if (chat.chatConfig) setChatConfig(chat.chatConfig);
        if (donation.donationConfig) setDonationConfig(donation.donationConfig);
      } catch {
        // 네트워크 오류 시 기본값으로 유지
      } finally {
        setIsLoading(false);
      }
    }
    loadWidgets();
  }, []);

  async function handleSave() {
    setIsSaving(true);
    try {
      if (activeTab === 'chat' && chatToken) {
        await updateChatConfig(chatConfig);
      } else if (activeTab === 'support' && donationToken) {
        await updateDonationConfig(donationConfig);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } finally {
      setIsSaving(false);
    }
  }

  function handleCopyUrl() {
    const url = chatToken?.widgetUrl;
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleCopyDevUrl() {
    const url = chatToken?.previewUrl;
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedDev(true);
      setTimeout(() => setCopiedDev(false), 2000);
    });
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-xl font-bold text-text-primary">방송 위젯</h3>
          <p className="mt-1 text-sm text-text-secondary">
            채팅·후원 위젯의 스타일과 세부 옵션을 설정하고 OBS 소스 URL을 복사합니다.
          </p>
        </div>
        {/* 탭 */}
        <div
          role="tablist"
          className="flex items-center gap-1 rounded-xl border border-border-primary bg-bg-secondary p-1"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-5 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-background text-text-primary shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 본문 */}
      <div className="grid gap-6 xl:grid-cols-5">

        {/* 좌측 설정 패널 */}
        <div className="xl:col-span-2 space-y-3">

          {/* 스타일 선택 */}
          <div className="rounded-xl border border-border-primary bg-bg-secondary p-4">
            <p className="mb-3 text-xs font-semibold text-text-primary">
              스타일
            </p>
            <div className="space-y-2">
              {(activeTab === "chat" ? chatOptions : supportOptions).map((option) => {
                const checked =
                  activeTab === "chat"
                    ? chatConfig.style === (option as ChatOption).id
                    : donationConfig.style === (option as SupportOption).id;
                return (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-all ${
                      checked
                        ? "border-accent bg-background shadow-sm"
                        : "border-border-primary bg-background hover:border-accent/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name={activeTab === "chat" ? "chat-widget-style" : "support-widget-style"}
                      checked={checked}
                      onChange={() =>
                        activeTab === "chat"
                          ? setChatConfig((prev) => ({ ...prev, style: (option as ChatOption).id }))
                          : setDonationConfig((prev) => ({ ...prev, style: (option as SupportOption).id }))
                      }
                      className="h-3.5 w-3.5 flex-shrink-0"
                      style={{ accentColor: "var(--accent)" }}
                    />
                    <span className="text-sm font-medium text-text-primary">{option.name}</span>
                    <span className="ml-auto rounded-full bg-bg-tertiary px-2 py-0.5 text-[10px] text-text-secondary">
                      {option.badge}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 세부 설정 */}
          <div className="rounded-xl border border-border-primary bg-bg-secondary p-4">
            <p className="mb-4 text-xs font-semibold text-text-primary">
              세부 설정
            </p>
            {activeTab === 'chat' ? (
              <ChatDetailSettings
                config={chatConfig}
                onChange={(patch) => setChatConfig((prev) => ({ ...prev, ...patch }))}
              />
            ) : (
              <DonationDetailSettings
                config={donationConfig}
                onChange={(patch) => setDonationConfig((prev) => ({ ...prev, ...patch }))}
              />
            )}
          </div>

          {/* 저장 */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isLoading}
              className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? '저장 중...' : '저장'}
            </button>
            {saveSuccess && (
              <span className="text-sm font-medium text-green-500">저장됐습니다 ✓</span>
            )}
          </div>

        </div>

        {/* 우측 미리보기 */}
        <aside className="xl:col-span-3">
          <div className="sticky top-4 space-y-3">
            <div className="rounded-xl border border-border-primary bg-bg-secondary p-4">
              <div className="mb-3">
                <p className="text-xs font-semibold text-text-primary">
                  미리보기
                </p>
              </div>
              <div className="rounded-xl border border-border-primary overflow-hidden">
                <div className="relative h-[420px] bg-gradient-to-br from-[#181c24] via-[#11151d] to-[#0b0d12]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.10),_transparent_50%)]" />
                  {activeTab === "chat" ? (
                    <ChatPreview
                      key={chatConfig.style}
                      style={chatConfig.style}
                      fontSize={chatConfig.fontSize}
                      showUserId={chatConfig.showUserId}
                      showProfileImage={chatConfig.showProfileImage}
                    />
                  ) : (
                    <SupportPreview key={donationConfig.style} style={donationConfig.style} />
                  )}
                </div>
              </div>
            </div>

            {/* OBS URL */}
            {activeTab === "chat" && (
              <div className="rounded-xl border border-border-primary bg-bg-secondary px-4 py-3 space-y-2">
                <p className="text-[10px] font-semibold text-text-primary">
                  OBS URL
                </p>
                <UrlRow
                  label="미리보기 URL"
                  sublabel="(목업 채팅)"
                  url={chatToken?.previewUrl ?? null}
                  onCopy={handleCopyDevUrl}
                  copied={copiedDev}
                />
                <UrlRow
                  label="브라우저 소스 URL"
                  sublabel="(실제 방송용)"
                  url={chatToken?.widgetUrl ?? null}
                  onCopy={handleCopyUrl}
                  copied={copied}
                />
              </div>
            )}
          </div>
        </aside>

      </div>
    </div>
  );
}
