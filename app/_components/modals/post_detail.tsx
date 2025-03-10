"use client";
import { useState } from "react";

export default function PostDetail({ nickname, userId, message, sentAt }: { nickname: string; userId: string; message: string; sentAt: string }) {
  const maxLength = 1000;

  return (
    <div className="flex flex-col max-w-md w-[450px] h-[500px] p-5 border rounded-lg border-contentBg bg-contentBg">
      <h2 className="text-lg font-bold mb-2 px-1">받은 쪽지</h2>
      <div className="w-full h-[350px] rounded-[8px]">
        {nickname}
      </div>
      <div className="flex flex-row h-[130px] items-center space-x-5 ">
        <button
          className={`w-full p-2 mt-2 rounded bg-green-500`}
        >
          보내기
        </button>
        <button
          className={`w-full p-2 mt-2 rounded bg-green-500`}
        >
          보내기
        </button>
      </div>
      
    </div>
  );
}
