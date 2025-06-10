'use client';
// components/ChannelNav.tsx
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabRoutes = [
  { name: "BJ공지사항", path: "/channel/my/bjNotice" },
  { name: "방송설정", path: "/channel/my/broadcast" },
  { name: "통계", path: "/channel/my/stats" },
  { name: "BJ알림", path: "/channel/my/notifications" },
  { name: "팬등급", path: "/channel/my/fans" },
  { name: "블랙리스트", path: "/channel/my/blacklist" },
  { name: "클립", path: "/channel/my/clips" },
  { name: "커뮤니티", path: "/channel/my/community" },
  { name: "환전", path: "/channel/my/exchange" },
];

const ChannelNav = () => {
  const pathname = usePathname();
  
  return (
    <div className="flex w-full space-x-6 border-b border-border-secondary dark:border-border-secondary-dark pb-2 mb-8 overflow-x-auto">
      {tabRoutes.map((tab) => (
        <Link
          key={tab.name}
          href={tab.path}
          className={`text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark font-medium pb-2 ${
            pathname === tab.path 
              ? "text-text-primary dark:text-text-primary-dark border-b-2 border-primary" 
              : "hover:border-b-2 hover:border-gray-300 dark:hover:border-gray-600"
          }`}
        >
          {tab.name}
        </Link>
      ))}
    </div>
  );
};

export default ChannelNav;
