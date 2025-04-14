// components/ProfileHeader.tsx
import React from "react";
import Image from "next/image";

const ProfileHeader = () => {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="w-16 h-16 bg-gray-700 rounded-full">
        <Image
          src="/icons/anonymouse1.svg"
          alt="Profile"
          width={64}
          height={64}
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
