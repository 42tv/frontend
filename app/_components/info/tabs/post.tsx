import { Button } from "@mui/material";
import { useState } from "react";

export default function PostTab() {
    const [activeTab, setActiveTab] = useState('received');
    return (
        <div>
            <div className="flex flex-row px-10 mx-auto h-[60px] items-center space-x-10 border-b border-contentBg">
                <Button 
                    disableRipple 
                    className={`dark:hover:text-white ${activeTab === 'received' ? '' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('received')}
                    sx={{
                        '&:hover': {
                            backgroundColor: 'transparent',
                        },
                        textTransform: 'none',
                    }}>
                    받은 메세지
                </Button>
                <Button 
                    disableRipple 
                    className={`dark:hover:text-white ${activeTab === 'send' ? '' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('send')}
                    sx={{
                        '&:hover': {
                            backgroundColor: 'transparent',
                        },
                        textTransform: 'none',
                    }}>
                    보낸 메세지
                </Button>
                <Button 
                    disableRipple 
                    className={`dark:hover:text-white ${activeTab === 'ban' ? '' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('ban')}
                    sx={{
                        '&:hover': {
                            backgroundColor: 'transparent',
                        },
                        textTransform: 'none',
                    }}>
                    차단 목록
                </Button>
            </div> 
            aa
        </div>
    )
}