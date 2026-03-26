'use client';

import { useState, useEffect } from "react";
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
  WidgetFontSize,
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
  style: 'compact',
  maxMessages: 5,
  showProfileImage: true,
  fontSize: 'sm',
  bgOpacity: 55,
  bgColor: '#000000',
  fontColor: '#ffffff',
  messageDuration: 5000,
  showBadges: true,
};

const DEFAULT_DONATION_CONFIG: WidgetDonationConfig = {
  style: 'banner',
  minDisplayAmount: 0,
  displayDuration: 5000,
  goalAmount: null,
  goalLabel: null,
  bgOpacity: 55,
  fontSize: 'sm',
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
    id: "compact",
    name: "미니 오버레이",
    badge: "기본형",
    description: "작은 채팅 박스를 여러 줄로 쌓아 방송 화면을 많이 가리지 않습니다.",
    useCase: "게임, 캠 방송처럼 메인 화면 집중도가 중요한 방송",
    size: "300 x 420",
    position: "우측 상단",
  },
  {
    id: "bubble",
    name: "말풍선형 채팅",
    badge: "반응형",
    description: "채팅이 말풍선처럼 자연스럽게 떠서 시청자 반응을 더 생생하게 전달합니다.",
    useCase: "소통 방송, 리액션 방송, 토크 방송",
    size: "360 x 300",
    position: "좌측 하단",
  },
  {
    id: "notice",
    name: "상단 공지형",
    badge: "강조형",
    description: "선택한 메시지를 상단 고정 바로 노출하고 최근 채팅을 함께 보입니다.",
    useCase: "이벤트 안내, 팬미팅 공지, 참여형 방송",
    size: "가로형 900 x 90",
    position: "상단 전체",
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

function SectionTitle({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-4">
      <h4 className="text-base font-semibold text-text-primary">{title}</h4>
      <p className="mt-1 text-sm text-text-secondary">{description}</p>
    </div>
  );
}

function ChatPreview({ style }: { style: WidgetChatStyle }) {
  if (style === "compact") {
    return (
      <div className="absolute right-4 top-16 w-[260px] space-y-2">
        {[
          ["42lover", "오늘 텐션 좋네요"],
          ["minji_7", "팬미팅 후기 풀어주세요"],
          ["boraTV", "배경음 너무 잘 어울려요"],
        ].map(([user, message]) => (
          <div
            key={user}
            className="rounded-xl border border-white/10 bg-black/55 px-3 py-2 backdrop-blur-sm"
          >
            <div className="text-xs font-semibold text-[#ffb18d]">{user}</div>
            <div className="mt-1 text-sm text-white">{message}</div>
          </div>
        ))}
      </div>
    );
  }

  if (style === "bubble") {
    return (
      <div className="absolute bottom-24 left-4 max-w-[320px] space-y-3">
        {[
          ["루나", "오늘 공지 위젯 예쁘다", "from-[#ff7a45] to-[#ff915d]"],
          ["사과맛", "채팅 말풍선으로 보니까 반응이 잘 보이네요", "from-[#2f9c95] to-[#45d2c0]"],
        ].map(([user, message, gradient]) => (
          <div key={user} className="flex items-start gap-3">
            <div className={`mt-1 h-9 w-9 rounded-full bg-gradient-to-br ${gradient}`} />
            <div className="max-w-[260px] rounded-2xl rounded-tl-sm border border-white/10 bg-black/55 px-4 py-3 backdrop-blur-sm">
              <div className="text-xs font-semibold text-white/70">{user}</div>
              <div className="mt-1 text-sm leading-6 text-white">{message}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="absolute left-4 right-4 top-16 rounded-2xl border border-[#ffcf6a] bg-[#3b2d10] px-4 py-3 shadow-lg">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ffcf6a]">
          Highlight Notice
        </div>
        <div className="mt-1 text-sm font-medium text-white">
          팬미팅 일정은 방송 종료 10분 전에 다시 한 번 안내됩니다.
        </div>
      </div>
      <div className="absolute right-4 top-36 w-[240px] space-y-2">
        {[
          ["alice", "참여 링크는 어디서 보나요?"],
          ["noon", "고정 공지형이면 전달력 좋을 듯"],
        ].map(([user, message]) => (
          <div
            key={user}
            className="rounded-xl border border-white/10 bg-black/45 px-3 py-2 backdrop-blur-sm"
          >
            <div className="text-xs font-semibold text-white/60">{user}</div>
            <div className="mt-1 text-sm text-white">{message}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function SupportPreview({ style }: { style: WidgetDonationStyle }) {
  if (style === "banner") {
    return (
      <div className="absolute left-1/2 top-16 w-[calc(100%-32px)] max-w-[720px] -translate-x-1/2 rounded-2xl border border-[#ff8c5c] bg-[#3b1e14] px-5 py-4 shadow-xl">
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
  return (
    <div className="space-y-5">
      <div>
        <label className="flex items-center justify-between text-sm text-text-primary">
          <span>최대 메시지 수</span>
          <span className="font-semibold text-accent">{config.maxMessages}개</span>
        </label>
        <input
          type="range"
          min={1}
          max={30}
          value={config.maxMessages}
          onChange={(e) => onChange({ maxMessages: Number(e.target.value) })}
          className="mt-2 w-full accent-[var(--accent)]"
        />
        <div className="mt-1 flex justify-between text-xs text-text-secondary">
          <span>1</span><span>30</span>
        </div>
      </div>

      <div>
        <label className="flex items-center justify-between text-sm text-text-primary">
          <span>배경 투명도</span>
          <span className="font-semibold text-accent">{config.bgOpacity}%</span>
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={config.bgOpacity}
          onChange={(e) => onChange({ bgOpacity: Number(e.target.value) })}
          className="mt-2 w-full accent-[var(--accent)]"
        />
        <div className="mt-1 flex justify-between text-xs text-text-secondary">
          <span>투명</span><span>불투명</span>
        </div>
      </div>

      <div>
        <div className="mb-2 text-sm text-text-primary">폰트 크기</div>
        <div className="flex gap-2">
          {(['sm', 'md', 'lg'] as WidgetFontSize[]).map((size) => (
            <label
              key={size}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                config.fontSize === size
                  ? 'border-accent bg-background text-text-primary'
                  : 'border-border-primary bg-background text-text-secondary hover:border-accent'
              }`}
            >
              <input
                type="radio"
                name="font-size"
                value={size}
                checked={config.fontSize === size}
                onChange={() => onChange({ fontSize: size })}
                className="sr-only"
              />
              {size.toUpperCase()}
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-text-primary">프로필 이미지 표시</span>
        <Toggle
          checked={config.showProfileImage}
          onChange={(v) => onChange({ showProfileImage: v })}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-text-primary">BJ/MOD 배지 표시</span>
        <Toggle
          checked={config.showBadges}
          onChange={(v) => onChange({ showBadges: v })}
        />
      </div>

      {config.style === 'bubble' && (
        <div>
          <label className="flex items-center justify-between text-sm text-text-primary">
            <span>말풍선 유지 시간</span>
            <span className="font-semibold text-accent">{(config.messageDuration / 1000).toFixed(1)}초</span>
          </label>
          <input
            type="range"
            min={1000}
            max={10000}
            step={500}
            value={config.messageDuration}
            onChange={(e) => onChange({ messageDuration: Number(e.target.value) })}
            className="mt-2 w-full accent-[var(--accent)]"
          />
          <div className="mt-1 flex justify-between text-xs text-text-secondary">
            <span>1초</span><span>10초</span>
          </div>
        </div>
      )}
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
        await updateChatConfig(chatToken.token, chatConfig);
      } else if (activeTab === 'support' && donationToken) {
        await updateDonationConfig(donationToken.token, donationConfig);
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

  const selectedChatOption = chatOptions.find((o) => o.id === chatConfig.style) ?? chatOptions[0];
  const selectedSupportOption = supportOptions.find((o) => o.id === donationConfig.style) ?? supportOptions[0];
  const activeOption = activeTab === "chat" ? selectedChatOption : selectedSupportOption;
  const activeTabMeta = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  return (
    <div className="rounded-lg border border-border-primary bg-background p-6">
      <div className="border-b border-border-primary pb-6">
        <div className="mb-3 inline-flex items-center rounded-full border border-border-primary bg-bg-secondary px-3 py-1 text-xs font-medium text-text-secondary">
          위젯 스타일 선택
        </div>
        <h3 className="text-2xl font-bold text-text-primary">방송 위젯</h3>
        <p className="mt-2 max-w-3xl text-sm text-text-secondary">
          채팅과 후원 위젯을 탭으로 나눠두고, 각 탭에서 원하는 UI 형태를 라디오
          버튼으로 고르면 미리보기에서 바로 확인할 수 있게 구성했습니다.
        </p>
      </div>

      <div className="mt-6">
        <div
          role="tablist"
          aria-label="방송 위젯 종류"
          className="flex w-full gap-2 overflow-x-auto rounded-xl border border-border-primary bg-bg-secondary p-1"
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
                className={`min-w-[140px] rounded-lg px-4 py-3 text-left transition-colors ${
                  isActive
                    ? "bg-background text-text-primary shadow-sm"
                    : "text-text-secondary hover:bg-background hover:text-text-primary"
                }`}
              >
                <div className="font-semibold">{tab.label}</div>
                <div className="mt-1 text-xs">{tab.description}</div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            {/* 스타일 선택 */}
            <section className="rounded-lg border border-border-primary bg-bg-secondary p-5">
              <SectionTitle
                title={`${activeTabMeta.label} UI 선택`}
                description="원하는 스타일을 하나 선택하면 우측 미리보기에 즉시 반영됩니다."
              />

              {activeTab === "chat" ? (
                <div className="space-y-3">
                  {chatOptions.map((option) => {
                    const checked = chatConfig.style === option.id;
                    return (
                      <label
                        key={option.id}
                        className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-colors ${
                          checked
                            ? "border-accent bg-background"
                            : "border-border-primary bg-background hover:border-accent"
                        }`}
                      >
                        <input
                          type="radio"
                          name="chat-widget-style"
                          checked={checked}
                          onChange={() => setChatConfig((prev) => ({ ...prev, style: option.id }))}
                          className="mt-1 h-4 w-4"
                          style={{ accentColor: "var(--accent)" }}
                        />
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="font-semibold text-text-primary">{option.name}</div>
                            <span className="rounded-full bg-bg-tertiary px-2.5 py-1 text-xs text-text-secondary">
                              {option.badge}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-text-secondary">{option.description}</p>
                          <div className="mt-3 text-xs text-text-secondary">권장 상황: {option.useCase}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-3">
                  {supportOptions.map((option) => {
                    const checked = donationConfig.style === option.id;
                    return (
                      <label
                        key={option.id}
                        className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-colors ${
                          checked
                            ? "border-accent bg-background"
                            : "border-border-primary bg-background hover:border-accent"
                        }`}
                      >
                        <input
                          type="radio"
                          name="support-widget-style"
                          checked={checked}
                          onChange={() => setDonationConfig((prev) => ({ ...prev, style: option.id }))}
                          className="mt-1 h-4 w-4"
                          style={{ accentColor: "var(--accent)" }}
                        />
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="font-semibold text-text-primary">{option.name}</div>
                            <span className="rounded-full bg-bg-tertiary px-2.5 py-1 text-xs text-text-secondary">
                              {option.badge}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-text-secondary">{option.description}</p>
                          <div className="mt-3 text-xs text-text-secondary">권장 상황: {option.useCase}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </section>

            {/* 세부 설정 */}
            <section className="rounded-lg border border-border-primary bg-bg-secondary p-5">
              <SectionTitle
                title="세부 설정"
                description="위젯 표시 방식을 세밀하게 조정합니다."
              />
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

              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving || isLoading}
                  className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving ? '저장 중...' : '저장'}
                </button>
                {saveSuccess && (
                  <span className="text-sm font-medium text-green-500">저장됐습니다 ✓</span>
                )}
              </div>
            </section>

            {/* 선택 결과 + URL */}
            <section className="rounded-lg border border-border-primary bg-bg-secondary p-5">
              <SectionTitle
                title="선택 결과"
                description="현재 고른 스타일 기준으로 생성될 위젯의 기본 정보를 정리했습니다."
              />

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-border-primary bg-background px-4 py-4">
                  <div className="text-xs text-text-secondary">선택된 UI</div>
                  <div className="mt-2 font-semibold text-text-primary">{activeOption.name}</div>
                </div>
                <div className="rounded-xl border border-border-primary bg-background px-4 py-4">
                  <div className="text-xs text-text-secondary">권장 크기</div>
                  <div className="mt-2 font-semibold text-text-primary">{activeOption.size}</div>
                </div>
                <div className="rounded-xl border border-border-primary bg-background px-4 py-4">
                  <div className="text-xs text-text-secondary">권장 위치</div>
                  <div className="mt-2 font-semibold text-text-primary">{activeOption.position}</div>
                </div>
              </div>

              {activeTab === "chat" && (
                <div className="mt-4 space-y-3">
                  <UrlRow
                    label="미리보기 URL"
                    sublabel="(목업 채팅 — 백엔드 연결 불필요)"
                    url={chatToken?.previewUrl ?? null}
                    onCopy={handleCopyDevUrl}
                    copied={copiedDev}
                  />
                  <UrlRow
                    label="OBS 브라우저 소스 URL"
                    sublabel="(실제 방송용)"
                    url={chatToken?.widgetUrl ?? null}
                    onCopy={handleCopyUrl}
                    copied={copied}
                  />
                </div>
              )}
            </section>
          </div>

          <aside className="xl:col-span-1">
            <section className="rounded-lg border border-border-primary bg-bg-secondary p-5">
              <SectionTitle
                title="미리보기"
                description="선택한 채팅 또는 후원 UI가 방송 화면에 배치되는 형태를 보여줍니다."
              />

              <div className="rounded-2xl border border-border-primary bg-background p-3">
                <div className="relative h-[420px] overflow-hidden rounded-xl bg-gradient-to-br from-[#181c24] via-[#11151d] to-[#0b0d12]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_45%)]" />
                  <div className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
                    LIVE PREVIEW
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/70 to-transparent" />

                  {activeTab === "chat" ? (
                    <ChatPreview style={chatConfig.style} />
                  ) : (
                    <SupportPreview style={donationConfig.style} />
                  )}

                  <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 backdrop-blur-sm">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                      Selected Widget
                    </div>
                    <div className="mt-1 text-sm font-semibold text-white">{activeOption.name}</div>
                    <div className="mt-1 text-xs leading-5 text-white/70">{activeOption.description}</div>
                  </div>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
