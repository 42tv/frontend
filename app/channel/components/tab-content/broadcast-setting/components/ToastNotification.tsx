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
            className={`absolute top-4 right-4 px-4 py-2 rounded flex items-center shadow-md transition-opacity duration-300 z-50 ${
                showToast ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{ 
                backgroundColor: 'var(--bg-300)', 
                border: '1px solid var(--accent-100)', 
                color: 'var(--text-100)' 
            }}
        >
            <FiCheck className="mr-2" style={{ color: 'var(--accent-100)' }} />
            <span>{copiedText}</span>
        </div>
    );
};

export default ToastNotification;