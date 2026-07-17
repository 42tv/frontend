'use client';
import React, { useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import ChargeButton from './buttons/ChargeButton';
import Login from './buttons/loginButton';
import ProfileIcon from './profile-icon/profile_icon';
import { useUserStore } from '@/app/_lib/stores';
import { useRouter } from 'next/navigation';

const Toolbar: React.FC = () => {
  const hydrated = useUserStore((state) => state.hydrated);
  const nickname = useUserStore((state) => state.nickname);
  const [searchString, setSearchString] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchString.trim())
      router.push(`/live?q=${encodeURIComponent(searchString.trim())}`);
  };

  return (
    <div className="sticky top-0 z-40 flex w-full h-[65px] items-center px-5 border-b border-[#2c2c38] bg-[#17171c] flex-shrink-0">
      <div
        className="text-[20px] font-extrabold cursor-pointer select-none flex-shrink-0 text-accent"
        onClick={() => router.push('/')}
      >
        FAIRLY<span className="text-[#72728a] font-normal text-[15px]">tv</span>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 w-[420px]">
        <div className="flex items-center h-[34px] bg-[#20202a] border border-[#2c2c38] rounded-full px-4 gap-2 focus-within:border-[#3e3e50] transition-colors">
          <CiSearch className="w-4 h-4 text-[#72728a] flex-shrink-0" />
          <input
            type="text"
            placeholder="방송 제목, BJ 검색"
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full bg-transparent text-[13px] text-[#e2e2ea] placeholder-[#72728a] focus:outline-none"
          />
        </div>
      </div>
      <div className="ml-auto flex items-center gap-3">
        {!hydrated ? (
          // 로그인 상태 확정 전에는 게스트/회원 어느 쪽도 단정하지 않고 스켈레톤 노출 (플래시 방지)
          <div className="w-[40px] h-[40px] rounded-full bg-[#20202a] animate-pulse" />
        ) : nickname ? (
          <>
            <ChargeButton />
            <ProfileIcon />
          </>
        ) : (
          <Login />
        )}
      </div>
    </div>
  );
};
export default Toolbar;
