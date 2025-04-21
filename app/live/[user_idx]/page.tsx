import Chat from "@/app/_components/live/stream/Chat";
import StreamPlayer from "@/app/_components/live/stream/StreamPlayer";

interface LivePageProps {
    params: {
        user_idx: string;
    };
}

export default function LivePage({ params }: LivePageProps) {
    // TODO: user_idx를 사용하여 라이브 스트림 정보 및 사용자 정보 가져오기
    const user_idx = params.user_idx;
    const streamData = { // 임시 데이터
        streamUrl: "", // 실제 스트림 URL 필요
        title: `User ${user_idx}'s Live Stream`,
        description: "Welcome to the stream!",
    };
    const userData = { // 임시 데이터
        nickname: `User ${user_idx}`,
        profileImageUrl: "/placeholder.png", // 실제 프로필 이미지 URL 필요
    };

    return (
        <div className="flex flex-row w-full h-full"> {/* 헤더 높이 제외한 전체 높이 */}
            <div className="flex flex-col flex-1">
                {/* 스트림 플레이어 영역 */}
                <StreamPlayer streamData={streamData} userData={userData} />
                {/* 스트림 정보 영역 */}
                <div className="p-4 border-t border-gray-700 flex-shrink-0"> {/* flex-shrink-0 추가 */}
                    <h2 className="text-xl font-semibold">{streamData.title}</h2>
                    <p className="text-sm text-gray-400">{userData.nickname}</p>
                    {/* TODO: 시청자 수, 좋아요 수 등 추가 정보 */}
                </div>
            </div>
             {/* 채팅 영역 컨테이너 */}
             <div className="w-80 border-l border-gray-700 flex flex-col">
                {/* 채팅 컴포넌트 래퍼 - 세로 공간을 채우도록 flex-1 추가 */}
                <div className="flex-1 min-h-0"> {/* flex-1 및 min-h-0 추가 */}
                    <Chat user_idx={user_idx} /> {/* Chat 컴포넌트가 부모를 채운다고 가정 */}
                </div>
            </div>
        </div>
    );
}
