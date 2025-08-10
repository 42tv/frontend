'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { useRouter } from 'next/navigation';
import { Message, ChatMessage, Viewer, OpCode, RoleChangePayload, KickPayload, KickedPayload } from '@/app/_types';
import { getViewersList } from '@/app/_apis/live';
import errorModalStore from '@/app/_components/utils/store/errorModalStore';
import ErrorMessage from '@/app/_components/modals/error_component';

export const useChatSocket = (socket: Socket | null, broadcasterId: string) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [viewers, setViewers] = useState<Viewer[]>([]);
    const viewersIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const router = useRouter();
    const { openError } = errorModalStore();

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
        console.log(viewersData);
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
        
        // viewers 목록에서 해당 사용자의 역할과 등급 업데이트
        setViewers(prevViewers => {
            const currentViewers = Array.isArray(prevViewers) ? prevViewers : [];
            return currentViewers.map(viewer => {
                if (viewer.user_idx === payload.user_idx) {
                    return { 
                        ...viewer, 
                        role: payload.to_role,
                        grade: payload.to_grade,
                        color: payload.to_color
                    };
                }
                return viewer;
            });
        });

        // messages에서 해당 사용자의 역할과 색상 업데이트 (ChatMessage만)
        setMessages(prevMessages => {
            return prevMessages.map(message => {
                if (message.type === 'chat' && (message as ChatMessage).user_idx === payload.user_idx) {
                    return {
                        ...message,
                        role: payload.to_role,
                        grade: payload.to_grade,
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

    // 킥 핸들러
    const handleKickUser = useCallback((payload: KickPayload) => {
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
        
        openError(React.createElement(ErrorMessage, { message }));
        
        // /live 페이지로 즉시 리디렉션
        router.push('/live');
    }, [openError, router]);

    // 소켓 이벤트 등록
    useEffect(() => {
        console.log("Setting up chat socket:", socket);
        if (socket) {
            socket.on(OpCode.CHAT, handleChatMessage);
            socket.on(OpCode.VIEWER_LIST, handleViewersUpdate);
            socket.on(OpCode.ROLE_CHANGE, handleRoleChanged);
            socket.on(OpCode.USER_JOIN, handleViewerJoin);
            socket.on(OpCode.USER_LEAVE, handleViewerLeave);
            socket.on(OpCode.KICK, handleKickUser);
            socket.on(OpCode.KICKED, handleKicked);

            return () => {
                socket.off(OpCode.CHAT, handleChatMessage);
                socket.off(OpCode.VIEWER_LIST, handleViewersUpdate);
                socket.off(OpCode.ROLE_CHANGE, handleRoleChanged);
                socket.off(OpCode.USER_JOIN, handleViewerJoin);
                socket.off(OpCode.USER_LEAVE, handleViewerLeave);
                socket.off(OpCode.KICK, handleKickUser);
                socket.off(OpCode.KICKED, handleKicked);
            };
        }
    }, [socket, handleChatMessage, handleViewersUpdate, handleRoleChanged, handleViewerJoin, handleViewerLeave, handleKickUser, handleKicked]);

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
