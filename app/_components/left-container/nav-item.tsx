// components/NavItem.tsx
import React from "react";

interface NavItemProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label }) => {
  return (
    <div
      className={`flex w-full pl-8 items-center p-2 space-x-4 cursor-pointer 
      bg-white dark:bg-[#121212] dark:bg-gray-900 
      hover:bg-gray-400 dark:hover:bg-gray-800`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-gray-900 dark:text-white">{label}</span>
    </div>
  );
};

export default NavItem;
