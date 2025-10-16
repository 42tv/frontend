import React from 'react';
import IvsPlayer from '../IvsPlayer'; // IvsPlayer 컴포넌트 가져오기

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

const StreamPlayer: React.FC<StreamPlayerProps> = ({ streamData }) => {
    return (
        <div className="w-full h-full bg-black flex items-center justify-center text-white">
            {/* IvsPlayer 컴포넌트를 사용하여 비디오 스트림 재생 */}
            <div className="w-full h-full max-w-full max-h-full">
                <IvsPlayer streamUrl={streamData.streamUrl} />
            </div>
        </div>
    );
};

export default StreamPlayer;
