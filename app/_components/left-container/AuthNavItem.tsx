import React from 'react';
import { useRouter } from 'next/navigation';
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
  const { user_id } = useUserStore();

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
      className={`flex w-full h-[60px] cursor-pointer bg-background dark:bg-background-dark`}
    >
      <div className="flex w-full m-3 items-center justify-start space-x-4 flex-row rounded-[10px] hover:bg-bg-tertiary">
        <Icon className="ml-7 w-5 h-5" />
        <span>{label}</span>
      </div>
    </div>
  );
};

export default AuthNavItem;