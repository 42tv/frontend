'use client';
import { overlay } from 'overlay-kit';
import { MdClose } from "react-icons/md";
import React, { ReactNode, createContext, useContext, useState } from 'react';

// 모달 내용 타입 정의
type ModalContent = ReactNode | ((close: () => void) => ReactNode);

// 모달 옵션 타입 정의
interface ModalOptions {
    /** 팝업 모드 (배경 클릭 시 닫힘, X버튼 없음) */
    isPopup?: boolean;
    /** X버튼 크기 커스터마이징 */
    closeButtonSize?: string;
}

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
    options = {}
}: { 
    children: ReactNode;
    onClose: () => void;
    options?: ModalOptions;
}) => {
    const { isPopup = false, closeButtonSize = "w-[25px] h-[25px]" } = options;

    if (isPopup) {
        // 팝업 모드: 배경 클릭으로 닫힘, X버튼 없음
        return (
            <div 
                className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50" 
                onClick={onClose}
            >
                <div 
                    className="flex items-center justify-center" 
                    onClick={(e) => e.stopPropagation()}
                >
                    {children}
                </div>
            </div>
        );
    }

    // 일반 모드: X버튼 있음, 배경 클릭해도 안닫힘
    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
            <div className="rounded-lg shadow-lg relative bg-contentBg">
                <button
                    className={`absolute ${closeButtonSize} top-2 right-2 flex justify-center items-center cursor-pointer z-20`}
                    onClick={onClose}
                >
                    <MdClose className="w-full h-full" />
                </button>
                {children}
            </div>
        </div>
    );
};

// 메인 모달 컴포넌트
const Modal = ({ 
    initialContent, 
    onClose,
    options = {}
}: { 
    initialContent: ModalContent;
    onClose: () => void;
    options?: ModalOptions;
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
            <ModalContainer onClose={onClose} options={options}>
                {renderContent()}
            </ModalContainer>
        </ModalContentContext.Provider>
    );
};

// 모달 내용 교체 훅
export const useModalContentReplace = () => {
    const context = useContext(ModalContentContext);
    if (!context) {
        throw new Error('useModalContentReplace must be used within Modal');
    }
    return context.setContent;
};

// 모달 헬퍼 함수들
export const openModal = (content: ModalContent, options: ModalOptions = {}) => {
    return overlay.open(({ isOpen, close }) => (
        <div>
            {isOpen && (
                <Modal 
                    initialContent={content}
                    onClose={close}
                    options={options}
                />
            )}
        </div>
    ));
};

// 팝업 모달 (배경 클릭으로 닫힘)
export const openPopupModal = (content: ReactNode) => {
    return openModal(content, { isPopup: true });
};

export const closeModal = (overlayId: string) => {
    overlay.close(overlayId);
};

export const closeAllModals = () => {
    overlay.closeAll();
};