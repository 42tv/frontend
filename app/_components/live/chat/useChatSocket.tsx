'use client';
import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { Message, Viewer, OpCode } from '@/app/_types';

// Handlers
import { useChatHandlers } from './handlers/chatHandlers';
import { useViewerHandlers } from './handlers/viewerHandlers';
import { useRoleHandlers } from './handlers/roleHandlers';
import { useKickHandlers } from './handlers/kickHandlers';

// Hooks
import { useViewersManager } from './hooks/useViewersManager';

export const useChatSocket = (socket: Socket | null, broadcasterId: string) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [viewers, setViewers] = useState<Viewer[]>([]);

    // Hooks
    const { fetchViewersList, viewersIntervalRef } = useViewersManager(broadcasterId, setViewers);
    const { handleChatMessage } = useChatHandlers();
    const { handleViewersUpdate, handleViewerJoin, handleViewerLeave } = useViewerHandlers();
    const { handleRoleChanged } = useRoleHandlers(socket, broadcasterId, fetchViewersList, viewersIntervalRef);
    const { handleKickUser, handleKicked } = useKickHandlers();

    // 소켓 이벤트 등록
    useEffect(() => {
        console.log("Setting up chat socket:", socket);
        if (socket) {
            const wrappedHandleChatMessage = (message: any) => handleChatMessage(message, setMessages);
            const wrappedHandleViewersUpdate = (viewersData: any) => handleViewersUpdate(viewersData, setViewers);
            const wrappedHandleViewerJoin = (viewerData: any) => handleViewerJoin(viewerData, setViewers);
            const wrappedHandleViewerLeave = (viewerData: any) => handleViewerLeave(viewerData, setViewers);
            const wrappedHandleRoleChanged = (payload: any) => handleRoleChanged(payload, setViewers, setMessages);
            const wrappedHandleKickUser = (payload: any) => handleKickUser(payload, setViewers);

            socket.on(OpCode.CHAT, wrappedHandleChatMessage);
            socket.on(OpCode.VIEWER_LIST, wrappedHandleViewersUpdate);
            socket.on(OpCode.ROLE_CHANGE, wrappedHandleRoleChanged);
            socket.on(OpCode.USER_JOIN, wrappedHandleViewerJoin);
            socket.on(OpCode.USER_LEAVE, wrappedHandleViewerLeave);
            socket.on(OpCode.KICK, wrappedHandleKickUser);
            socket.on(OpCode.KICKED, handleKicked);

            return () => {
                socket.off(OpCode.CHAT, wrappedHandleChatMessage);
                socket.off(OpCode.VIEWER_LIST, wrappedHandleViewersUpdate);
                socket.off(OpCode.ROLE_CHANGE, wrappedHandleRoleChanged);
                socket.off(OpCode.USER_JOIN, wrappedHandleViewerJoin);
                socket.off(OpCode.USER_LEAVE, wrappedHandleViewerLeave);
                socket.off(OpCode.KICK, wrappedHandleKickUser);
                socket.off(OpCode.KICKED, handleKicked);
            };
        }
    }, [socket, handleChatMessage, handleViewersUpdate, handleRoleChanged, handleViewerJoin, handleViewerLeave, handleKickUser, handleKicked]);

    return {
        messages,
        viewers,
        setViewers,
        fetchViewersList
    };
};
