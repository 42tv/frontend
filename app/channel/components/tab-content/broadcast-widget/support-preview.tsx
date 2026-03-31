import { WidgetDonationStyle } from "@/app/_types/widget";

export function SupportPreview({ style }: { style: WidgetDonationStyle }) {
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
