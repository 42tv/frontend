'use client';
import { overlay } from 'overlay-kit';
import { MdClose } from "react-icons/md";
import { ReactNode } from 'react';

// 모달 헬퍼 함수들
export const openModal = (content: ReactNode | ((close: () => void) => ReactNode)) => {
    return overlay.open(({ isOpen, close, unmount }) => (
        <div>
            {isOpen && (
                <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
                    <div className="rounded-lg shadow-lg relative bg-contentBg">
                        <button
                            className="absolute w-[25px] h-[25px] top-2 right-2 flex justify-center items-center cursor-pointer z-20"
                            onClick={close}
                        >
                            <MdClose className="w-full h-full" />
                        </button>
                        {typeof content === 'function' ? content(close) : content}
                    </div>
                </div>
            )}
        </div>
    ));
};

export const openErrorModal = (content: ReactNode) => {
    return overlay.open(({ isOpen, close }) => (
        <div>
            {isOpen && (
                <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
                    <div className="rounded-lg shadow-lg relative bg-contentBg">
                        <button
                            className="absolute w-[16px] h-[16px] top-2 right-2 flex justify-center items-center cursor-pointer z-20"
                            onClick={close}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                className="w-5 h-5 text-text-tertiary hover:text-white transition-colors"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        {content}
                    </div>
                </div>
            )}
        </div>
    ));
};

// 팝업은 클릭하면 닫히는거
export const openPopupModal = (content: ReactNode) => {
    return overlay.open(({ isOpen, close }) => (
        <div>
            {isOpen && (
                <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50" onClick={close}>
                    <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        {content}
                    </div>
                </div>
            )}
        </div>
    ));
};

export const closeModal = (overlayId: string) => {
    overlay.close(overlayId);
};

export const closeAllModals = () => {
    overlay.closeAll();
};