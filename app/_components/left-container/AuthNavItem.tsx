'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUserStore } from '@/app/_lib/stores';
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
  const { user_id } = useUserStore();
  const active = pathname === href || (href !== '/' && pathname?.startsWith(href));

  const handleClick = () => {
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
