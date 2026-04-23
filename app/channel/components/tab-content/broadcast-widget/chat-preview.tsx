'use client';

import { useState, useEffect, useRef } from "react";
import { WidgetChatStyle } from "@/app/_types/widget";
import { CompactMsg, GradientMsg } from "./types";
import { COMPACT_MOCK, GRADIENT_MOCK, PREVIEW_INTERVAL, MAX_VISIBLE } from "./constants";

export function ChatPreview({ style, fontSize, showUserId, showProfileImage }: {
  style: WidgetChatStyle;
  fontSize: number;
  showUserId: boolean;
  showProfileImage: boolean;
}) {
  const isDefault = style === "default";
  const mockData = isDefault ? COMPACT_MOCK : GRADIENT_MOCK;

  const [msgs, setMsgs] = useState<(CompactMsg | GradientMsg)[]>(() =>
    mockData.slice(0, 3).map((m, i) => ({ ...m, id: i }))
  );
  const counterRef = useRef(mockData.length);
  const idxRef = useRef(3);

  useEffect(() => {
    const data = isDefault ? COMPACT_MOCK : GRADIENT_MOCK;
    setMsgs(data.slice(0, 3).map((m, i) => ({ ...m, id: i })));
    counterRef.current = data.length;
    idxRef.current = 3;

    const timer = setInterval(() => {
      const next = { ...data[idxRef.current % data.length], id: counterRef.current };
      counterRef.current++;
      idxRef.current++;
      setMsgs((prev) => {
        const updated = [...prev, next];
        return updated.length > MAX_VISIBLE ? updated.slice(1) : updated;
      });
    }, PREVIEW_INTERVAL);

    return () => clearInterval(timer);
  }, [isDefault]);

  return (
    <>
      <style>{`
        @keyframes msgSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="absolute inset-0 flex flex-col justify-end">
        <div className="px-3 pb-4 space-y-1.5">
          {style === "default"
            ? (msgs as CompactMsg[]).map((msg, i) => (
                <div
                  key={msg.id}
                  className="relative flex items-stretch overflow-hidden rounded-lg backdrop-blur-md"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.65) 0%, rgba(15,15,25,0.75) 100%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    animation: i === msgs.length - 1 ? 'msgSlideIn 0.35s ease-out' : undefined,
                  }}
                >
                  <div
                    className="w-[3px] flex-shrink-0 rounded-l-lg"
                    style={{ background: `linear-gradient(180deg, ${msg.color}cc 0%, ${msg.color}55 100%)` }}
                  />
                  <div className="flex-1 px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      {showProfileImage && (
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0"
                          style={{ backgroundColor: msg.color }}
                        >
                          {msg.grade}
                        </div>
                      )}
                      <span className="text-xs font-bold" style={{ color: msg.color }}>
                        {msg.nickname}
                        {showUserId && <span className="font-normal opacity-50">({msg.user})</span>}
                      </span>
                    </div>
                    <div className="mt-1 text-white/90" style={{ fontSize: `${fontSize}px` }}>{msg.message}</div>
                  </div>
                </div>
              ))
            : (msgs as GradientMsg[]).map((msg, i) => (
                <div
                  key={msg.id}
                  className="rounded-xl px-3 py-2"
                  style={{
                    background: `linear-gradient(135deg, ${msg.color}30 0%, ${msg.color}0a 100%)`,
                    border: `1px solid ${msg.color}44`,
                    boxShadow: `0 4px 16px ${msg.color}14`,
                    animation: i === msgs.length - 1 ? 'msgSlideIn 0.35s ease-out' : undefined,
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    {showProfileImage && (
                      <div className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: msg.color }} />
                    )}
                    <div className="text-xs font-bold" style={{ color: msg.color }}>
                      {msg.nickname}
                      {showUserId && <span className="font-normal opacity-50">({msg.user})</span>}
                    </div>
                  </div>
                  <div className="text-white/90" style={{ fontSize: `${fontSize}px` }}>{msg.message}</div>
                </div>
              ))
          }
        </div>
      </div>
    </>
  );
}
