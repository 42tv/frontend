"use client";

import { blockPostUser } from "@/app/_apis/posts";
import { useState } from "react";
import { MdBlock } from "react-icons/md";
import errorModalStore from "@/app/_components/utils/store/errorModalStore";
import ErrorMessage from "@/app/_components/modals/error_component";
import { getApiErrorMessage } from "@/app/_apis/interfaces";
import SendMessageForm from "@/app/_components/common/SendMessageForm";

export default function PostDetail({ nickname, userId, message, sentAt, postId, deleteSinglePost, responsePost, senderIdx, closeModal }: 
  { 
    nickname: string;
    userId: string;
    message: string;
    sentAt: string,
    postId: number,
    deleteSinglePost: (postId: number) => void,
    responsePost?: (userId: string) => void,
    senderIdx: number,
    closeModal?: () => void
  }
  ) {
  const { openError } = errorModalStore();
  const [showReplyForm, setShowReplyForm] = useState(false);

  const maskString = (str: string): string => {
      if (!str || str.length <= 3) {
          return str;
      }
      const visiblePart = str.substring(0, 3);
      const maskedPart = '*'.repeat(str.length - 3);
      return visiblePart + maskedPart;
  };

  function formatTimestamp(utcString: string) {
    const date = new Date(utcString);

    // 월과 일이 2자리 숫자가 되도록 변환
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // getUTCMonth()는 0부터 시작
    const day = String(date.getUTCDate()).padStart(2, '0');

    // 시간과 분을 12시간 형식으로 변환
    let hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12; // 0시는 12로 변경

    return `${month}-${day} ${ampm} ${hours}:${minutes}`;
  }

  async function handleResponsePost() {
    setShowReplyForm(true);
  }

  async function handleBlockUser() {
    try {
      await blockPostUser(senderIdx);
      openError(<ErrorMessage message="사용자가 차단되었습니다." />);
    } catch (error) {
      const message = getApiErrorMessage(error)
      openError(<ErrorMessage message={message} />);
    }
  }

  if (showReplyForm) {
    return <SendMessageForm initialUserId={userId} closeModal={closeModal} title="답장 보내기" />;
  }

  return (
    <div className="flex flex-col max-w-md w-[450px] h-[500px] border rounded-lg border-tableBorder dark:border-tableBorder-dark bg-modalBg dark:bg-modalBg-dark">
      <h2 className="text-lg font-bold mb-2 px-1 pt-5 px-6">쪽지</h2>
      <div className="w-full h-[360px] pt-5 px-5 rounded-[8px] overflow-auto">
        <div className="mt-2 flex justify-between items-center border-b-[2px] border-b-tableBorder-dark pb-[13px]">
          <div>
            {`${nickname}(${maskString(userId)})`} 
          </div>
          <div className="flex items-center gap-2">
            <span>{formatTimestamp(sentAt)}</span>
            <button
              onClick={handleBlockUser}
              className="p-1 text-gray-500 hover:text-red-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed rounded transition-colors"
              title={'차단'}
            >
              <MdBlock className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="mt-[22px] h-[240px] whitespace-pre-line break-all text-[15px] text-textBase dark:text-textBase-dark ">
          {message}
        </div>
      </div>
      <div className="flex flex-row h-[100px] items-center space-x-5 px-5">
        <button
          className={`w-full p-2 mt-2 rounded bg-textBase dark:textBase-dark`}
          onClick={() => {
            deleteSinglePost(postId);
            closeModal?.();
          }}
        >
          삭제
        </button>
        {
          responsePost && (
            <button
              className={`w-full p-2 mt-2 rounded bg-color-darkBlue`}
              onClick={() => handleResponsePost()}
            >
              답장
            </button>
          )
        }
      </div>
    </div>
  );
}
