'use client';
// components/ChannelNav.tsx
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabRoutes = [
  { name: "BJ공지사항", path: "/channel/my/article" },
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
    <div className="flex w-full space-x-6 pb-2 mb-8 overflow-x-auto" style={{ borderBottom: '1px solid var(--bg-300)' }}>
      {tabRoutes.map((tab) => (
        <Link
          key={tab.name}
          href={tab.path}
          className={`font-medium pb-2 transition-colors whitespace-nowrap ${
            pathname === tab.path 
              ? "border-b-2" 
              : "hover:border-b-2"
          }`}
          style={{
            color: pathname === tab.path ? 'var(--accent-100)' : 'var(--text-200)',
            borderBottomColor: pathname === tab.path ? 'var(--accent-100)' : 'transparent',
            ...(pathname !== tab.path && {
              ':hover': {
                color: 'var(--accent-100)',
                borderBottomColor: 'var(--accent-100)'
              }
            })
          }}
          onMouseEnter={(e) => {
            if (pathname !== tab.path) {
              e.currentTarget.style.color = 'var(--accent-100)';
              e.currentTarget.style.borderBottomColor = 'var(--accent-100)';
            }
          }}
          onMouseLeave={(e) => {
            if (pathname !== tab.path) {
              e.currentTarget.style.color = 'var(--text-200)';
              e.currentTarget.style.borderBottomColor = 'transparent';
            }
          }}
        >
          {tab.name}
        </Link>
      ))}
    </div>
  );
};

export default ChannelNav;
