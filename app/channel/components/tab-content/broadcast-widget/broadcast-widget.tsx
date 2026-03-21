'use client';

import { useState } from "react";

type WidgetTab = "chat" | "support";
type ChatStyle = "compact" | "bubble" | "notice";
type SupportStyle = "banner" | "card" | "goal";

type TabItem = {
  id: WidgetTab;
  label: string;
  description: string;
};

type ChatOption = {
  id: ChatStyle;
  name: string;
  badge: string;
  description: string;
  useCase: string;
  size: string;
  position: string;
};

type SupportOption = {
  id: SupportStyle;
  name: string;
  badge: string;
  description: string;
  useCase: string;
  size: string;
  position: string;
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

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-4">
      <h4 className="text-base font-semibold text-text-primary">{title}</h4>
      <p className="mt-1 text-sm text-text-secondary">{description}</p>
    </div>
  );
}

function ChatPreview({ style }: { style: ChatStyle }) {
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

function SupportPreview({ style }: { style: SupportStyle }) {
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

export default function BroadcastWidget() {
  const [activeTab, setActiveTab] = useState<WidgetTab>("chat");
  const [chatStyle, setChatStyle] = useState<ChatStyle>("compact");
  const [supportStyle, setSupportStyle] = useState<SupportStyle>("banner");

  const selectedChatOption =
    chatOptions.find((option) => option.id === chatStyle) ?? chatOptions[0];
  const selectedSupportOption =
    supportOptions.find((option) => option.id === supportStyle) ?? supportOptions[0];
  const activeOption =
    activeTab === "chat" ? selectedChatOption : selectedSupportOption;
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
            <section className="rounded-lg border border-border-primary bg-bg-secondary p-5">
              <SectionTitle
                title={`${activeTabMeta.label} UI 선택`}
                description="원하는 스타일을 하나 선택하면 우측 미리보기에 즉시 반영됩니다."
              />

              <div className="space-y-3">
                {(activeTab === "chat" ? chatOptions : supportOptions).map((option) => {
                  const checked =
                    activeTab === "chat"
                      ? chatStyle === option.id
                      : supportStyle === option.id;

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
                        name={activeTab === "chat" ? "chat-widget-style" : "support-widget-style"}
                        checked={checked}
                        onChange={() =>
                          activeTab === "chat"
                            ? setChatStyle(option.id as ChatStyle)
                            : setSupportStyle(option.id as SupportStyle)
                        }
                        className="mt-1 h-4 w-4"
                        style={{ accentColor: "var(--accent)" }}
                      />

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="font-semibold text-text-primary">
                            {option.name}
                          </div>
                          <span className="rounded-full bg-bg-tertiary px-2.5 py-1 text-xs text-text-secondary">
                            {option.badge}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-text-secondary">
                          {option.description}
                        </p>
                        <div className="mt-3 text-xs text-text-secondary">
                          권장 상황: {option.useCase}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </section>

            <section className="rounded-lg border border-border-primary bg-bg-secondary p-5">
              <SectionTitle
                title="선택 결과"
                description="현재 고른 스타일 기준으로 생성될 위젯의 기본 정보를 정리했습니다."
              />

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-border-primary bg-background px-4 py-4">
                  <div className="text-xs text-text-secondary">선택된 UI</div>
                  <div className="mt-2 font-semibold text-text-primary">
                    {activeOption.name}
                  </div>
                </div>
                <div className="rounded-xl border border-border-primary bg-background px-4 py-4">
                  <div className="text-xs text-text-secondary">권장 크기</div>
                  <div className="mt-2 font-semibold text-text-primary">
                    {activeOption.size}
                  </div>
                </div>
                <div className="rounded-xl border border-border-primary bg-background px-4 py-4">
                  <div className="text-xs text-text-secondary">권장 위치</div>
                  <div className="mt-2 font-semibold text-text-primary">
                    {activeOption.position}
                  </div>
                </div>
              </div>
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
                    <ChatPreview style={chatStyle} />
                  ) : (
                    <SupportPreview style={supportStyle} />
                  )}

                  <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 backdrop-blur-sm">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                      Selected Widget
                    </div>
                    <div className="mt-1 text-sm font-semibold text-white">
                      {activeOption.name}
                    </div>
                    <div className="mt-1 text-xs leading-5 text-white/70">
                      {activeOption.description}
                    </div>
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
