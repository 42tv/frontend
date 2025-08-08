'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { Message, ChatMessage, Viewer, OpCode, RoleChangePayload } from '@/app/_types';
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
            // prevViewers가 배열이 아닌 경우 빈 배열로 초기화
            const currentViewers = Array.isArray(prevViewers) ? prevViewers : [];
            // 중복 방지를 위해 기존에 있는지 확인
            const exists = currentViewers.some(viewer => viewer.user_idx === viewerData.user_idx);
            if (!exists) {
                return [...currentViewers, viewerData];
            }
            return currentViewers;
        });
    }, []);

    // 시청자 퇴장 핸들러
    const handleViewerLeave = useCallback((viewerData: { user_idx: number }) => {
        setViewers(prevViewers => {
            // prevViewers가 배열이 아닌 경우 빈 배열로 초기화
            const currentViewers = Array.isArray(prevViewers) ? prevViewers : [];
            return currentViewers.filter(viewer => viewer.user_idx !== viewerData.user_idx);
        });
    }, []);

    // 역할 변경 핸들러
    const handleRoleChanged = useCallback((payload: RoleChangePayload) => {
        console.log('Role change received:', payload);
        
        // viewers 목록에서 해당 사용자의 역할 업데이트
        setViewers(prevViewers => {
            const currentViewers = Array.isArray(prevViewers) ? prevViewers : [];
            return currentViewers.map(viewer => 
                viewer.user_idx === payload.user_idx 
                    ? { ...viewer, role: payload.to_role }
                    : viewer
            );
        });

        // messages에서 해당 사용자의 역할과 색상 업데이트 (ChatMessage만)
        setMessages(prevMessages => {
            return prevMessages.map(message => {
                if (message.type === 'chat' && (message as ChatMessage).user_idx === payload.user_idx) {
                    return {
                        ...message,
                        role: payload.to_role,
                        color: payload.to_color
                    } as ChatMessage;
                }
                return message;
            });
        });

        // 매니저로 승격되었을 때 추가 동작 (기존 로직 유지)
        if (payload.to_role === 'manager') {
            fetchViewersList();
            
            if (!viewersIntervalRef.current) {
                viewersIntervalRef.current = setInterval(() => {
                    fetchViewersList();
                }, 60000);
            }
            
            if (socket) {
                socket.emit('get_viewers_list', { broadcasterId });
            }
        } else if (payload.from_role === 'manager') {
            // 매니저에서 다른 역할로 변경되었을 때 갱신 중지
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
            socket.on(OpCode.CHAT, handleChatMessage);
            socket.on(OpCode.VIEWER_LIST, handleViewersUpdate);
            socket.on(OpCode.ROLE_CHANGE, handleRoleChanged);
            socket.on(OpCode.USER_JOIN, handleViewerJoin);
            socket.on(OpCode.USER_LEAVE, handleViewerLeave);

            return () => {
                socket.off(OpCode.CHAT, handleChatMessage);
                socket.off(OpCode.VIEWER_LIST, handleViewersUpdate);
                socket.off(OpCode.ROLE_CHANGE, handleRoleChanged);
                socket.off(OpCode.USER_JOIN, handleViewerJoin);
                socket.off(OpCode.USER_LEAVE, handleViewerLeave);
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
