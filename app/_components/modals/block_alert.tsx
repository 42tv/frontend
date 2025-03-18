import React from 'react';

export default function BlockAlertComponent({ blockedIdx, blockedNickname }: { blockedIdx: number, blockedNickname: string }) {
  return (
    <div
      className="flex flex-col max-w-md w-[500px] h-[200px] p-5 border rounded-lg border-tableBorder dark:border-tableBorder-dark bg-contentBg" // Added text-left class for left alignment
    >
        <div className='w-full h-[80px] bg-blue-400 text-center items-center justify-center'>
            ss
        </div>
    </div>
  );
}
