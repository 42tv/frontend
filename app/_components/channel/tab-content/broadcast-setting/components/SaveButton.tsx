import React from 'react';

interface SaveButtonProps {
    onSave: () => void;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onSave }) => {
    return (
        <div className="flex justify-start my-4">
            <button
                className="font-bold py-2 px-6 rounded-md transition-colors bg-primary text-white hover:bg-accent"
                onClick={onSave}
            >
                저장하기
            </button>
        </div>
    );
};

export default SaveButton;