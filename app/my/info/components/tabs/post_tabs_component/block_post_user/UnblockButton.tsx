import React from 'react';

interface UnblockButtonProps {
    selectedUsers: number[];
    onUnblock: () => void;
}

const UnblockButton: React.FC<UnblockButtonProps> = ({
    selectedUsers,
    onUnblock
}) => {
    return (
        <div className="flex w-full justify-center items-center mt-5">
            <button 
                className="w-[120px] h-[40px] rounded-[15px]
                    bg-color-darkBlue 
                    text-primary-foreground
                    hover:bg-opacity-80
                    disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onUnblock}
                disabled={selectedUsers.length === 0}
            >
                차단 해제
            </button>
        </div>
    );
};

export default UnblockButton;