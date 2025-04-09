// components/ChannelLayout.tsx
import React from "react";

const ChannelLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen p-4 font-sans">
      {children}
    </div>
  );
};

export default ChannelLayout;
