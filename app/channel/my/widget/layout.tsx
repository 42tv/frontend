'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const subNav = [
  { label: "채팅", href: "/channel/my/widget/chatbox" },
  { label: "후원", href: "/channel/my/widget/donation" },
];

export default function WidgetLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      <div
        role="tablist"
        className="inline-flex items-center gap-1 rounded-xl border border-border-primary bg-bg-secondary p-1"
      >
        {subNav.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              role="tab"
              aria-selected={isActive}
              className={`rounded-lg px-5 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-background text-text-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {children}
    </div>
  );
}
