'use client';
// components/ChannelNav.tsx
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabRoutes = [
  { name: "BJ공지사항", path: "/channel/my/article" },
  { name: "방송설정", path: "/channel/my/broadcast" },
  { name: "방송 위젯", path: "/channel/my/widget" },
  { name: "통계", path: "/channel/my/stats" },
  { name: "BJ알림", path: "/channel/my/notifications" },
  { name: "팬등급", path: "/channel/my/fans" },
  { name: "블랙리스트", path: "/channel/my/blacklist" },
  { name: "커뮤니티", path: "/channel/my/community" },
  { name: "환전", path: "/channel/my/exchange" },
];

const ChannelNav = () => {
  const pathname = usePathname();
  
  return (
    <div className="flex w-full space-x-6 pb-2 mb-8 overflow-x-auto border-b border-border-primary">
      {tabRoutes.map((tab) => (
        <Link
          key={tab.name}
          href={tab.path}
          aria-current={pathname.startsWith(tab.path) ? "page" : undefined}
          className={`border-b-2 pb-2 font-medium transition-colors whitespace-nowrap ${
            pathname.startsWith(tab.path)
              ? "border-current text-text-primary"
              : "border-transparent text-text-secondary hover:border-current hover:text-text-primary"
          }`}
        >
          {tab.name}
        </Link>
      ))}
    </div>
  );
};

export default ChannelNav;
