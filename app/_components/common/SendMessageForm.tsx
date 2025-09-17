'use client';
import React, { useState, useEffect } from 'react';
import { sendPost } from '@/app/_apis/posts';
import DefaultAlertMessage from '../modals/default_alert_component';
import { openPopupModal } from '../utils/overlay/overlayHelpers';

interface SendMessageFormProps {
  initialUserId?: string;
  title?: string;
  closeModal?: () => void;
}

export default function SendMessageForm({ 
  initialUserId = '',
  title = '쪽지 보내기',
  closeModal
}: SendMessageFormProps) {
  const [receiverId, setReceiverId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setReceiverId(initialUserId);
  }, [initialUserId]);

  async function requestSendPost() {
    try {
      const response = await sendPost(receiverId, message);
      closeModal?.(); // 현재 모달 닫기
      openPopupModal(<DefaultAlertMessage message={response.message} />);
    } catch (e: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = e as any;
      const errorMessage = error?.response?.data?.message || "An unknown error occurred";
      closeModal?.(); // 현재 모달 닫기
      openPopupModal(<DefaultAlertMessage message={errorMessage} />);
    }
  }

  return (
    <div className="flex flex-col max-w-md w-[450px] h-[520px] border rounded-lg border-bg-300 bg-bg-200">
      <h2 className="text-lg font-bold mb-2 px-1 pt-5 px-6 text-text-100">{title}</h2>
      <div className="w-full h-[340px] pt-5 px-5 rounded-[8px] overflow-auto">
        <div className="mt-2 flex justify-between border-b-[2px] border-b-bg-300 pb-[13px]">
          <input
            placeholder='받는 사람 아이디'
            className="w-full bg-bg-200 focus:outline-none focus:ring-2 focus:ring-primary-100 overflow-hidden text-text-100"
            onChange={(e) => setReceiverId(e.target.value)}
            value={receiverId}
          />
        </div>
        <div className="mt-[22px] h-[240px] text-[15px] text-text-100">
          <textarea
            placeholder='내용'
            className="w-full h-full bg-bg-200 focus:outline-none focus:ring-2 focus:ring-primary-100 overflow-auto text-left p-2 resize-none text-text-100"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
        </div>
      </div>
      <div className='flex justify-end pr-5 text-text-200'>
        {message.length} / 1000
      </div>
      <div className="flex flex-row h-[100px] items-center space-x-5 px-5">
        <button
          className="w-full p-2 mt-2 rounded bg-primary-100 hover:bg-primary-200 text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-100 transition-colors"
          onClick={() => requestSendPost()}
        >
          보내기
        </button>
        <button
          className="w-full p-2 mt-2 rounded bg-bg-300 hover:bg-bg-400 text-text-100 focus:outline-none focus:ring-2 focus:ring-bg-400 transition-colors"
          onClick={() => closeModal?.()}
        >
          취소
        </button>
      </div>
    </div>
  );
}