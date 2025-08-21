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
    default: "text-text-primary dark:text-text-primary-dark hover:bg-gray-100 dark:hover:bg-gray-700",
    danger: "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20",
    primary: "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
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