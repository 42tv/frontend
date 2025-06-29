'use client';
import { reqeustChat } from '@/app/_apis/live';
import React, { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client'; // Socket 타입 import
import useModalStore from '../../utils/store/modalStore';
import useUserStore from '../../utils/store/userStore';
import LoginComponent from '../../modals/login_component';
import UserActionsModal from '../../modals/user_actions_modal';
import popupModalStore from '../../utils/store/popupModalStore';

interface ChatProps {
    broadcasterId: string; // 스트리머 식별 (채팅방 구분을 위해)
    socket: Socket | null; // socket prop 추가
    currentUserRole?: 'broadcaster' | 'manager' | 'viewer'; // 현재 유저의 역할
    broadcasterIdx?: number; // 방송자의 idx
}

type MessageType = 'chat' | 'donation' | 'recommend';

interface BaseMessage {
  id?: string;
  type: MessageType;
  timestamp?: number;
}

interface ChatMessage extends BaseMessage {
  type: 'chat';
  chatter_idx: number;
  chatter_nickname: string;
  chatter_message: string;
  grade: string;
  role: string;
  color: string;
}

interface DonationMessage extends BaseMessage {
  type: 'donation';
  amount: number;
  donor_nickname: string;
  message?: string;
}

interface RecommendMessage extends BaseMessage {
  type: 'recommend';
  recommender_nickname: string;
}

type Message = ChatMessage | DonationMessage | RecommendMessage;

interface Viewer {
    idx: number;
    nickname: string;
    role: string;
    color?: string;
}

type TabType = 'chat' | 'viewers';

const Chat: React.FC<ChatProps> = ({ broadcasterId, socket, currentUserRole = 'viewer', broadcasterIdx }) => {
    const [messages, setMessages] = useState<Message[]>([]); // 메시지 목록 상태
    const [newMessage, setNewMessage] = useState(''); // 입력 중인 메시지 상태
    const [viewers, setViewers] = useState<Viewer[]>([]); // 시청자 목록 상태
    const [activeTab, setActiveTab] = useState<TabType>('chat'); // 활성 탭 상태
    const messagesEndRef = useRef<null | HTMLDivElement>(null); // 메시지 목록 맨 아래 참조
    const {openPopup, closePopup} = popupModalStore();
    const {idx: currentUserIdx} = useUserStore();

    // 채팅 클릭 시 유저 정보 모달 열기
    const handleChatClick = (message: ChatMessage) => {
        console.log('Chat clicked:', message);
        console.log('Current user idx:', currentUserIdx);
        console.log('Current user role:', currentUserRole);
        
        if (!currentUserIdx) {
            console.log('No current user, showing login modal');
            openPopup(<LoginComponent />);
            return;
        }

        const userInfo = {
            idx: message.chatter_idx,
            nickname: message.chatter_nickname,
            role: message.role,
            color: message.color,
        };

        const currentUser = {
            idx: currentUserIdx,
            role: currentUserRole
        };

        console.log('Opening user actions modal with:', { userInfo, currentUser });

        openPopup(
            <UserActionsModal
                userInfo={userInfo}
                currentUser={currentUser}
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

    // 사용자 강퇴
    const handleKickUser = async (userIdx: number) => {
        try {
            if (socket) {
                socket.emit('kick_user', { userIdx, broadcasterId });
            }
            console.log(`User ${userIdx} kicked`);
        } catch (error) {
            console.error('Failed to kick user:', error);
        }
    };

    // 사용자 차단
    const handleBanUser = async (userIdx: number) => {
        try {
            if (socket) {
                socket.emit('ban_user', { userIdx, broadcasterId });
            }
            console.log(`User ${userIdx} banned`);
        } catch (error) {
            console.error('Failed to ban user:', error);
        }
    };

    // 사용자 차단 해제
    const handleUnbanUser = async (userIdx: number) => {
        try {
            if (socket) {
                socket.emit('unban_user', { userIdx, broadcasterId });
            }
            console.log(`User ${userIdx} unbanned`);
        } catch (error) {
            console.error('Failed to unban user:', error);
        }
    };

    // 매니저로 승격
    const handlePromoteManager = async (userIdx: number) => {
        try {
            if (socket) {
                socket.emit('promote_manager', { userIdx, broadcasterId });
            }
            console.log(`User ${userIdx} promoted to manager`);
        } catch (error) {
            console.error('Failed to promote user:', error);
        }
    };

    // 매니저 해제
    const handleDemoteManager = async (userIdx: number) => {
        try {
            if (socket) {
                socket.emit('demote_manager', { userIdx, broadcasterId });
            }
            console.log(`User ${userIdx} demoted from manager`);
        } catch (error) {
            console.error('Failed to demote user:', error);
        }
    };

    // 쪽지 보내기
    const handleSendPrivateMessage = async (userIdx: number) => {
        try {
            // TODO: 쪽지 보내기 모달 또는 페이지로 이동
            console.log(`Send private message to user ${userIdx}`);
        } catch (error) {
            console.error('Failed to send private message:', error);
        }
    };

    // 시청자 클릭 핸들러
    const handleViewerClick = (viewer: Viewer) => {
        console.log('Viewer clicked:', viewer);
        console.log('Current user idx:', currentUserIdx);
        console.log('Current user role:', currentUserRole);
        
        if (!currentUserIdx) {
            console.log('No current user, showing login modal');
            openPopup(<LoginComponent />);
            return;
        }

        const userInfo = {
            idx: viewer.idx,
            nickname: viewer.nickname,
            role: viewer.role,
            color: viewer.color || '',
        };

        const currentUser = {
            idx: currentUserIdx,
            role: currentUserRole
        };

        console.log('Opening user actions modal with:', { userInfo, currentUser });

        openPopup(
            <UserActionsModal
                userInfo={userInfo}
                currentUser={currentUser}
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
    
    const handleChatMessage = (message: ChatMessage) => {
        console.log('Chat message received:', message);
        setMessages(prevMessages => [...prevMessages, message]);
    };
    
    // const handleDonationMessage = (message: DonationMessage) => {
    //     console.log('Donation message received:', message);
    //     setMessages(prevMessages => [...prevMessages, message]);
    // };
    
    const handleRecommendMessage = (message: RecommendMessage) => {
        console.log('Recommendation message received:', message);
        setMessages(prevMessages => [...prevMessages, message]);
    };

    // 시청자 목록 업데이트 핸들러
    const handleViewersUpdate = (viewersData: Viewer[]) => {
        console.log('Viewers list updated:', viewersData);
        setViewers(viewersData);
    };

    useEffect(() => {
        console.log("this is chat component:", socket);
        if (socket) {
            socket.on('chat', handleChatMessage);
            // socket.on('donation', handleDonationMessage);
            socket.on('recommend', handleRecommendMessage);
            socket.on('viewers_list', handleViewersUpdate); // 시청자 목록 이벤트 추가

            return () => {
                socket.off('chat', handleChatMessage);
                // socket.off('donation', handleDonationMessage);
                socket.off('recommend', handleRecommendMessage);
                socket.off('viewers_list', handleViewersUpdate);
            };
        }
    }, [socket]);

    // 새 메시지 수신 시 스크롤 맨 아래로 이동
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // manager나 broadcaster가 시청자 탭을 선택했을 때 시청자 목록 요청
    useEffect(() => {
        if (socket && activeTab === 'viewers' && (currentUserRole === 'manager' || currentUserRole === 'broadcaster')) {
            socket.emit('get_viewers_list', { broadcasterId });
        }
    }, [socket, activeTab, currentUserRole, broadcasterId]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        try {
            await reqeustChat(broadcasterId, newMessage); // 서버에 메시지 전송
        }
        catch (e: any) {
            openPopup(<LoginComponent />)
        }
        setNewMessage(''); // 입력 필드 초기화
    };

    return (
        <div className="flex flex-col h-full bg-bg-secondary dark:bg-bg-secondary-dark text-text-primary dark:text-text-primary-dark">
            {/* 탭 헤더 */}
            <div className="border-b border-border-secondary dark:border-border-secondary-dark">
                <div className="flex">
                    <button
                        onClick={() => setActiveTab('chat')}
                        className={`flex-1 p-3 text-center font-semibold transition-colors duration-150 ${
                            activeTab === 'chat' 
                                ? 'bg-bg-tertiary dark:bg-bg-tertiary-dark border-b-2 border-primary' 
                                : 'hover:bg-bg-tertiary dark:hover:bg-bg-tertiary-dark'
                        }`}
                    >
                        채팅
                    </button>
                    {(currentUserRole === 'manager' || currentUserRole === 'broadcaster') && (
                        <button
                            onClick={() => setActiveTab('viewers')}
                            className={`flex-1 p-3 text-center font-semibold transition-colors duration-150 ${
                                activeTab === 'viewers' 
                                    ? 'bg-bg-tertiary dark:bg-bg-tertiary-dark border-b-2 border-primary' 
                                    : 'hover:bg-bg-tertiary dark:hover:bg-bg-tertiary-dark'
                            }`}
                        >
                            시청자 ({viewers.length})
                        </button>
                    )}
                </div>
            </div>

            {/* 탭 컨텐츠 영역 */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
                {activeTab === 'chat' ? (
                    /* 채팅 메시지 목록 */
                    <div className="p-3 space-y-2">
                        {messages.map((msg, index) => (
                            <div key={index} className="text-sm">
                                {msg.type === 'chat' && (
                                    <div 
                                        onClick={() => handleChatClick(msg)}
                                        className="cursor-pointer hover:bg-bg-tertiary dark:hover:bg-bg-tertiary-dark p-2 rounded transition-colors duration-150"
                                    >
                                        <div className="flex items-center space-x-2 justify-center">
                                            <div 
                                                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                                style={{ backgroundColor: msg.color || '#6B7280' }}
                                            >
                                                {msg.chatter_nickname.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-1">
                                                    <span className="font-semibold text-text-primary dark:text-text-primary-dark">
                                                        {msg.chatter_nickname}
                                                    </span>
                                                    {msg.role === 'broadcaster' && (
                                                        <span className="text-xs bg-red-500 text-white px-1 rounded">방송자</span>
                                                    )}
                                                    {msg.role === 'manager' && (
                                                        <span className="text-xs bg-blue-500 text-white px-1 rounded">매니저</span>
                                                    )}
                                                </div>
                                                <div className="break-words text-text-primary dark:text-text-primary-dark">
                                                    {msg.chatter_message}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {msg.type === 'donation' && (
                                    <div className="text-success dark:text-success-dark">
                                        <span className="font-semibold">{msg.donor_nickname}</span>님이 {msg.amount}을 후원했습니다!
                                        {msg.message && (
                                            <div className="ml-2 italic">{msg.message}</div>
                                        )}
                                    </div>
                                )}
                                {msg.type === 'recommend' && (
                                    <div className="italic text-warning dark:text-warning-dark">
                                        <span className="font-semibold">{msg.recommender_nickname}</span>님이 추천했습니다!
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                ) : (
                    /* 시청자 목록 */
                    <div className="p-3 space-y-2">
                        {viewers.length === 0 ? (
                            <div className="text-center text-text-muted dark:text-text-muted-dark py-8">
                                시청자가 없습니다.
                            </div>
                        ) : (
                            viewers.map((viewer, index) => (
                                <div 
                                    key={`${viewer.idx}-${index}`}
                                    onClick={() => handleViewerClick(viewer)}
                                    className="cursor-pointer hover:bg-bg-tertiary dark:hover:bg-bg-tertiary-dark p-2 rounded transition-colors duration-150"
                                >
                                    <div className="flex items-center space-x-2">
                                        <div 
                                            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                            style={{ backgroundColor: viewer.color || '#6B7280' }}
                                        >
                                            {viewer.nickname.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-1">
                                                <span className="font-semibold text-text-primary dark:text-text-primary-dark">
                                                    {viewer.nickname}
                                                </span>
                                                {viewer.role === 'broadcaster' && (
                                                    <span className="text-xs bg-red-500 text-white px-1 rounded">방송자</span>
                                                )}
                                                {viewer.role === 'manager' && (
                                                    <span className="text-xs bg-blue-500 text-white px-1 rounded">매니저</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* 메시지 입력 - 채팅 탭에서만 표시 */}
            {activeTab === 'chat' && (
                <form onSubmit={handleSendMessage} className="p-3 border-t border-border-secondary dark:border-border-secondary-dark flex">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="메시지 입력..."
                        className="flex-1 bg-bg-tertiary dark:bg-bg-tertiary-dark border border-border-primary dark:border-border-primary-dark rounded-l px-2 py-1 focus:outline-none focus:border-primary text-sm text-text-primary dark:text-text-primary-dark"
                    />
                    <button
                        type="submit"
                        className="bg-primary hover:bg-primary-hover text-primary-foreground px-4 py-1 rounded-r text-sm font-semibold"
                    >
                        전송
                    </button>
                </form>
            )}
        </div>
    );
};

export default Chat;
