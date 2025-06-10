'use client';
import { reqeustChat } from '@/app/_apis/live';
import React, { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client'; // Socket 타입 import
import useModalStore from '../../utils/store/modalStore';
import LoginComponent from '../../modals/login_component';

interface ChatProps {
    broadcasterId: string; // 스트리머 식별 (채팅방 구분을 위해)
    socket: Socket | null; // socket prop 추가
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

const Chat: React.FC<ChatProps> = ({ broadcasterId, socket }) => {
    const [messages, setMessages] = useState<Message[]>([]); // 메시지 목록 상태
    const [newMessage, setNewMessage] = useState(''); // 입력 중인 메시지 상태
    const messagesEndRef = useRef<null | HTMLDivElement>(null); // 메시지 목록 맨 아래 참조
    const {openModal} = useModalStore()
    
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
                                <>
                                    <span className="font-semibold mr-1">{msg.chatter_nickname}:</span>
                                    <span className="break-words">{msg.chatter_message}</span>
                                </>
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
