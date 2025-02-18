'use client';
import errorModalStore from "./errorModalStore";

const ErrorModal = () => {
    const { isOpen, closeModal, content } = errorModalStore();

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 flex justify-center items-center z-50"
        >
            <div className="rounded-lg shadow-lg relative">
                {/* X 버튼 */}
                <button
                    className="absolute w-[16px] h-[16px] top-2 right-2 flex justify-center items-center cursor-pointer z-20"
                    onClick={closeModal}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="w-5 h-5 text-gray-600 hover:text-white"
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
    );
};

export default ErrorModal;
