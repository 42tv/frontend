import { useState } from "react";
import ReceiveMessage from "./post_tabs_component/receive_message";
import SentMessage from "./post_tabs_component/sent_message";
import BlockPostUser from "./post_tabs_component/block_post_user";

export default function PostTab() {
    const [activeTab, setActiveTab] = useState('received');
    return (
        <div>
            <div className="flex flex-row px-10 mx-auto h-[60px] items-center space-x-10 border-b border-bg-300">
                <button
                    className={`${activeTab === 'received' ? 'text-accent' : 'text-text-secondary'} transition-colors font-medium`}
                    onClick={() => setActiveTab('received')}>
                    받은 메세지
                </button>
                <button
                    className={`${activeTab === 'send' ? 'text-accent' : 'text-text-secondary'} transition-colors font-medium`}
                    onClick={() => setActiveTab('send')}>
                    보낸 메세지
                </button>
                <button
                    className={`${activeTab === 'block' ? 'text-accent' : 'text-text-secondary'} transition-colors font-medium`}
                    onClick={() => setActiveTab('block')}>
                    차단 목록
                </button>
            </div> 
            <div className="mb-5"/>
            {
                (activeTab == 'received') && (
                    <ReceiveMessage />
                )
            }
            {
                (activeTab == 'send') && (
                    <SentMessage />
                )
            }
            {
                (activeTab == 'block') && (
                    <BlockPostUser />
                )
            }
            
        </div>
    )
}