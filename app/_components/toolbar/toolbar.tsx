'use client';
// components/Toolbar.tsx
import React, { useEffect } from 'react';
import ToggleTheme from './buttons/ToggleTheme';
import Login from './buttons/loginButton';
import Search from './search/serach';
import Logo from '../logo/logo';
import ProfileIcon from './profile-icon/profile_icon';
import { getInfo } from '@/app/_apis/user';
import { UserResponse } from '../utils/interfaces';

const Toolbar: React.FC = () => {
  const [userInfo, setUserInfo] = React.useState<UserResponse | null>(null);
  useEffect(() => {
    async function getUserInfo() {
      try {
        const response: UserResponse = await getInfo();
        setUserInfo(response);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      catch(e) {
        setUserInfo(null);
      }
    }
    getUserInfo();
  }, [])

  return (
    <div>
      <div className="fixed flex w-full h-[65px] items-center justify-between shadow-md z-50 border-contentBg border-b dark:bg-toolbarBg">
        <Logo width='40pt' height='40pt'/>
        <div className="font-bold text-lg sm:text-xl"></div>
        <div className="flex h-full gap-4 text-center items-center">
          <Search />
          <ToggleTheme />
          {
            userInfo ? <ProfileIcon user={userInfo}/> : <Login />
          }
        </div>
      </div>
    </div>
    
  );
};

export default Toolbar;