'use client';
import { MdClose } from "react-icons/md";
import useModalStore from "../store/modalStore";

const Modal = () => {
    const { isOpen, closeModal, content } = useModalStore();

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 flex justify-center items-center z-50"
        >
            <div className="rounded-lg shadow-lg relative">
                {/* X 버튼 */}
                <button
                    className="absolute w-[25px] h-[25px] top-2 right-2 flex justify-center items-center cursor-pointer z-20"
                    onClick={closeModal}
                >
                    <MdClose className="w-full h-full" />
                </button>
                {content}
            </div>
        </div>
    );
};

export default Modal;
