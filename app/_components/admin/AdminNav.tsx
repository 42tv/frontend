'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon?: string;
}

const adminNavItems: NavItem[] = [
  { href: '/admin', label: '대시보드', icon: '📊' },
  { href: '/admin/policy', label: '정책 관리', icon: '📋' },
  { href: '/admin/users', label: '사용자 관리', icon: '👥' },
  { href: '/admin/channels', label: '채널 관리', icon: '📺' },
  { href: '/admin/system', label: '시스템 설정', icon: '⚙️' },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-card border-r border-border w-64 min-h-screen p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-foreground">관리자 패널</h2>
        <p className="text-sm text-muted-foreground">시스템 관리</p>
      </div>
      
      <ul className="space-y-2">
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-foreground hover:bg-accent/50 hover:text-accent-foreground'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      
      <div className="mt-auto pt-8">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground transition-colors"
        >
          <span className="text-lg">🏠</span>
          <span className="font-medium">메인으로 돌아가기</span>
        </Link>
      </div>
    </nav>
  );
}