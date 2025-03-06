import { useState } from "react";
import ReceiveMessage from "./post_tabs_component/receive_message";

export default function PostTab() {
    const [activeTab, setActiveTab] = useState('received');
    return (
        <div>
            <div className="flex flex-row px-10 mx-auto h-[60px] items-center space-x-10 border-b border-contentBg">
                <button 
                    className={`${activeTab === 'received' ? 'font-semibold text-black dark:text-white' : 'text-textBase dark:text-textBase-dark'}`}
                    onClick={() => setActiveTab('received')}>
                    받은 메세지
                </button>
                <button 
                    className={`${activeTab === 'send' ? 'font-semibold text-black dark:text-white' : 'text-textBase dark:text-textBase-dark'}`}
                    onClick={() => setActiveTab('send')}>
                    보낸 메세지
                </button>
                <button 
                    className={`${activeTab === 'ban' ? 'font-semibold text-black dark:text-white' : 'text-textBase dark:text-textBase-dark'}`}
                    onClick={() => setActiveTab('ban')}>
                    차단 목록
                </button>
            </div> 
            <div className="mb-5"/>
            {
                (activeTab == 'received') && (
                    <ReceiveMessage />
                )
            }
            
        </div>
    )
}