'use client';
import { reqeustChat } from '@/app/_apis/live';
import React, { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client'; // Socket 타입 import
import useModalStore from '../../utils/store/modalStore';
import useUserStore from '../../utils/store/userStore';
import LoginComponent from '../../modals/login_component';
import UserActionsModal from '../../modals/user_actions_modal';

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

    const Chat: React.FC<ChatProps> = ({ broadcasterId, socket, currentUserRole = 'viewer', broadcasterIdx }) => {
    const [messages, setMessages] = useState<Message[]>([]); // 메시지 목록 상태
    const [newMessage, setNewMessage] = useState(''); // 입력 중인 메시지 상태
    const messagesEndRef = useRef<null | HTMLDivElement>(null); // 메시지 목록 맨 아래 참조
    const {openModal} = useModalStore();
    const {idx: currentUserIdx} = useUserStore();

    // 채팅 클릭 시 유저 정보 모달 열기
    const handleChatClick = (message: ChatMessage) => {
        console.log('Chat clicked:', message);
        console.log('Current user idx:', currentUserIdx);
        console.log('Current user role:', currentUserRole);
        
        if (!currentUserIdx) {
            console.log('No current user, showing login modal');
            openModal(<LoginComponent />);
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

        openModal(
            <UserActionsModal
                userInfo={userInfo}
                currentUser={currentUser}
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

    useEffect(() => {
        console.log("this is chat component:", socket);
        if (socket) {
            socket.on('chat', handleChatMessage);
            // socket.on('donation', handleDonationMessage);
            socket.on('recommend', handleRecommendMessage);

            return () => {
                socket.off('chat', handleChatMessage);
                // socket.off('donation', handleDonationMessage);
                socket.off('recommend', handleRecommendMessage);
            };
        }
    }, [socket]);

    // 새 메시지 수신 시 스크롤 맨 아래로 이동
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        try {
            await reqeustChat(broadcasterId, newMessage); // 서버에 메시지 전송
        }
        catch (e: any) {
            openModal(<LoginComponent />)
        }
        setNewMessage(''); // 입력 필드 초기화
    };

    return (
        <div className="flex flex-col h-full bg-bg-secondary dark:bg-bg-secondary-dark text-text-primary dark:text-text-primary-dark">
            {/* 채팅 헤더 - 고정 */}
            <div className="p-3 border-b border-border-secondary dark:border-border-secondary-dark text-center font-semibold">
                채팅
            </div>

            {/* 메시지 목록 - 스크롤 가능 영역 */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
                <div className="p-3 space-y-2">
                    {messages.map((msg, index) => (
                        <div key={index} className="text-sm">
                            {msg.type === 'chat' && (
                                <div 
                                    onClick={() => handleChatClick(msg)}
                                    className="cursor-pointer hover:bg-bg-tertiary dark:hover:bg-bg-tertiary-dark p-2 rounded transition-colors duration-150"
                                >
                                    <div className="flex items-start space-x-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden flex-shrink-0">
                                            {msg.color ? (
                                                <img 
                                                    src={msg.color} 
                                                    alt={`${msg.chatter_nickname} 프로필`}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                                    </svg>
                                                </div>
                                            )}
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
                    <div ref={messagesEndRef} /> {/* 스크롤 타겟 */}
                </div>
            </div>

            {/* 메시지 입력 */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-border-secondary dark:border-border-secondary-dark flex">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="메시지 입력..."
                    className="flex-1 bg-bg-tertiary dark:bg-bg-tertiary-dark border border-border-primary dark:border-border-primary-dark rounded-l px-2 py-1 focus:outline-none focus:border-primary text-sm text-text-primary dark:text-text-primary-dark"
                    // TODO: 로그인 상태 확인 후 disabled 처리
                />
                <button
                    type="submit"
                    className="bg-primary hover:bg-primary-hover text-primary-foreground px-4 py-1 rounded-r text-sm font-semibold"
                    // TODO: 로그인 상태 확인 후 disabled 처리
                >
                    전송
                </button>
            </form>
        </div>
    );
};

export default Chat;
