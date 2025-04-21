import React from 'react';

interface StreamData {
    streamUrl: string;
    title: string;
    description: string;
}

interface UserData {
    nickname: string;
    profileImageUrl: string;
}

interface StreamPlayerProps {
    streamData: StreamData;
    userData: UserData;
}

const StreamPlayer: React.FC<StreamPlayerProps> = ({ streamData, userData }) => {
    return (
        <div className="aspect-video bg-black flex items-center justify-center text-white">
            {/* TODO: 실제 비디오 플레이어 구현 (예: ReactPlayer, IVS Player SDK) */}
            <span>Video Player Placeholder</span>
            {/* streamData.streamUrl을 사용하여 플레이어 설정 */}
        </div>
    );
};

export default StreamPlayer;
