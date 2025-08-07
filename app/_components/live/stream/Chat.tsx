'use client';
import { reqeustChat } from '@/app/_apis/live';
import React, { useState } from 'react';
import { Socket } from 'socket.io-client'; // Socket 타입 import
import useUserStore from '../../utils/store/userStore';
import LoginComponent from '../../modals/login_component';
import UserActionsModal from '../../modals/user_actions_modal';
import popupModalStore from '../../utils/store/popupModalStore';
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
    broadcasterIdx: number; // 방송자의 idx
}

const Chat: React.FC<ChatProps> = ({ broadcasterId, socket, myRole, broadcasterIdx }) => {
    const [activeTab, setActiveTab] = useState<TabType>('chat'); // 활성 탭 상태
    const {openPopup, closePopup} = popupModalStore();
    const {idx: currentUserIdx} = useUserStore();

    // 커스텀 훅 사용
    const { messages, viewers } = useChatSocket(socket, broadcasterId);
    const { 
        handleKickUser, 
        handleBanUser, 
        handleUnbanUser, 
        handlePromoteManager, 
        handleDemoteManager, 
        handleSendPrivateMessage 
    } = useUserActions(socket, broadcasterId);

    // 채팅 클릭 시 유저 정보 모달 열기
    const handleChatClick = (message: ChatMessage) => {
        console.log('Chat clicked:', message);
        console.log('Current user idx:', currentUserIdx);
        console.log('Current user role:', myRole);
        
        if (!currentUserIdx) {
            console.log('No current user, showing login modal');
            openPopup(<LoginComponent />);
            return;
        }

        openPopup(
            <UserActionsModal
                user={message}
                currentUser={myRole}
                onClose={closePopup}
                onKick={handleKickUser}
                onBan={handleBanUser}
                onUnban={handleUnbanUser}
                onPromoteManager={handlePromoteManager}
                onDemoteManager={handleDemoteManager}
                onSendMessage={handleSendPrivateMessage}
            />
        );
    };

    // 시청자 클릭 핸들러
    const handleViewerClick = (viewer: Viewer) => {
        // console.log('Viewer clicked:', viewer);
        // console.log('Current user idx:', currentUserIdx);
        // console.log('Current user role:', myRole);
        
        // if (!currentUserIdx) {
        //     console.log('No current user, showing login modal');
        //     openPopup(<LoginComponent />);
        //     return;
        // }

        // console.log('Opening user actions modal with:', { userInfo: viewer, myRole });

        // openPopup(
        //     <UserActionsModal
        //         user={viewer}
        //         currentUser={myRole}
        //         onClose={closePopup}
        //         onKick={handleKickUser}
        //         onBan={handleBanUser}
        //         onUnban={handleUnbanUser}
        //         onPromoteManager={handlePromoteManager}
        //         onDemoteManager={handleDemoteManager}
        //         onSendMessage={handleSendPrivateMessage}
        //     />
        // );
    };

    // 메시지 전송 핸들러
    const handleSendMessage = async (message: string) => {
        try {
            await reqeustChat(broadcasterId, message);
        } catch (e: any) {
            openPopup(<LoginComponent />);
        }
    };

    return (
        <div className="flex flex-col h-full bg-bg-secondary dark:bg-bg-secondary-dark text-text-primary dark:text-text-primary-dark">
            {/* 탭 헤더 */}
            <ChatTabHeader 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                viewersCount={viewers.length}
                canViewManagement={myRole.role === 'manager' || myRole.role === 'broadcaster'}
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
