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
  const user_id = useUserStore((s) => s.user_id);
  const [channelData, setChannelData] = useState<GetChannelResponse | null>(null);

  useEffect(() => {
    if (!user_id) return;
    getChannel({ user_id }).then(setChannelData).catch(() => {});
  }, [user_id]);

  return (
    <ChannelLayout>
      <ProfileHeader
        nickname={channelData?.user.nickname ?? null}
        profileImg={channelData?.user.profileImg ?? null}
        fanCount={channelData?.channel.fanCount ?? null}
      />
      <ChannelNav />
      {children}
    </ChannelLayout>
  );
}
