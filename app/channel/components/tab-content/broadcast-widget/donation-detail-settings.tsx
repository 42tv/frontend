import { WidgetDonationConfig } from "@/app/_types/widget";
import { Toggle } from "./toggle";

export function DonationDetailSettings({
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
