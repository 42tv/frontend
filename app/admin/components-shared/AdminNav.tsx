'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconType } from "react-icons";
import {
  FiHome,
  FiUsers,
  FiVideo,
  FiFlag,
  FiMessageSquare,
  FiCreditCard,
  FiShoppingBag,
  FiFileText,
  FiBarChart2,
  FiSettings,
  FiArrowLeft,
} from "react-icons/fi";
import { useAdminPendingCounts } from "../_hooks/useAdminPendingCounts";

interface NavItem {
  href: string;
  label: string;
  icon: IconType;
  match?: string[]; // href 외에 활성 상태로 취급할 경로 prefix
  badgeKey?: 'reports' | 'inquiries' | 'refundRequests'; // 미처리 건수 뱃지 매핑 키
}

// §15 프론트엔드 메뉴 구조 기준 (관리자 기능 정의서) — 하위 메뉴 없이 상위 메뉴만 노출
const navItems: NavItem[] = [
  { href: '/admin', label: '대시보드', icon: FiHome },
  { href: '/admin/users', label: '회원 관리', icon: FiUsers },
  { href: '/admin/broadcast', label: '방송 관리', icon: FiVideo },
  { href: '/admin/reports', label: '신고 센터', icon: FiFlag, badgeKey: 'reports' },
  { href: '/admin/inquiries', label: '1:1 문의', icon: FiMessageSquare, badgeKey: 'inquiries' },
  {
    href: '/admin/payments',
    label: '결제/정산',
    icon: FiCreditCard,
    match: ['/admin/settlement'],
    badgeKey: 'refundRequests',
  },
  { href: '/admin/products', label: '상품 관리', icon: FiShoppingBag },
  { href: '/admin/content', label: '콘텐츠', icon: FiFileText, match: ['/admin/policy'] },
  { href: '/admin/statistics', label: '통계/리포트', icon: FiBarChart2 },
  { href: '/admin/system', label: '시스템', icon: FiSettings },
];

export default function AdminNav() {
  const pathname = usePathname();
  const { pendingReports, pendingInquiries, pendingRefundRequests } = useAdminPendingCounts();
  const badgeCounts: Record<NonNullable<NavItem['badgeKey']>, number> = {
    reports: pendingReports,
    inquiries: pendingInquiries,
    refundRequests: pendingRefundRequests,
  };

  const isActivePath = (href: string): boolean =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  const isActiveItem = (item: NavItem): boolean =>
    isActivePath(item.href) || (item.match?.some((prefix) => pathname.startsWith(prefix)) ?? false);

  return (
    <nav className="bg-card border-r border-border w-64 min-h-screen p-4 flex flex-col">
      <div className="mb-6 px-3 pt-2">
        <h2 className="text-xl font-bold text-foreground">관리자 콘솔</h2>
        <p className="text-sm text-muted-foreground">42TV 운영 관리</p>
      </div>

      <ul className="space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveItem(item);
          const badge = item.badgeKey ? badgeCounts[item.badgeKey] : 0;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Icon
                  size={18}
                  className={`shrink-0 ${isActive ? '' : 'text-muted-foreground'}`}
                  aria-hidden
                />
                {item.label}
                {badge > 0 && (
                  <span className="ml-auto min-w-[20px] h-[20px] px-1.5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-semibold">
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="pt-4 border-t border-border mt-4">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <FiArrowLeft size={18} className="shrink-0" aria-hidden />
          메인 페이지로
        </Link>
      </div>
    </nav>
  );
}
