'use client';
import { reqeustChat } from '@/app/_apis/live';
import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client'; // Socket 타입 import
import { useUserStore } from "@/app/_lib/stores"
import LoginComponent from '../../modals/login_component';
import UserActionsModal from '../../modals/user_actions_modal';
import SendMessageForm from '../../common/SendMessageForm';
import { openPopupModal, closeAllModals } from '../../utils/overlay/overlayHelpers';
import { ChatMessage, MyRole, TabType, Viewer } from '@/app/_types';

// 분리된 컴포넌트들 import
import ChatTabHeader from '../chat/ChatTabHeader';
import ChatMessageList from '../chat/ChatMessageList';
import ViewersList from '../chat/ViewersList';
import MessageInput from '../chat/MessageInput';
import { useChatSocket } from '../chat/useChatSocket';
import { useUserActions } from '../chat/useUserActions';

interface ChatProps {
    broadcasterId: string; // 스트리머 식별 (채팅방 구분을 위해)
    socket: Socket | null; // socket prop 추가
    myRole: MyRole;
}

const Chat: React.FC<ChatProps> = ({ broadcasterId, socket, myRole }) => {
    const [activeTab, setActiveTab] = useState<TabType>('chat'); // 활성 탭 상태
    const [currentMyRole, setCurrentMyRole] = useState<MyRole>(myRole); // 현재 사용자 역할 상태
    const {idx: currentUserIdx} = useUserStore();

    // myRole prop이 변경되면 currentMyRole 업데이트
    useEffect(() => {
        setCurrentMyRole(myRole);
    }, [myRole]);

    // 권한이 없어진 경우 채팅 탭으로 자동 전환
    useEffect(() => {
        const canViewManagement = currentMyRole.role === 'manager' || currentMyRole.role === 'broadcaster';
        if (!canViewManagement && activeTab === 'viewers') {
            setActiveTab('chat');
        }
    }, [currentMyRole.role, activeTab]);

    // 커스텀 훅 사용
    const { messages, viewers } = useChatSocket(socket, broadcasterId, setCurrentMyRole);
    const { 
        handleKickUser, 
        handleBanUser, 
        handlePromoteManager, 
        handleDemoteManager, 
        handleSendPrivateMessage 
    } = useUserActions(socket, broadcasterId);

    // 채팅 클릭 시 유저 정보 모달 열기
    const handleChatClick = (message: ChatMessage) => {
        if (!currentUserIdx) {
            console.log('No current user, showing login modal');
            openPopupModal(<LoginComponent />);
            return;
        }

        // 쪽지 보내기 모달 열기 함수
        const openMessageModal = () => {
            openPopupModal(
                <SendMessageForm
                    initialUserId={message.user_id}
                />
            );
        };

        openPopupModal(
            <UserActionsModal
                user={message}
                currentUser={currentMyRole}
                onClose={closeAllModals}
                onKick={handleKickUser}
                onBan={handleBanUser}
                onPromoteManager={handlePromoteManager}
                onDemoteManager={handleDemoteManager}
                onSendMessage={(userId: string, nickname: string) => handleSendPrivateMessage(userId, nickname, openMessageModal)}
            />
        );
    };

    // 시청자 클릭 핸들러
    const handleViewerClick = (viewer: Viewer) => {
        if (!currentUserIdx) {
            console.log('No current user, showing login modal');
            openPopupModal(<LoginComponent />);
            return;
        }

        // 쪽지 보내기 모달 열기 함수
        const openMessageModal = () => {
            openPopupModal(
                <SendMessageForm
                    initialUserId={viewer.user_id}
                />
            );
        };

        // Viewer를 ChatMessage 호환 형태로 변환
        const userAsMessage: ChatMessage = {
            type: 'chat',
            user_idx: viewer.user_idx,
            user_id: viewer.user_id,
            nickname: viewer.nickname,
            role: viewer.role,
            profile_img: viewer.profile_img,
            grade: viewer.grade,
            color: viewer.color,
            message: '' // 시청자는 메시지가 없으므로 빈 문자열
        };

        openPopupModal(
            <UserActionsModal
                user={userAsMessage}
                currentUser={currentMyRole}
                onClose={closeAllModals}
                onKick={handleKickUser}
                onBan={handleBanUser}
                onPromoteManager={handlePromoteManager}
                onDemoteManager={handleDemoteManager}
                onSendMessage={(userId: string, nickname: string) => handleSendPrivateMessage(userId, nickname, openMessageModal)}
            />
        );
    };

    // 메시지 전송 핸들러
    const handleSendMessage = async (message: string) => {
        try {
            await reqeustChat(broadcasterId, message);
        } catch {
            openPopupModal(<LoginComponent />);
        }
    };

    return (
        <div className="flex flex-col h-full bg-bg-secondary dark:bg-bg-secondary-dark text-text-primary dark:text-text-primary-dark">
            {/* 탭 헤더 */}
            <ChatTabHeader 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                viewersCount={viewers.length}
                canViewManagement={currentMyRole.role === 'manager' || currentMyRole.role === 'broadcaster'}
            />

            {/* 탭 컨텐츠 영역 */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
                {activeTab === 'chat' ? (
                    <ChatMessageList 
                        messages={messages}
                        onChatClick={handleChatClick}
                    />
                ) : (
                    <ViewersList 
                        viewers={viewers}
                        onViewerClick={handleViewerClick}
                    />
                )}
            </div>

            {/* 메시지 입력 - 채팅 탭에서만 표시 */}
            {activeTab === 'chat' && (
                <MessageInput onSendMessage={handleSendMessage} />
            )}
        </div>
    );
};

export default Chat;
