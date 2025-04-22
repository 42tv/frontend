'use client';
import React, { useState, useEffect, useRef } from 'react';

interface ChatProps {
    user_idx: string; // 스트리머 식별 (채팅방 구분을 위해)
}

interface Message {
    id: string;
    sender: string;
    text: string;
    timestamp: number;
}

const Chat: React.FC<ChatProps> = ({ user_idx }) => {
    const [messages, setMessages] = useState<Message[]>([]); // 메시지 목록 상태
    const [newMessage, setNewMessage] = useState(''); // 입력 중인 메시지 상태
    const messagesEndRef = useRef<null | HTMLDivElement>(null); // 메시지 목록 맨 아래 참조

    // TODO: WebSocket 연결 설정 및 메시지 수신/발신 로직 구현
    useEffect(() => {
        // 임시 메시지 (테스트용)
        setMessages([
            { id: '1', sender: 'User1', text: '안녕하세요!', timestamp: Date.now() - 5000 },
            { id: '2', sender: 'User2', text: '반갑습니다~', timestamp: Date.now() - 3000 },
            { id: '3', sender: 'User1', text: '채팅 테스트 중입니다.', timestamp: Date.now() - 1000 },
        ]);

        // WebSocket 연결 로직...
        // ws.onmessage = (event) => { ... setMessages(...) }

        return () => {
            // WebSocket 연결 해제 로직...
        };
    }, [user_idx]);

    // 새 메시지 수신 시 스크롤 맨 아래로 이동
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        // TODO: WebSocket으로 메시지 전송 로직
        console.log('Sending message:', newMessage);
        // 임시로 로컬 상태에 추가 (실제로는 서버 응답 후 추가)
        const tempMessage: Message = {
            id: Date.now().toString(), // 임시 ID
            sender: 'CurrentUser', // TODO: 실제 사용자 닉네임 사용
            text: newMessage,
            timestamp: Date.now(),
        };
        setMessages(prev => [...prev, tempMessage]);

        setNewMessage(''); // 입력 필드 초기화
    };

    return (
        <div className="flex flex-col h-full bg-gray-800 text-white">
            {/* 채팅 헤더 */}
            <div className="p-3 border-b border-gray-700 text-center font-semibold">
                채팅
            </div>

            {/* 메시지 목록 */}
            {/* Add classes: [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {messages.map((msg) => (
                    <div key={msg.id} className="text-sm">
                        <span className="font-semibold mr-1">{msg.sender}:</span>
                        <span className="break-words">{msg.text}</span>
                    </div>
                ))}
                <div ref={messagesEndRef} /> {/* 스크롤 타겟 */}
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
