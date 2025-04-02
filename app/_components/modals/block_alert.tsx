import React from 'react';
import { blockPostUser } from "@/app/_apis/posts";
import DefaultAlertMessage from './default_alert_compoent';

export default function BlockAlertComponent(
  { blockedIdx, blockUserId, blockedNickname, closePopup, changePopupComponent }: 
  { blockedIdx: number, blockUserId: string, blockedNickname: string, closePopup: () => void, changePopupComponent: any}) {
  async function blockUser() {
    try {
      const response = await blockPostUser(blockedIdx)
      changePopupComponent(<DefaultAlertMessage message={response.message} />)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch(e: any) {
      changePopupComponent(<DefaultAlertMessage message={e.response.data.message} />)
    }
  }
  return (
    <div
      className="flex flex-col max-w-md w-[500px] h-[200px] p-5 border rounded-lg border-tableBorder dark:border-tableBorder-dark bg-contentBg"
    >
      {/* 세로 중앙 정렬을 위해 flex-col, items-center, justify-center 추가 */}
      <div className='flex flex-col w-full h-[80px] text-center items-center justify-center'>
          {blockedNickname}({blockUserId})님을 차단하시겠습니까?
      </div>
      
      <div className='flex flex-row justify-center items-center space-x-5 mt-5'>
        <button 
          className="w-[100px] p-2 rounded bg-color-darkBlue"
          onClick={() => blockUser()}
        >
          차단
        </button>
        <button 
          className="w-[100px] p-2 rounded bg-textBase dark:textBase-dark"
          onClick={closePopup}
        >
          취소
        </button>
      </div>
    </div>
  );
}
