'use client';
import React, { useState, useEffect } from 'react';
import { sendPost } from '@/app/_apis/posts';
import DefaultAlertMessage from '../modals/default_alert_compoent';
import popupModalStore from '../utils/store/popupModalStore';

interface SendMessageFormProps {
  initialUserId?: string;
  title?: string;
}

export default function SendMessageForm({ 
  initialUserId = '',
  title = '쪽지 보내기'
}: SendMessageFormProps) {
  const { openPopup } = popupModalStore();
  const [receiverId, setReceiverId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setReceiverId(initialUserId);
  }, [initialUserId]);

  async function requestSendPost() {
    try {
      const response = await sendPost(receiverId, message);
      openPopup(<DefaultAlertMessage message={response.message} />);
    } catch (e: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = e as any;
      const errorMessage = error?.response?.data?.message || "An unknown error occurred";
      openPopup(<DefaultAlertMessage message={errorMessage} />);
    }
  }

  return (
    <div className="flex flex-col max-w-md w-[450px] h-[520px] border rounded-lg border-tableBorder dark:border-tableBorder-dark bg-modalBg dark:bg-modalBg-dark">
      <h2 className="text-lg font-bold mb-2 px-1 pt-5 px-6">{title}</h2>
      <div className="w-full h-[340px] pt-5 px-5 rounded-[8px] overflow-auto">
        <div className="mt-2 flex justify-between border-b-[2px] border-b-tableBorder-dark pb-[13px]">
          <input
            placeholder='받는 사람 아이디'
            className="w-full bg-modalBg dark:bg-modalBg-dark focus:outline-none overflow-hidden"
            onChange={(e) => setReceiverId(e.target.value)}
            value={receiverId}
          />
        </div>
        <div className="mt-[22px] h-[240px] text-[15px] text-textBase dark:text-textBase-dark">
          <textarea
            placeholder='내용'
            className="w-full h-full bg-modalBg dark:bg-modalBg-dark focus:outline-none overflow-auto text-left p-2 resize-none"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
        </div>
      </div>
      <div className='flex justify-end pr-5 text-textBase dark:text-textBase-dark'>
        {message.length} / 1000
      </div>
      <div className="flex flex-row h-[100px] items-center space-x-5 px-5">
        <button
          className="w-full p-2 mt-2 rounded bg-color-darkBlue"
          onClick={() => requestSendPost()}
        >
          보내기
        </button>
        <button
          className="w-full p-2 mt-2 rounded bg-textBase dark:textBase-dark"
        >
          취소
        </button>
      </div>
    </div>
  );
}