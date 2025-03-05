import { useState } from "react";

export default function PostTab() {
    const [activeTab, setActiveTab] = useState('received');
    return (
        <div>
            <div className="flex flex-row px-10 mx-auto h-[60px] items-center space-x-10 border-b border-contentBg">
                <button 
                    className={`dark:hover:text-white bg-transparent ${activeTab === 'received' ? 'font-semibold' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('received')}>
                    받은 메세지
                </button>
                <button 
                    className={`dark:hover:text-white bg-transparent ${activeTab === 'send' ? 'font-semibold' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('send')}>
                    보낸 메세지
                </button>
                <button 
                    className={`dark:hover:text-white bg-transparent ${activeTab === 'ban' ? 'font-semibold' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('ban')}>
                    차단 목록
                </button>
            </div> 
            aa
        </div>
    )
}