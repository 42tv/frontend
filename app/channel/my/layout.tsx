'use client';
import React, { useEffect, useState } from "react";
import ChannelLayout from "@/app/channel/components/channel-layout";
import ProfileHeader from "@/app/channel/components/profile-header";
import ChannelNav from "@/app/channel/components/channel-nav";
import { useUserStore } from "@/app/_lib/stores";
import { getChannel, GetChannelResponse } from "@/app/_apis/channel";

export default function ChannelMyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hydrated = useUserStore((s) => s.hydrated);
  const user_id = useUserStore((s) => s.user_id);
  const [channelData, setChannelData] = useState<GetChannelResponse | null>(null);
  const [channelLoaded, setChannelLoaded] = useState<boolean>(false);

  useEffect(() => {
    // 로그인 상태 확정 전에는 게스트로 단정하지 않고 대기 (스켈레톤 유지)
    if (!hydrated) return;
    if (!user_id) {
      // 게스트 확정 — 조회 없이 로딩 종료
      setChannelLoaded(true);
      return;
    }
    getChannel({ user_id })
      .then(setChannelData)
      .catch(() => {})
      .finally(() => setChannelLoaded(true));
  }, [hydrated, user_id]);

  return (
    <ChannelLayout>
      <ProfileHeader
        nickname={channelData?.user.nickname ?? null}
        profileImg={channelData?.user.profileImg ?? null}
        fanCount={channelData?.channel.fanCount ?? null}
        loading={!channelLoaded}
      />
      <ChannelNav />
      {children}
    </ChannelLayout>
  );
}
