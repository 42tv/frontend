'use client';

import React from 'react';
import { MdPhoneAndroid, MdVerified, MdOutlinePhoneAndroid } from 'react-icons/md';
import { useUserStore } from '@/app/_lib/stores';
import { openModal } from '@/app/_components/utils/overlay/overlayHelpers';
import PhoneVerificationModal from '@/app/_components/modals/PhoneVerificationModal';

export default function PhoneVerificationIcon() {
  const identityVerified = useUserStore((state) => state.identity_verified);

  if (identityVerified) {
    return (
      <div
        className="relative w-[36px] h-[36px] flex items-center justify-center rounded-full"
        title="휴대폰 본인인증 완료"
      >
        <MdPhoneAndroid className="w-full h-full p-1 text-success dark:text-success-dark" />
        <MdVerified className="absolute bottom-0 right-0 w-[14px] h-[14px] text-success dark:text-success-dark" />
      </div>
    );
  }

  return (
    <div
      className="relative w-[36px] h-[36px] flex items-center justify-center cursor-pointer rounded-full hover:bg-bg-hover dark:hover:bg-bg-hover-dark transition-colors"
      title="휴대폰 본인인증이 필요합니다"
      onClick={() => openModal(<PhoneVerificationModal />)}
    >
      <MdOutlinePhoneAndroid className="w-full h-full p-1 text-text-muted dark:text-text-muted-dark" />
      <span className="absolute bottom-0 right-0 w-[12px] h-[12px] bg-warning dark:bg-warning-dark rounded-full flex items-center justify-center text-[8px] font-bold text-white leading-none">
        !
      </span>
    </div>
  );
}
