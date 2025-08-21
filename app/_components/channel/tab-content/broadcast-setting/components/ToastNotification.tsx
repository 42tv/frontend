import React from 'react';
import { FiCheck } from "react-icons/fi";

interface ToastNotificationProps {
    showToast: boolean;
    copiedText: string;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
    showToast,
    copiedText
}) => {
    return (
        <div 
            className={`absolute top-4 right-4 bg-success-bg dark:bg-[rgb(20,83,45)] border border-success text-success dark:text-success-dark px-4 py-2 rounded flex items-center shadow-md transition-opacity duration-300 z-50 ${
                showToast ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
        >
            <FiCheck className="mr-2" />
            <span>{copiedText}</span>
        </div>
    );
};

export default ToastNotification;