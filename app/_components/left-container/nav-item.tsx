// components/NavItem.tsx
import React from "react";

interface NavItemProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label }) => {
  return (
    <div
      className={`flex w-full h-[60px] cursor-pointer bg-white dark:bg-darkBg`}
    >
      <div className="flex w-full m-3 items-center justify-center space-x-4 flex-row rounded-[10px] hover:bg-gray-200 dark:hover:bg-contentBg">
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </div>
      
    </div>
  );
};

export default NavItem;
