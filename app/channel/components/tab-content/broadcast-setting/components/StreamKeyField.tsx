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
                <label className="w-[100px] text-text-primary">스트림키</label>
            </div>
            <div className="flex col-span-4 items-center space-x-2">
                <div className="flex w-full h-[40px] items-center px-2 py-1 rounded-md space-x-3 border border-border-primary bg-bg-tertiary">
                    <input
                        type={showStreamKey ? "text" : "password"}
                        value={streamKey}
                        readOnly
                        className="flex w-full focus:outline-none bg-transparent text-text-primary"
                    />
                    {showStreamKey ? (
                        <FiEyeOff
                            title="감추기"
                            size={iconSize}
                            onClick={onToggleVisibility}
                            className="cursor-pointer text-text-secondary hover:text-text-primary"
                        />
                    ) : (
                        <FiEye
                            title="보이기"
                            size={iconSize}
                            onClick={onToggleVisibility}
                            className="cursor-pointer text-text-secondary hover:text-text-primary"
                        />
                    )}
                    <FiCopy
                        title="복사하기"
                        size={iconSize}
                        onClick={() => onCopy(streamKey, "스트림키 복사")}
                        className="cursor-pointer text-text-secondary hover:text-text-primary"
                    />
                </div>
            </div>
            <div className="flex col-span-1 justify-center items-center">
                <button
                    className="px-2 py-1 rounded-md transition-colors border border-border-primary bg-bg-tertiary text-text-primary hover:bg-accent hover:text-white"
                    onClick={onReissue}
                >
                    재발급
                </button>
            </div>
        </div>
    );
};

export default StreamKeyField;