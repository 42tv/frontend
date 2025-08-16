'use client';
import { overlay } from 'overlay-kit';
import { MdClose } from "react-icons/md";
import React, { ReactNode, createContext, useContext, useState } from 'react';

// 모달 내용 타입 정의
type ModalContent = ReactNode | ((close: () => void) => ReactNode);

// 모달 내용 교체를 위한 컨텍스트
interface ModalContentContextType {
    content: ModalContent;
    setContent: (content: ModalContent) => void;
}

const ModalContentContext = createContext<ModalContentContextType | null>(null);

// 공통 모달 컨테이너 컴포넌트
const ModalContainer = ({ 
    children, 
    onClose,
    closeButtonSize = "w-[25px] h-[25px]",
    useCustomCloseIcon = false
}: { 
    children: ReactNode;
    onClose: () => void;
    closeButtonSize?: string;
    useCustomCloseIcon?: boolean;
}) => (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
        <div className="rounded-lg shadow-lg relative bg-contentBg">
            <button
                className={`absolute ${closeButtonSize} top-2 right-2 flex justify-center items-center cursor-pointer z-20`}
                onClick={onClose}
            >
                {useCustomCloseIcon ? (
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
                ) : (
                    <MdClose className="w-full h-full" />
                )}
            </button>
            {children}
        </div>
    </div>
);

// 교체 가능한 모달 컴포넌트
const ReplaceableModal = ({ 
    initialContent, 
    onClose 
}: { 
    initialContent: ModalContent;
    onClose: () => void;
}) => {
    const [currentContent, setCurrentContent] = useState<ModalContent>(initialContent);

    // content를 렌더링할 때 항상 onClose 함수를 전달
    const renderContent = (): ReactNode => {
        if (typeof currentContent === 'function') {
            return currentContent(onClose);
        } else {
            // ReactNode 타입이지만 closeModal prop이 필요한 컴포넌트일 수 있으므로
            // React.cloneElement를 사용하여 closeModal prop 주입
            if (React.isValidElement(currentContent)) {
                return React.cloneElement(currentContent as React.ReactElement<any>, { 
                    closeModal: onClose 
                });
            }
            return currentContent;
        }
    };

    return (
        <ModalContentContext.Provider value={{ content: currentContent, setContent: setCurrentContent }}>
            <ModalContainer onClose={onClose}>
                {renderContent()}
            </ModalContainer>
        </ModalContentContext.Provider>
    );
};

// 모달 내용 교체 훅
export const useModalContentReplace = () => {
    const context = useContext(ModalContentContext);
    if (!context) {
        throw new Error('useModalContentReplace must be used within ReplaceableModal');
    }
    return context.setContent;
};

// 모달 헬퍼 함수들
export const openModal = (content: ModalContent) => {
    return overlay.open(({ isOpen, close }) => (
        <div>
            {isOpen && (
                <ModalContainer onClose={close}>
                    {typeof content === 'function' ? content(close) : content}
                </ModalContainer>
            )}
        </div>
    ));
};

export const openErrorModal = (content: ReactNode) => {
    return overlay.open(({ isOpen, close }) => (
        <div>
            {isOpen && (
                <ModalContainer 
                    onClose={close} 
                    closeButtonSize="w-[16px] h-[16px]"
                    useCustomCloseIcon={true}
                >
                    {content}
                </ModalContainer>
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

// 내용 교체가 가능한 모달을 여는 함수
export const openReplaceableModal = (content: ModalContent) => {
    return overlay.open(({ isOpen, close }) => (
        <div>
            {isOpen && (
                <ReplaceableModal 
                    initialContent={content}
                    onClose={close}
                />
            )}
        </div>
    ));
};