import React from "react";

type ModalProps = {
    isOpen: boolean;
    children: React.ReactNode;
};

const Modal = ({ isOpen, children }: ModalProps) => {
    if (!isOpen) return null; // 모달이 열리지 않았을 때 렌더링 방지

    return (
        <div
            className="fixed top-0 left-0 w-full h-full p-8 justify-center items-center flex"
            // onClick={onClose} // 배경 클릭 시 닫기
        >
            {children}
        </div>
    );
};

export default Modal;
