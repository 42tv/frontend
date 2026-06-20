'use client';

import { useState } from "react";
import { deleteAccount } from "@/app/_apis/user";

interface Props {
    /** overlayHelpers가 cloneElement로 주입하는 닫기 함수 */
    closeModal?: () => void;
}

const DELETE_NOTICES = [
    "프로필, 쪽지, 후원 내역 등 계정 정보가 삭제되며 복구할 수 없습니다.",
    "방송 중이거나 잔여 코인·미정산 수익이 있으면 탈퇴가 제한됩니다.",
    "탈퇴 후 동일한 아이디로 재가입이 제한될 수 있습니다.",
];

export default function DeleteAccountModal({ closeModal }: Props) {
    const [password, setPassword] = useState<string>("");
    const [agreed, setAgreed] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const canSubmit = agreed && password.trim() !== "" && !loading;

    async function handleDelete() {
        if (!canSubmit) return;
        setLoading(true);
        setErrorMessage("");
        try {
            await deleteAccount({ password });
            // 서버가 jwt/refresh 쿠키를 만료시킨다. 전체 새로고침으로 스토어를 게스트 상태로 초기화.
            window.location.href = "/";
        } catch (e: unknown) {
            // 차단 조건(방송 중/잔여 코인/미정산)·비밀번호 불일치 등은 400 메시지를 그대로 안내
            const message =
                (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
                "탈퇴 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
            setErrorMessage(message);
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col w-[440px] max-w-[90vw] p-6 bg-bg-secondary text-text-primary">
            <h2 className="text-xl font-bold mb-1">정말 탈퇴하시겠어요?</h2>
            <p className="text-sm text-text-secondary mb-4">
                탈퇴 시 아래 내용을 확인해 주세요.
            </p>

            <ul className="flex flex-col gap-2 mb-5 p-4 rounded-lg bg-bg-tertiary">
                {DELETE_NOTICES.map((notice, index) => (
                    <li key={index} className="flex gap-2 text-sm text-text-secondary leading-relaxed">
                        <span className="text-error mt-[2px]">•</span>
                        <span>{notice}</span>
                    </li>
                ))}
            </ul>

            <label className="block text-sm font-medium mb-2">
                비밀번호 확인
            </label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") handleDelete();
                }}
                placeholder="현재 비밀번호를 입력하세요"
                autoComplete="current-password"
                className="w-full h-[44px] px-3 rounded-lg border border-border-primary bg-bg-secondary text-[15px] focus-visible:outline-none focus-visible:border-accent transition-colors"
            />

            {errorMessage && (
                <p className="mt-2 text-sm text-error">{errorMessage}</p>
            )}

            <label className="flex items-center gap-2 mt-4 cursor-pointer select-none">
                <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-4 h-4 accent-error cursor-pointer"
                />
                <span className="text-sm text-text-secondary">
                    위 내용을 모두 확인했으며 탈퇴에 동의합니다.
                </span>
            </label>

            <div className="flex gap-3 mt-6">
                <button
                    type="button"
                    onClick={() => closeModal?.()}
                    disabled={loading}
                    className="flex-1 h-[44px] rounded-lg border border-border-primary text-text-secondary font-medium hover:bg-bg-tertiary transition-colors disabled:opacity-50"
                >
                    취소
                </button>
                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={!canSubmit}
                    className="flex-1 h-[44px] rounded-lg bg-error text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {loading ? "처리 중..." : "회원 탈퇴"}
                </button>
            </div>
        </div>
    );
}
