import { useState } from "react";
import { WidgetChatConfig } from "@/app/_types/widget";

export function ChatDetailSettings({
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
