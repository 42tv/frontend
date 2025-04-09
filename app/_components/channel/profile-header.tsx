// components/ProfileHeader.tsx
import React from "react";

const ProfileHeader = () => {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="w-16 h-16 bg-gray-700 rounded-full">
        <img
          src="/images/profile.png"
          alt="Profile"
          className="w-full h-full rounded-full object-cover"
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
