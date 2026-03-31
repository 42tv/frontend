'use client';

import { useDonationWidget } from "./use-donation-widget";
import { supportOptions } from "./constants";
import { SupportPreview } from "./support-preview";
import { DonationDetailSettings } from "./donation-detail-settings";

export default function DonationWidget() {
  const { config, setConfig, isLoading, isSaving, saveSuccess, handleSave } = useDonationWidget();

  return (
    <div className="grid gap-6 xl:grid-cols-5">

      {/* 좌측 설정 패널 */}
      <div className="xl:col-span-2 space-y-3">

        {/* 스타일 선택 */}
        <div className="rounded-xl border border-border-primary bg-bg-secondary p-4">
          <p className="mb-3 text-xs font-semibold text-text-primary">스타일</p>
          <div className="space-y-2">
            {supportOptions.map((option) => (
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
                  name="support-widget-style"
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
          <DonationDetailSettings
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
        <div className="sticky top-4">
          <div className="rounded-xl border border-border-primary bg-bg-secondary p-4">
            <p className="mb-3 text-xs font-semibold text-text-primary">미리보기</p>
            <div className="rounded-xl border border-border-primary overflow-hidden">
              <div className="relative h-[420px] bg-gradient-to-br from-[#181c24] via-[#11151d] to-[#0b0d12]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.10),_transparent_50%)]" />
                <SupportPreview key={config.style} style={config.style} goalAmount={config.goalAmount} goalLabel={config.goalLabel} />
              </div>
            </div>
          </div>
        </div>
      </aside>

    </div>
  );
}
