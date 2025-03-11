"use client";

export default function PostDetail({ nickname, userId, message, sentAt }: { nickname: string; userId: string; message: string; sentAt: string }) {

  const maskString = (str: string): string => {
      if (!str || str.length <= 3) {
          return str;
      }
      const visiblePart = str.substring(0, 3);
      const maskedPart = '*'.repeat(str.length - 3);
      return visiblePart + maskedPart;
  };

  return (
    <div className="flex flex-col max-w-md w-[450px] h-[500px] border rounded-lg border-contentBg bg-contentBg dark:bg-contentBg-dark">
      <h2 className="text-lg font-bold mb-2 px-1 pt-5 px-6">받은 쪽지</h2>
      <div className="w-full h-[350px] p-5 rounded-[8px]">
        <div className="mt-2 flex justify-between border-b-[2px] border-b-tableBorder-dark pb-[13px]">
          {`${nickname}(${maskString(userId)})`} 
        </div>
        <div className="mt-[22px] overflow-auto whitespace-pre-line break-all text-[15px] text-textBase dark:text-textBase-dark">
          {message}
        </div>
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
