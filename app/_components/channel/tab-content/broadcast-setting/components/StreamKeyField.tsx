import React from 'react';
import { FiCopy, FiEye, FiEyeOff } from "react-icons/fi";

interface StreamKeyFieldProps {
    streamKey: string;
    showStreamKey: boolean;
    onToggleVisibility: () => void;
    onCopy: (text: string, label: string) => void;
    onReissue: () => void;
}

const StreamKeyField: React.FC<StreamKeyFieldProps> = ({
    streamKey,
    showStreamKey,
    onToggleVisibility,
    onCopy,
    onReissue
}) => {
    const iconSize = 25;

    return (
        <div className="grid grid-cols-6 items-center my-2">
            <div className="flex col-span-1 text-center items-center">
                <label className="w-[100px]" style={{ color: 'var(--text-100)' }}>스트림키</label>
            </div>
            <div className="flex col-span-4 items-center space-x-2">
                <div className="flex w-full h-[40px] items-center px-2 py-1 rounded-md space-x-3" style={{ border: '1px solid var(--bg-300)', backgroundColor: 'var(--bg-300)' }}>
                    <input 
                        type={showStreamKey ? "text" : "password"} 
                        value={streamKey} 
                        readOnly 
                        className="flex w-full focus:outline-none"
                        style={{ backgroundColor: 'transparent', color: 'var(--text-100)' }}
                    />
                    {showStreamKey ? (
                        <FiEyeOff 
                            title="감추기" 
                            size={iconSize} 
                            onClick={onToggleVisibility} 
                            className="cursor-pointer"
                            style={{ color: 'var(--text-200)' }}
                        />
                    ) : (
                        <FiEye 
                            title="보이기" 
                            size={iconSize} 
                            onClick={onToggleVisibility} 
                            className="cursor-pointer"
                            style={{ color: 'var(--text-200)' }}
                        />
                    )}
                    <FiCopy 
                        title="복사하기" 
                        size={iconSize} 
                        onClick={() => onCopy(streamKey, "스트림키 복사")} 
                        className="cursor-pointer"
                        style={{ color: 'var(--text-200)' }}
                    />
                </div>
            </div>
            <div className="flex col-span-1 justify-center items-center">
                <button 
                    className="px-2 py-1 rounded-md transition-colors"
                    style={{ 
                        border: '1px solid var(--bg-300)', 
                        backgroundColor: 'var(--bg-300)', 
                        color: 'var(--text-100)' 
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-100)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-300)'}
                    onClick={onReissue}
                >
                    재발급
                </button>
            </div>
        </div>
    );
};

export default StreamKeyField;