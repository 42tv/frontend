'use client';
import React from "react";
import Image from "next/image";

interface ProfileHeaderProps {
  nickname: string | null;
  profileImg: string | null;
  fanCount: number | null;
}

const ProfileHeader = ({ nickname, profileImg, fanCount }: ProfileHeaderProps) => {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="w-16 h-16 rounded-full overflow-hidden bg-bg-tertiary">
        <Image
          src={profileImg || "/icons/anonymouse1.svg"}
          alt="Profile"
          width={64}
          height={64}
          className="object-cover w-full h-full"
        />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          {nickname ?? ''}
        </h1>
        <p className="text-sm text-text-secondary">
          팬 {fanCount !== null ? `${fanCount}명` : '집계 전'}
        </p>
      </div>
    </div>
  );
};

export default ProfileHeader;
