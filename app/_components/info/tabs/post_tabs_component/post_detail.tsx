"use client";

export default function PostDetail({ nickname, userId, message, sentAt, postId, closeModal, deleteSinglePost }: 
  { 
    nickname: string;
    userId: string;
    message: string;
    sentAt: string,
    postId: number,
    closeModal: () => void,
    deleteSinglePost: (postId: number) => void
  }
  ) {

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

  return (
    <div className="flex flex-col max-w-md w-[450px] h-[500px] border rounded-lg border-tableBorder dark:border-tableBorder-dark bg-modalBg dark:bg-modalBg-dark">
      <h2 className="text-lg font-bold mb-2 px-1 pt-5 px-6">쪽지</h2>
      <div className="w-full h-[360px] pt-5 px-5 rounded-[8px] overflow-auto">
        <div className="mt-2 flex justify-between border-b-[2px] border-b-tableBorder-dark pb-[13px]">
          <div>
            {`${nickname}(${maskString(userId)})`} 
          </div>
          <div>
            {formatTimestamp(sentAt)}
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
            deleteSinglePost(postId)
            closeModal()
          }}
        >
          삭제
        </button>
        <button
          className={`w-full p-2 mt-2 rounded bg-color-darkBlue`}
        >
          답장
        </button>
      </div>
    </div>
  );
}
