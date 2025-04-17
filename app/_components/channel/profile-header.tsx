'use client';
// components/ProfileHeader.tsx
import React from "react";
import Image from "next/image";
import useUserStore from "../utils/store/userStore";

const ProfileHeader = () => {
  // useUserStore에서 profile_img 상태를 선택합니다.
  const profile_img = useUserStore(state => state.profile_img);

  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="w-16 h-16 bg-gray-700 rounded-full overflow-hidden"> {/* overflow-hidden 추가 */}
        <Image
          // 스토어에서 가져온 profile_img를 사용합니다.
          src={profile_img || "/icons/anonymouse1.svg"} // 기본값 제공
          alt="Profile"
          width={64}
          height={64}
          className="object-cover w-full h-full" // 이미지가 div를 채우도록 합니다.
        />
      </div>
      <div>
        <h1 className="text-2xl font-bold">밤새는 킬러 4203</h1>
        <p className="text-sm text-gray-400">팬 0명 · 랭킹 0위</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
