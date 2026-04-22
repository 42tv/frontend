import { useState } from "react";
import ReceiveMessage from "./post_tabs_component/receive_message";
import SentMessage from "./post_tabs_component/sent_message";
import BlockPostUser from "./post_tabs_component/block_post_user";

export default function PostTab() {
    const [activeTab, setActiveTab] = useState('received');
    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex flex-row px-6 pt-5 pb-4 items-center space-x-8 border-b border-border-primary">
                <button
                    className={`transition-colors ${
                        activeTab === 'received'
                            ? 'font-semibold text-text-primary'
                            : 'font-medium text-text-secondary hover:text-text-primary'
                    }`}
                    onClick={() => setActiveTab('received')}>
                    받은 메세지
                </button>
                <button
                    className={`transition-colors ${
                        activeTab === 'send'
                            ? 'font-semibold text-text-primary'
                            : 'font-medium text-text-secondary hover:text-text-primary'
                    }`}
                    onClick={() => setActiveTab('send')}>
                    보낸 메세지
                </button>
                <button
                    className={`transition-colors ${
                        activeTab === 'block'
                            ? 'font-semibold text-text-primary'
                            : 'font-medium text-text-secondary hover:text-text-primary'
                    }`}
                    onClick={() => setActiveTab('block')}>
                    차단 목록
                </button>
            </div>
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
