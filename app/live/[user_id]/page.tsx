'use client';
import { getApiErrorMessage } from "@/app/_apis/interfaces";
import { requestPlay } from "@/app/_apis/live";
import { requestCreateBookMark, requestDeleteBookMark } from "@/app/_apis/user";
import Chat from "@/app/_components/live/stream/Chat";
import StreamPlayer from "@/app/_components/live/stream/StreamPlayer";
import ErrorMessage from "@/app/_components/modals/error_component";
import errorModalStore from "@/app/_components/utils/store/errorModalStore";
import usePlayStore from "@/app/_components/utils/store/playStore";
import { useEffect, useState, use } from "react"; // 'use' 제거
import { AiOutlineLike } from "react-icons/ai";
import { FiMail } from "react-icons/fi";
import { GiPresent } from "react-icons/gi";
import { MdOutlineBookmark, MdOutlineBookmarkBorder } from "react-icons/md";

interface LivePageProps {
    user_id: string;
}

export default function LivePage({ params }: {params: Promise<LivePageProps>}) {
    const {playback_url, setPlaybackUrl} = usePlayStore();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const {openError} = errorModalStore();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [streamUrl, setStreamUrl] = useState<string>("");

    // TODO: user_idx를 사용하여 라이브 스트림 정보 및 사용자 정보 가져오기
    const user_id = use(params).user_id;
    const streamData = { // 임시 데이터
        streamUrl: "https://3d26876b73d7.us-west-2.playback.live-video.net/api/video/v1/us-west-2.913157848533.channel.rkCBS9iD1eyd.m3u8", // 실제 스트림 URL 필요
        title: `User ${user_id}'s Live Stream`,
        description: "Welcome to the stream!",
    };
    const userData = { // 임시 데이터
        nickname: `User ${user_id}`,
        profileImageUrl: "/placeholder.png", // 실제 프로필 이미지 URL 필요
    };

    async function toggleBookmark() {
        try {
            if (isBookmarked) {
                await requestDeleteBookMark(user_id);
            }
            else {
                await requestCreateBookMark(user_id);
            }
            setIsBookmarked(!isBookmarked);
        }
        catch (e) {
            const message = getApiErrorMessage(e);
            openError(<ErrorMessage message={message} />);
        }
    }

    useEffect(() => {
        async function fetchStreamUrl() {
            console.log("playback_url:", playback_url);
            if (playback_url) {
                setStreamUrl(playback_url);
                setPlaybackUrl(null); // playback_url 사용 후 초기화
            }
            else {
                try {
                    const response = await requestPlay(user_id);
                    console.log("Response:", response);
                    if (response && response.playback_url) { // 응답 및 playback_url 확인
                        setStreamUrl(response.playback_url);
                        setIsBookmarked(response.is_bookmarked);
                    } else {
                         console.error("Invalid response structure:", response);
                    }
                }
                catch(e) {
                    const message = getApiErrorMessage(e);
                    openError(<ErrorMessage message={message} />);
                    
                }
            }
        }
        fetchStreamUrl();
    }, []); // 의존성 배열 업데이트

    return (
        <div className="flex flex-row w-full h-full"> {/* 헤더 높이 제외한 전체 높이 */}
            <div className="flex flex-col flex-1">
                {/* 스트림 플레이어 영역 */}
                <StreamPlayer streamData={streamData} userData={userData} />
                {/* 스트림 정보 영역 */}
                {/* 스트림 정보 영역 */}
                <div className="p-4 border-t border-gray-700 flex items-center justify-between flex-shrink-0">
                  {/* 텍스트 정보 */}
                  <div>
                    <h2 className="text-xl font-semibold">{streamData.title}</h2>
                    <p className="text-sm text-gray-400">{userData.nickname}</p>
                  </div>

                  {/* 아이콘 영역 */}
                  <div className="flex items-center space-x-4 text-gray-400 text-2xl"> {/* text-xl -> text-2xl */}
                    <button 
                        title="북마크" 
                        className="hover:text-white transition-colors duration-200"
                        onClick={() => { toggleBookmark();}}
                    >
                      {isBookmarked ? <MdOutlineBookmark/> : <MdOutlineBookmarkBorder />} {/* 조건부 렌더링 */}
                    </button>
                    <button title="쪽지" className="hover:text-white transition-colors duration-200">
                      <FiMail />
                    </button>
                    <button title="좋아요" className="hover:text-white transition-colors duration-200">
                      <AiOutlineLike/>
                    </button>
                    <button title="선물" className="hover:text-white transition-colors duration-200">
                      <GiPresent/>
                    </button>
                    </div>
                </div>
            </div>
             {/* 채팅 영역 컨테이너 */}
             <div className="w-80 border-l border-gray-700 flex flex-col">
                {/* 채팅 컴포넌트 래퍼 - 세로 공간을 채우도록 flex-1 추가 */}
                <div className="flex-1 min-h-0"> {/* flex-1 및 min-h-0 추가 */}
                    <Chat user_id={user_id} /> {/* Chat 컴포넌트가 부모를 채운다고 가정 */}
                </div>
            </div>
        </div>
    );
}
