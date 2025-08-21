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
                <label className="w-[100px]">스트림키</label>
            </div>
            <div className="flex col-span-4 items-center space-x-2">
                <div className="flex w-full h-[40px] border border-gray-700 items-center px-2 py-1 rounded-md space-x-3">
                    <input 
                        type={showStreamKey ? "text" : "password"} 
                        value={streamKey} 
                        readOnly 
                        className="flex w-full focus:outline-none"
                    />
                    {showStreamKey ? (
                        <FiEyeOff 
                            title="감추기" 
                            size={iconSize} 
                            onClick={onToggleVisibility} 
                            className="cursor-pointer" 
                        />
                    ) : (
                        <FiEye 
                            title="보이기" 
                            size={iconSize} 
                            onClick={onToggleVisibility} 
                            className="cursor-pointer" 
                        />
                    )}
                    <FiCopy 
                        title="복사하기" 
                        size={iconSize} 
                        onClick={() => onCopy(streamKey, "스트림키 복사")} 
                        className="cursor-pointer" 
                    />
                </div>
            </div>
            <div className="flex col-span-1 justify-center items-center">
                <button 
                    className="border border-gray-700 px-2 py-1 rounded-md hover:bg-bg-hover dark:hover:bg-bg-hover-dark transition-colors"
                    onClick={onReissue}
                >
                    재발급
                </button>
            </div>
        </div>
    );
};

export default StreamKeyField;