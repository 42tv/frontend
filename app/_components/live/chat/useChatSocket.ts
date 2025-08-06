'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { Message, ChatMessage, Viewer } from '@/app/_types';
import { getViewersList } from '@/app/_apis/live';

export const useChatSocket = (socket: Socket | null, broadcasterId: string) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [viewers, setViewers] = useState<Viewer[]>([]);
    const viewersIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // API를 통해 시청자 리스트 가져오기
    const fetchViewersList = useCallback(async () => {
        try {
            const response = await getViewersList(broadcasterId);
            console.log(response);
            if (response) {
                setViewers(response.viewers);
                console.log('Viewers list fetched from API:', response.viewers);
            }
        } catch (error) {
            console.error('Failed to fetch viewers list:', error);
        }
    }, [broadcasterId]);

    // 채팅 메시지 핸들러
    const handleChatMessage = useCallback((message: ChatMessage) => {
        console.log('Chat message received:', message);
        setMessages(prevMessages => [...prevMessages, message]);
    }, []);

    // 시청자 목록 업데이트 핸들러
    const handleViewersUpdate = useCallback((viewersData: Viewer[]) => {
        setViewers(viewersData);
    }, []);

    // 시청자 입장 핸들러
    const handleViewerJoin = useCallback((viewerData: Viewer) => {
        setViewers(prevViewers => {
            // 중복 방지를 위해 기존에 있는지 확인
            const exists = prevViewers.some(viewer => viewer.user_idx === viewerData.user_idx);
            if (!exists) {
                return [...prevViewers, viewerData];
            }
            return prevViewers;
        });
    }, []);

    // 시청자 퇴장 핸들러
    const handleViewerLeave = useCallback((viewerData: { user_idx: number }) => {
        setViewers(prevViewers => 
            prevViewers.filter(viewer => viewer.user_idx !== viewerData.user_idx)
        );
    }, []);

    // 역할 변경 핸들러 (매니저로 승격되었을 때)
    const handleRoleChanged = useCallback((newRole: string) => {
        console.log('Role changed to:', newRole);
        if (newRole === 'manager') {
            // 매니저나 방송자가 되었을 때 시청자 목록 갱신 시작
            fetchViewersList();
            
            if (!viewersIntervalRef.current) {
                viewersIntervalRef.current = setInterval(() => {
                    fetchViewersList();
                }, 60000);
            }
            
            if (socket) {
                socket.emit('get_viewers_list', { broadcasterId });
            }
        } else {
            // 매니저나 방송자가 아니게 되었을 때 갱신 중지
            if (viewersIntervalRef.current) {
                clearInterval(viewersIntervalRef.current);
                viewersIntervalRef.current = null;
            }
        }
    }, [socket, broadcasterId, fetchViewersList]);

    // 소켓 이벤트 등록
    useEffect(() => {
        console.log("Setting up chat socket:", socket);
        if (socket) {
            socket.on('chat', handleChatMessage);
            socket.on('viewer_list', handleViewersUpdate);
            socket.on('role_changed', handleRoleChanged);
            socket.on('join', handleViewerJoin);
            socket.on('leave', handleViewerLeave);

            return () => {
                socket.off('chat', handleChatMessage);
                socket.off('viewer_list', handleViewersUpdate);
                socket.off('role_changed', handleRoleChanged);
                socket.off('join', handleViewerJoin);
                socket.off('leave', handleViewerLeave);
            };
        }
    }, [socket, handleChatMessage, handleViewersUpdate, handleRoleChanged, handleViewerJoin, handleViewerLeave]);

    // 컴포넌트 언마운트 시 인터벌 정리
    useEffect(() => {
        return () => {
            if (viewersIntervalRef.current) {
                clearInterval(viewersIntervalRef.current);
                viewersIntervalRef.current = null;
            }
        };
    }, []);

    return {
        messages,
        viewers,
        setViewers,
        fetchViewersList
    };
};
