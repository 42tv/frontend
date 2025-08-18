import React from 'react';

const SendMessageButton: React.FC = () => {
    return (
        <div className="flex w-full justify-center items-center mt-5">
            <button 
                className="w-[120px] h-[40px] rounded-[15px]
                    bg-color-darkBlue 
                    text-primary-foreground
                    hover:bg-opacity-80"
            >
                쪽지 보내기
            </button>
        </div>
    );
};

export default SendMessageButton;