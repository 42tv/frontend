'use client';
import popupModalStore from "../store/popupModalStore";

const PopupModal = () => {
    const { isOpen, closePopup, content } = popupModalStore();

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 flex justify-center items-center z-50"
            onClick={closePopup}
        >
            <div 
                className="flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                {content}
            </div>
        </div>
    );
};
export default PopupModal;
