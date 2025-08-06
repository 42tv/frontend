'use client';
import { useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { addManager, removeManager } from '@/app/_apis/manager';

export const useUserActions = (socket: Socket | null, broadcasterId: string) => {
    // 사용자 강퇴
    const handleKickUser = useCallback(async (userIdx: number) => {
        try {
            if (socket) {
                socket.emit('kick_user', { userIdx, broadcasterId });
            }
            console.log(`User ${userIdx} kicked`);
        } catch (error) {
            console.error('Failed to kick user:', error);
        }
    }, [socket, broadcasterId]);

    // 사용자 차단
    const handleBanUser = useCallback(async (userIdx: number) => {
        try {
            if (socket) {
                socket.emit('ban_user', { userIdx, broadcasterId });
            }
            console.log(`User ${userIdx} banned`);
        } catch (error) {
            console.error('Failed to ban user:', error);
        }
    }, [socket, broadcasterId]);

    // 사용자 차단 해제
    const handleUnbanUser = useCallback(async (userIdx: number) => {
        try {
            if (socket) {
                socket.emit('unban_user', { userIdx, broadcasterId });
            }
            console.log(`User ${userIdx} unbanned`);
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
    const handleSendPrivateMessage = useCallback(async (userIdx: number) => {
        try {
            // TODO: 쪽지 보내기 모달 또는 페이지로 이동
            console.log(`Send private message to user ${userIdx}`);
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
