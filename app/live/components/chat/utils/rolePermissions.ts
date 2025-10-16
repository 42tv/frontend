'use client';

import { UserRole } from '@/app/_types';

/**
 * 사용자 역할에 따라 viewer list 조회 권한이 있는지 확인
 */
export const hasViewerListPermission = (role: UserRole): boolean => {
  return role === 'broadcaster' || role === 'manager';
};