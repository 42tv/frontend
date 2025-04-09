import React from "react";
import ChannelLayout from "../../_components/channel/channel-layout";
import ProfileHeader from "../../_components/channel/profile-header";
import ChannelNav from "../../_components/channel/channel-nav";

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
