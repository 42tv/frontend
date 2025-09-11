import React from 'react';

interface SaveButtonProps {
    onSave: () => void;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onSave }) => {
    return (
        <div className="flex justify-start my-4">
            <button 
                className="font-bold py-2 px-6 rounded-md transition-colors"
                style={{ 
                    backgroundColor: 'var(--primary-100)', 
                    color: 'var(--text-100)' 
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-100)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-100)'}
                onClick={onSave}
            >
                저장하기
            </button>
        </div>
    );
};

export default SaveButton;