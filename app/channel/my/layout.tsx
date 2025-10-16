import React from "react";
import ChannelLayout from "@/app/channel/components/channel-layout";
import ProfileHeader from "@/app/channel/components/profile-header";
import ChannelNav from "@/app/channel/components/channel-nav";

export default function ChannelMyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChannelLayout>
      <ProfileHeader />
      <ChannelNav />
      {children}
    </ChannelLayout>
  );
}
