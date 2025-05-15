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

interface Message {
    chatter_idx: number;
    chatter_nickname: string;
    chatter_message: string;
}

const Chat: React.FC<ChatProps> = ({ broadcasterId, socket }) => {
    const [messages, setMessages] = useState<Message[]>([]); // 메시지 목록 상태
    const [newMessage, setNewMessage] = useState(''); // 입력 중인 메시지 상태
    const messagesEndRef = useRef<null | HTMLDivElement>(null); // 메시지 목록 맨 아래 참조
    const {openModal} = useModalStore()
    

    // WebSocket 연결 설정 및 메시지 수신/발신 로직 구현
    useEffect(() => {
        console.log("this is chat component:", socket);
        if (socket) {
            const handleChatMessage = (message: any) => {
                console.log(message);
                setMessages(prevMessages => [...prevMessages, message]);
            };
            socket.on('chat', handleChatMessage);

            return () => {
                socket.off('chat', handleChatMessage);
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
        <div className="flex flex-col h-full bg-gray-800 text-white">
            {/* 채팅 헤더 - 고정 */}
            <div className="p-3 border-b border-gray-700 text-center font-semibold">
                채팅
            </div>

            {/* 메시지 목록 - 스크롤 가능 영역 */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
                <div className="p-3 space-y-2">
                    {messages.map((msg, index) => (
                        <div key={index} className="text-sm">
                            <span className="font-semibold mr-1">{msg.chatter_nickname}:</span>
                            <span className="break-words">{msg.chatter_message}</span>
                        </div>
                    ))}
                    <div ref={messagesEndRef} /> {/* 스크롤 타겟 */}
                </div>
            </div>

            {/* 메시지 입력 */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-700 flex">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="메시지 입력..."
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-l px-2 py-1 focus:outline-none focus:border-blue-500 text-sm"
                    // TODO: 로그인 상태 확인 후 disabled 처리
                />
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-r text-sm font-semibold"
                    // TODO: 로그인 상태 확인 후 disabled 처리
                >
                    전송
                </button>
            </form>
        </div>
    );
};

export default Chat;
