'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItemProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  href: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, href }) => {
  const pathname = usePathname();
  const active = pathname === href || (href !== '/' && pathname?.startsWith(href));

  return (
    <Link href={href} passHref>
      <div
        className={`flex items-center gap-2.5 px-4 py-[9px] text-[14px] cursor-pointer transition-colors border-l-[3px]
          ${active
            ? 'border-accent bg-[#20202a] text-[#e2e2ea] font-semibold'
            : 'border-l-transparent text-[#72728a] hover:bg-[#20202a] hover:text-[#e2e2ea]'
          }`}
      >
        <Icon className="w-[16px] h-[16px] opacity-80 flex-shrink-0" />
        <span>{label}</span>
      </div>
    </Link>
  );
};

export default NavItem;
