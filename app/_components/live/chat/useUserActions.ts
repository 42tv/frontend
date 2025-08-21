'use client';
import { useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { addManager, removeManager } from '@/app/_apis/manager';
import { kickViewer } from '@/app/_apis/live';
import { addToBlacklist } from '@/app/_apis/user';

export const useUserActions = (_socket: Socket | null, broadcasterId: string) => {
    // 사용자 강퇴
    const handleKickUser = useCallback(async (viewerId: string, reason?: string) => {
        try {
            // API 호출로 강퇴 요청
            await kickViewer(broadcasterId, viewerId, reason);
            console.log(`Viewer ${viewerId} kicked`);
        } catch (error) {
            console.error('Failed to kick viewer:', error);
        }
    }, [broadcasterId]);

    // 사용자 차단
    const handleBanUser = useCallback(async (userId: string) => {
        try {
            // API 호출로 블랙리스트에 추가
            await addToBlacklist(userId);
            console.log(`User ${userId} added to blacklist`);
        } catch (error) {
            console.error('Failed to ban user:', error);
        }
    }, []);

    // 매니저로 승격
    const handlePromoteManager = useCallback(async (userId: string) => {
        try {
            // API 호출로 매니저 추가
            await addManager(userId);
            console.log(`User ${userId} promoted to manager`);
        } catch (error) {
            console.error('Failed to promote user:', error);
        }
    }, []);

    // 매니저 해제
    const handleDemoteManager = useCallback(async (userId: string) => {
        try {
            // API 호출로 매니저 제거
            await removeManager(userId);
            console.log(`User ${userId} demoted from manager`);
        } catch (error) {
            console.error('Failed to demote user:', error);
        }
    }, []);

    // 쪽지 보내기 - 모달 교체 함수 반환
    const handleSendPrivateMessage = useCallback((userId: string, _nickname: string, openMessageModal: () => void) => {
        try {
            // 쪽지 보내기 모달 열기
            openMessageModal();
            console.log(`Opening message modal for user ${userId}`);
        } catch (error) {
            console.error('Failed to open message modal:', error);
        }
    }, []);

    return {
        handleKickUser,
        handleBanUser,
        handlePromoteManager,
        handleDemoteManager,
        handleSendPrivateMessage
    };
};
