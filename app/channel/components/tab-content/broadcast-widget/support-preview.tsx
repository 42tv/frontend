import { WidgetGoalStyle } from "@/app/_types/widget";

export function SupportPreview({ style }: { style: WidgetGoalStyle }) {
  if (style === "goal_bar") {
    return (
      <div className="absolute right-4 top-20 w-[320px] space-y-3">
        <div className="rounded-3xl border border-white/10 bg-black/55 p-5 backdrop-blur-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#79d9ff]">
            Goal Mission
          </div>
          <div className="mt-2 text-base font-semibold text-white">
            리액션 미션 달성까지
          </div>
          <div className="mt-1 text-3xl font-bold text-[#7dd3fc]">78%</div>
          <div className="mt-3 h-3 rounded-full bg-white/10">
            <div className="h-3 w-[78%] rounded-full bg-gradient-to-r from-[#38bdf8] to-[#7dd3fc]" />
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-white/70">
            <span>390,000원</span>
            <span className="text-white/50">/ 500,000원</span>
          </div>
          <div className="mt-1 text-right text-xs text-white/40">남은 금액 110,000원</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/45 px-4 py-3 backdrop-blur-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50">
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

  if (style === "goal_ring") {
    return (
      <div className="absolute right-4 top-16 w-[300px] rounded-3xl border border-white/10 bg-black/55 p-6 backdrop-blur-sm">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a78bfa]">
          Goal Mission
        </div>
        <div className="mt-1 text-sm font-medium text-white/80">리액션 미션 달성 현황</div>
        <div className="mt-5 flex items-center gap-5">
          <div className="relative flex-shrink-0">
            <div
              className="h-28 w-28 rounded-full"
              style={{
                background:
                  "conic-gradient(#a78bfa 0% 78%, rgba(255,255,255,0.08) 78% 100%)",
              }}
            />
            <div className="absolute inset-[10px] flex flex-col items-center justify-center rounded-full bg-black/70">
              <span className="text-2xl font-bold text-[#c4b5fd]">78%</span>
              <span className="text-[10px] text-white/50">달성</span>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <div className="text-xs text-white/50">누적 후원</div>
              <div className="text-lg font-bold text-white">390,000원</div>
            </div>
            <div>
              <div className="text-xs text-white/50">목표 금액</div>
              <div className="text-base font-semibold text-[#c4b5fd]">500,000원</div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm">
          <span className="text-white/60">도리토스님</span>
          <span className="font-semibold text-[#c4b5fd]">+30,000</span>
        </div>
      </div>
    );
  }

  // goal_step
  const steps = [
    { label: "1만", amount: 10000, reached: true },
    { label: "3만", amount: 30000, reached: true },
    { label: "5만", amount: 50000, reached: true },
    { label: "10만", amount: 100000, reached: false },
    { label: "15만", amount: 150000, reached: false },
  ];
  const currentAmount = 52000;
  const reachedCount = steps.filter((s) => s.reached).length;

  return (
    <div className="absolute bottom-6 left-1/2 w-[calc(100%-32px)] max-w-[400px] -translate-x-1/2 rounded-3xl border border-white/10 bg-black/60 px-6 py-5 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#86efac]">
          Step Mission
        </div>
        <div className="text-xs font-semibold text-[#86efac]">
          {reachedCount} / {steps.length} 달성
        </div>
      </div>
      <div className="mt-1 text-sm font-medium text-white/80">리액션 공약 단계 미션</div>
      <div className="mt-4 flex items-center gap-1">
        {steps.map((step, i) => (
          <div key={step.label} className="flex flex-1 flex-col items-center gap-1.5">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                step.reached
                  ? "bg-[#22c55e] text-white shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                  : "border border-white/20 bg-white/5 text-white/40"
              }`}
            >
              {step.reached ? "✓" : i + 1}
            </div>
            <span
              className={`text-[10px] font-semibold ${
                step.reached ? "text-[#86efac]" : "text-white/30"
              }`}
            >
              {step.label}
            </span>
            {i < steps.length - 1 && (
              <div
                className={`absolute mt-3.5 h-0.5 w-full translate-x-1/2 ${
                  step.reached ? "bg-[#22c55e]/60" : "bg-white/10"
                }`}
                style={{ left: 0 }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-white/60">
          현재 <span className="font-semibold text-white">{currentAmount.toLocaleString()}원</span>
        </span>
        <span className="text-white/40">다음 목표: 100,000원</span>
      </div>
    </div>
  );
}
