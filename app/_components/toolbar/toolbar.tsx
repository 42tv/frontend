'use client';
// components/Toolbar.tsx
import React, { useEffect } from 'react';
import ToggleTheme from './buttons/ToggleTheme';
import Login from './buttons/loginButton';
import Search from './search/serach';
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
    <div>
      <div className="fixed flex w-full h-[65px] items-center justify-between shadow-md z-50 border-contentBg border-b bg-white dark:bg-toolbarBg-dark bg-toolbarBg">
        <Logo width='40pt' height='40pt'/>
        <Search />
        <div className="flex h-full gap-4 text-center items-center ml-auto mr-4">
          <ToggleTheme />
          {
            nickname ? <ProfileIcon/> : <Login />
          }
        </div>
      </div>
    </div>
    
  );
};

export default Toolbar;