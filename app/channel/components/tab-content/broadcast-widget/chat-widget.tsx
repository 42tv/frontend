'use client';

import { useChatWidget } from "./use-chat-widget";
import { chatOptions } from "./constants";
import { ChatPreview } from "./chat-preview";
import { ChatDetailSettings } from "./chat-detail-settings";
import { UrlRow } from "./url-row";

export default function ChatWidget() {
  const { widgetUrl, config, setConfig, isLoading, isSaving, saveSuccess, copied, handleSave, handleCopyUrl } = useChatWidget();

  return (
    <div className="grid gap-6 xl:grid-cols-5">

      {/* 좌측 설정 패널 */}
      <div className="xl:col-span-2 space-y-3">

        {/* 스타일 선택 */}
        <div className="rounded-xl border border-border-primary bg-bg-secondary p-4">
          <p className="mb-3 text-xs font-semibold text-text-primary">스타일</p>
          <div className="space-y-2">
            {chatOptions.map((option) => (
              <label
                key={option.id}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-all ${
                  config.style === option.id
                    ? "border-accent bg-background shadow-sm"
                    : "border-border-primary bg-background hover:border-accent/50"
                }`}
              >
                <input
                  type="radio"
                  name="chat-widget-style"
                  checked={config.style === option.id}
                  onChange={() => setConfig((prev) => ({ ...prev, style: option.id }))}
                  className="h-3.5 w-3.5 flex-shrink-0"
                  style={{ accentColor: "var(--accent)" }}
                />
                <span className="text-sm font-medium text-text-primary">{option.name}</span>
                <span className="ml-auto rounded-full bg-bg-tertiary px-2 py-0.5 text-[10px] text-text-secondary">
                  {option.badge}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 세부 설정 */}
        <div className="rounded-xl border border-border-primary bg-bg-secondary p-4">
          <p className="mb-4 text-xs font-semibold text-text-primary">세부 설정</p>
          <ChatDetailSettings
            config={config}
            onChange={(patch) => setConfig((prev) => ({ ...prev, ...patch }))}
          />
        </div>

        {/* 저장 */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            저장
          </button>
          {saveSuccess && <span className="text-sm font-medium text-green-500">저장됐습니다 ✓</span>}
        </div>

      </div>

      {/* 우측 미리보기 */}
      <aside className="xl:col-span-3">
        <div className="sticky top-4 space-y-3">
          <div className="rounded-xl border border-border-primary bg-bg-secondary p-4">
            <p className="mb-3 text-xs font-semibold text-text-primary">미리보기</p>
            <div className="rounded-xl border border-border-primary overflow-hidden">
              <div className="relative h-[420px] bg-gradient-to-br from-[#181c24] via-[#11151d] to-[#0b0d12]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.10),_transparent_50%)]" />
                <ChatPreview
                  key={config.style}
                  style={config.style}
                  fontSize={config.fontSize}
                  showUserId={config.showUserId}
                  showProfileImage={config.showProfileImage}
                />
              </div>
            </div>
          </div>

          {/* OBS URL */}
          <div className="rounded-xl border border-border-primary bg-bg-secondary px-4 py-3 space-y-2">
            <p className="text-[10px] font-semibold text-text-primary">OBS URL</p>
            <UrlRow
              label="브라우저 소스 URL"
              sublabel="(실제 방송용)"
              url={widgetUrl}
              onCopy={handleCopyUrl}
              copied={copied}
            />
          </div>
        </div>
      </aside>

    </div>
  );
}
