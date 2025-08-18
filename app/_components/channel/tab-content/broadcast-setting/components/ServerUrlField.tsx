import React from 'react';
import { FiCopy } from "react-icons/fi";

interface ServerUrlFieldProps {
    serverUrl: string;
    onCopy: (text: string, label: string) => void;
}

const ServerUrlField: React.FC<ServerUrlFieldProps> = ({
    serverUrl,
    onCopy
}) => {
    const iconSize = 25;

    return (
        <div className="grid grid-cols-6 my-2">
            <div className="flex col-span-1 text-center items-center">
                <label className="w-[100px]">서버URL</label>
            </div>
            <div className="flex col-span-5 items-center space-x-2">
                <div className="flex w-full h-[40px] border border-gray-700 items-center px-2 py-1 rounded-md space-x-3">
                    <input 
                        type="text"
                        value={serverUrl} 
                        readOnly 
                        className="flex w-full focus:outline-none"
                    />
                    <FiCopy 
                        title="복사하기" 
                        size={iconSize} 
                        onClick={() => onCopy(serverUrl, "서버URL 복사")} 
                        className="cursor-pointer" 
                    />
                </div>
            </div>
        </div>
    );
};

export default ServerUrlField;