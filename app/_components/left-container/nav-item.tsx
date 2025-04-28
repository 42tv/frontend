// components/NavItem.tsx
import React from "react";
import Link from "next/link"; // Link 임포트 추가

interface NavItemProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  href: string; // href prop 추가
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, href }) => { // href prop 받기
  return (
    <Link href={href} passHref> {/* Link 컴포넌트로 감싸기 */}
      <div
        className={`flex w-full h-[60px] cursor-pointer bg-white dark:bg-darkBg`}
      >
        {/* justify-center를 justify-start로 변경하고 px-4 추가 */}
        <div className="flex w-full m-3 items-center justify-start space-x-4 flex-row rounded-[10px] hover:bg-gray-200 dark:hover:bg-contentBg">
        <Icon className="ml-7 w-5 h-5" />
        <span>{label}</span>
      </div>
      </div>
    </Link>
  );
};

export default NavItem;
