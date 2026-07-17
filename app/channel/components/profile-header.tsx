'use client';
import React from "react";
import Image from "next/image";

interface ProfileHeaderProps {
  nickname: string | null;
  profileImg: string | null;
  fanCount: number | null;
  /** 채널 정보 로딩 중 여부 — true면 확정 텍스트 대신 스켈레톤 노출 */
  loading?: boolean;
}

const ProfileHeader = ({ nickname, profileImg, fanCount, loading = false }: ProfileHeaderProps) => {
  if (loading) {
    return (
      <div className="flex items-center space-x-4 mb-6" aria-hidden="true">
        <div className="w-16 h-16 rounded-full animate-pulse bg-bg-tertiary" />
        <div className="space-y-2">
          <div className="h-7 w-36 animate-pulse rounded bg-bg-tertiary" />
          <div className="h-4 w-20 animate-pulse rounded bg-bg-tertiary" />
        </div>
      </div>
    );
  }

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
