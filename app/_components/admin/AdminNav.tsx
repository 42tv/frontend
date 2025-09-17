'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  description: string;
}

const adminNavItems: NavItem[] = [
  { href: '/admin', label: '대시보드', description: '전체 현황' },
  { href: '/admin/policy', label: '정책 관리', description: '서비스 정책' },
  { href: '/admin/users', label: '사용자 관리', description: '계정 관리' },
  { href: '/admin/channels', label: '채널 관리', description: '방송 관리' },
  { href: '/admin/system', label: '시스템 설정', description: '환경 설정' },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-card border-r border-border w-64 min-h-screen p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-foreground">관리자 패널</h2>
        <p className="text-sm text-muted-foreground">시스템 관리</p>
      </div>
      
      <ul className="space-y-3">
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block px-4 py-4 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <div className="space-y-1">
                  <div className="font-semibold">{item.label}</div>
                  <div className={`text-sm ${
                    isActive
                      ? 'text-primary-foreground/80'
                      : 'text-muted-foreground'
                  }`}>
                    {item.description}
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      
      <div className="mt-auto pt-8">
        <Link
          href="/"
          className="block px-4 py-4 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200"
        >
          <div className="space-y-1">
            <div className="font-semibold">메인 페이지</div>
            <div className="text-sm text-muted-foreground">일반 사용자 화면으로</div>
          </div>
        </Link>
      </div>
    </nav>
  );
}