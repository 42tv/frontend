import React from 'react';

interface MenuItemProps {
  onClick: () => void;
  icon: React.ReactNode;
  text: string;
  variant?: 'default' | 'danger' | 'primary';
}

const MenuItem: React.FC<MenuItemProps> = ({ 
  onClick, 
  icon, 
  text, 
  variant = 'default' 
}) => {
  const baseClasses = "w-full px-4 py-3 flex items-center gap-3 text-left transition-colors";
  const variantClasses = {
    default: "text-text-primary hover:bg-bg-tertiary",
    danger: "text-red-400 hover:bg-red-900/20",
    primary: "text-accent hover:bg-accent/20"
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      <span className="w-5 h-5 flex-shrink-0">{icon}</span>
      <span className="flex-1">{text}</span>
    </button>
  );
};

export default MenuItem;