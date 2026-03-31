import { WidgetGoalConfig } from "@/app/_types/widget";

export function DonationDetailSettings({
  config,
  onChange,
}: {
  config: WidgetGoalConfig;
  onChange: (patch: Partial<WidgetGoalConfig>) => void;
}) {
  return (
    <div className="space-y-5">
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
        <p className="mt-1 text-xs text-text-secondary">목표 금액에 도달하면 달성률이 100%로 표시됩니다.</p>
      </div>
      <div>
        <label className="mb-1.5 block text-sm text-text-primary">목표 라벨</label>
        <input
          type="text"
          value={config.goalLabel ?? ''}
          onChange={(e) => onChange({ goalLabel: e.target.value || null })}
          className="w-full rounded-lg border border-border-primary bg-background px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
          placeholder="예: 장비 구입 목표"
        />
        <p className="mt-1 text-xs text-text-secondary">목표 금액 옆에 표시될 라벨입니다.</p>
      </div>
    </div>
  );
}
