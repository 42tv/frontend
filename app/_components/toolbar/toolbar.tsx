'use client';
// components/Toolbar.tsx
import React, { useEffect } from 'react';
import ToggleTheme from './buttons/ToggleTheme';
import Login from './buttons/loginButton';
import Search from './search/search';
import Logo from '../logo/logo';
import ProfileIcon from './profile-icon/profile_icon';
import useUserStore from '../utils/store/userStore';

const Toolbar: React.FC = () => {
  const fetchUser = useUserStore((state) => state.fetchUser);
  const nickname = useUserStore((state) => state.nickname);
  

    useEffect(() => {
        fetchUser();
    }, []);

  return (
    <div className="fixed top-0 left-0 z-50 flex w-full h-[65px] items-center justify-between shadow-md border-border-primary dark:border-border-primary-dark border-b bg-background dark:bg-background-dark flex-shrink-0">
      <Logo width='40pt' height='40pt'/>
      <Search />
      <div className="flex h-full gap-4 text-center items-center ml-auto mr-4">
        <ToggleTheme />
        {
          nickname ? <ProfileIcon/> : <Login />
        }
      </div>
    </div>
  );
};

export default Toolbar;