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
                <label className="w-[100px]" style={{ color: 'var(--text-100)' }}>서버URL</label>
            </div>
            <div className="flex col-span-5 items-center space-x-2">
                <div className="flex w-full h-[40px] items-center px-2 py-1 rounded-md space-x-3" style={{ border: '1px solid var(--bg-300)', backgroundColor: 'var(--bg-300)' }}>
                    <input 
                        type="text"
                        value={serverUrl} 
                        readOnly 
                        className="flex w-full focus:outline-none"
                        style={{ backgroundColor: 'transparent', color: 'var(--text-100)' }}
                    />
                    <FiCopy 
                        title="복사하기" 
                        size={iconSize} 
                        onClick={() => onCopy(serverUrl, "서버URL 복사")} 
                        className="cursor-pointer"
                        style={{ color: 'var(--text-200)' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ServerUrlField;