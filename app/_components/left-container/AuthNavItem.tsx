import React from 'react';
import { useRouter } from 'next/navigation';
import useUserStore from '../utils/store/userStore';
import useModalStore from '../utils/store/modalStore';
import LoginComponent from '../modals/login_component';

interface AuthNavItemProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  href: string;
}

const AuthNavItem: React.FC<AuthNavItemProps> = ({ icon: Icon, label, href }) => {
  const router = useRouter();
  const { user_id } = useUserStore();
  const { openModal } = useModalStore();

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
      className={`flex w-full h-[60px] cursor-pointer bg-white dark:bg-darkBg`}
    >
      <div className="flex w-full m-3 items-center justify-start space-x-4 flex-row rounded-[10px] hover:bg-gray-200 dark:hover:bg-contentBg">
        <Icon className="ml-5 w-5 h-5" />
        <span>{label}</span>
      </div>
    </div>
  );
};

export default AuthNavItem;