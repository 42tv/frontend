'use client';
import { useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { addManager, removeManager } from '@/app/_apis/manager';
import { kickViewer } from '@/app/_apis/live';
import { addToBlacklist } from '@/app/_apis/user';

export const useUserActions = (socket: Socket | null, broadcasterId: string) => {
    // 사용자 강퇴
    const handleKickUser = useCallback(async (viewerId: string, reason?: string) => {
        try {
            // API 호출로 강퇴 요청
            await kickViewer(broadcasterId, viewerId, reason);
            console.log(`Viewer ${viewerId} kicked`);
        } catch (error) {
            console.error('Failed to kick viewer:', error);
        }
    }, [socket, broadcasterId]);

    // 사용자 차단
    const handleBanUser = useCallback(async (userId: string) => {
        try {
            // API 호출로 블랙리스트에 추가
            await addToBlacklist(userId);
            console.log(`User ${userId} added to blacklist`);
        } catch (error) {
            console.error('Failed to ban user:', error);
        }
    }, [socket, broadcasterId]);

    // 사용자 차단 해제
    const handleUnbanUser = useCallback(async (userId: string) => {
        try {
            if (socket) {
                socket.emit('unban_user', { userId, broadcasterId });
            }
            console.log(`User ${userId} unbanned`);
        } catch (error) {
            console.error('Failed to unban user:', error);
        }
    }, [socket, broadcasterId]);

    // 매니저로 승격
    const handlePromoteManager = useCallback(async (userId: string) => {
        try {
            // API 호출로 매니저 추가
            await addManager(userId);

            // 소켓을 통한 실시간 업데이트
            if (socket) {
                socket.emit('promote_manager', { userId, broadcasterId });
            }
            console.log(`User ${userId} promoted to manager`);
        } catch (error) {
            console.error('Failed to promote user:', error);
        }
    }, [socket, broadcasterId]);

    // 매니저 해제
    const handleDemoteManager = useCallback(async (userId: string) => {
        try {
            // API 호출로 매니저 제거
            await removeManager(userId);

            // 소켓을 통한 실시간 업데이트
            if (socket) {
                socket.emit('demote_manager', { userId, broadcasterId });
            }
            console.log(`User ${userId} demoted from manager`);
        } catch (error) {
            console.error('Failed to demote user:', error);
        }
    }, [socket, broadcasterId]);

    // 쪽지 보내기
    const handleSendPrivateMessage = useCallback(async (userId: string) => {
        try {
            // TODO: 쪽지 보내기 모달 또는 페이지로 이동
            console.log(`Send private message to user ${userId}`);
        } catch (error) {
            console.error('Failed to send private message:', error);
        }
    }, []);

    return {
        handleKickUser,
        handleBanUser,
        handleUnbanUser,
        handlePromoteManager,
        handleDemoteManager,
        handleSendPrivateMessage
    };
};
