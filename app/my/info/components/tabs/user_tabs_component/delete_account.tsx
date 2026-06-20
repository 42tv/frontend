'use client';

import { openModal } from "@/app/_components/utils/overlay/overlayHelpers";
import DeleteAccountModal from "./delete_account_modal";

export default function DeleteAccount() {
    function handleOpenDelete() {
        openModal(<DeleteAccountModal />, { closeButtonSize: "w-[16px] h-[16px]" });
    }

    return (
        <div className="px-20 mt-10">
            <div className="font-bold text-2xl dark:text-colorFg01 mb-4">
                회원 탈퇴
            </div>
            {/* 밑줄 */}
            <div data-orientation="horizontal" role="none" className="shrink-0 bg-tableBorder dark:border-tableBorder-dark h-[1px] w-full" />
            <div className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-text-secondary leading-relaxed">
                    탈퇴하면 계정 정보와 이용 내역이 모두 삭제되며 복구할 수 없습니다.
                    <br className="hidden sm:block" />
                    방송 중이거나 잔여 코인·미정산 수익이 있는 경우 탈퇴가 제한됩니다.
                </p>
                <button
                    type="button"
                    onClick={handleOpenDelete}
                    className="shrink-0 h-[40px] px-5 rounded-lg border border-error text-error text-sm font-medium hover:bg-error hover:text-white transition-colors"
                >
                    회원 탈퇴
                </button>
            </div>
            <div data-orientation="horizontal" role="none" className="shrink-0 bg-tableBorder dark:border-tableBorder-dark h-[1px] w-full" />
        </div>
    );
}
