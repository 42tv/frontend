export function UrlRow({
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
