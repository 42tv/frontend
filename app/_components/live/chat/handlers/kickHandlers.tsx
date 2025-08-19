'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Viewer, KickPayload, KickedPayload } from '@/app/_types';
import { openModal } from '@/app/_components/utils/overlay/overlayHelpers';
import ErrorMessage from '@/app/_components/modals/error_component';

export const useKickHandlers = () => {
  const router = useRouter();

  // 킥 핸들러
  const handleKickUser = useCallback((
    payload: KickPayload,
    setViewers: React.Dispatch<React.SetStateAction<Viewer[]>>
  ) => {
    console.log('User kicked:', payload);
    
    // viewers 목록에서 킥된 사용자 제거
    setViewers(prevViewers => {
      const currentViewers = Array.isArray(prevViewers) ? prevViewers : [];
      return currentViewers.filter(viewer => viewer.user_idx !== payload.user_idx);
    });
  }, []);

  // 강퇴당함 핸들러
  const handleKicked = useCallback((payload: KickedPayload) => {
    console.log('User was kicked:', payload);
    
    const message = payload.reason 
      ? `강퇴당했습니다. 사유: ${payload.reason}`
      : '강퇴당했습니다.';
    
    openModal(<ErrorMessage message={message} />, { closeButtonSize: "w-[16px] h-[16px]" });
    
    // /live 페이지로 즉시 리디렉션
    router.push('/live');
  }, [router]);

  return {
    handleKickUser,
    handleKicked,
  };
};