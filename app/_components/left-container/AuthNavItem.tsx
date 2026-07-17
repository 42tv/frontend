'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ensureAuthHydrated } from '@/app/_lib/utils';
import LoginComponent from '../modals/login_component';
import { openModal } from '../utils/overlay/overlayHelpers';

interface AuthNavItemProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  href: string;
}

const AuthNavItem: React.FC<AuthNavItemProps> = ({ icon: Icon, label, href }) => {
  const router = useRouter();
  const pathname = usePathname();
  const active = pathname === href || (href !== '/' && pathname?.startsWith(href));

  const handleClick = async (): Promise<void> => {
    // 새로고침 직후 하이드레이션 전 클릭 시 로그인 모달 오발 방지
    const { user_id } = await ensureAuthHydrated();
    if (user_id) {
      router.push(href);
    } else {
      openModal(<LoginComponent />);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center gap-2.5 px-4 py-[9px] text-[14px] cursor-pointer transition-colors border-l-[3px]
        ${active
          ? 'border-accent bg-[#20202a] text-[#e2e2ea] font-semibold'
          : 'border-l-transparent text-[#72728a] hover:bg-[#20202a] hover:text-[#e2e2ea]'
        }`}
    >
      <Icon className="w-[16px] h-[16px] opacity-80 flex-shrink-0" />
      <span>{label}</span>
    </div>
  );
};

export default AuthNavItem;
