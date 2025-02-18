// components/NavItem.tsx
import React from "react";

interface NavItemProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label }) => {
  return (
    <div
      className={`flex w-full pl-8 items-center p-2 space-x-4 cursor-pointer font-semibold hover:bg-gray-200`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </div>
  );
};

export default NavItem;
