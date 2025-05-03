'use client';
import { getApiErrorMessage } from "@/app/_apis/interfaces";
import { requestPlay } from "@/app/_apis/live";
import { requestCreateBookMark, requestDeleteBookMark } from "@/app/_apis/user";
import SendPost from "@/app/_components/info/tabs/post_tabs_component/send_post";
import Chat from "@/app/_components/live/stream/Chat";
import StreamPlayer from "@/app/_components/live/stream/StreamPlayer";
import ErrorMessage from "@/app/_components/modals/error_component";
import errorModalStore from "@/app/_components/utils/store/errorModalStore";
import useModalStore from "@/app/_components/utils/store/modalStore";
import usePlayStore from "@/app/_components/utils/store/playStore";
import { useEffect, useState, use } from "react"; // 'use' 제거
import { AiOutlineClockCircle, AiOutlineLike } from "react-icons/ai";
import { FiHeart, FiMail, FiUser } from "react-icons/fi";
import { GiPresent } from "react-icons/gi";
import { MdOutlineBookmark, MdOutlineBookmarkBorder } from "react-icons/md";
import Image from 'next/image'; 
import { PlayData } from "@/app/_components/utils/interfaces";
import useUserStore from "@/app/_components/utils/store/userStore";
import LoginComponent from "@/app/_components/modals/login_component";
import { formatElapsedTime } from "@/app/_components/utils/utils";

interface LivePageProps {
    user_id: string;
}

export default function LivePage({ params }: {params: Promise<LivePageProps>}) {
    const {playData} = usePlayStore();
    const {is_guest} = useUserStore();
    const [playDataState, setPlayDataState] = useState<PlayData>();
    const {openModal, closeModal} = useModalStore();
    const {openError} = errorModalStore();

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
        // playDataState가 undefined이면 함수를 종료합니다.
        if (!playDataState) {
            console.error("playDataState is undefined, cannot toggle bookmark.");
            return; 
        }
        // 게스트라면 로그인 컴포넌트
        if (is_guest) {
            openModal(<LoginComponent />)
            return;
        }

        try {
            console.log(playDataState.is_bookmarked) // playDataState가 존재하므로 안전하게 접근 가능
            if (playDataState.is_bookmarked) {
                await requestDeleteBookMark(user_id);
            }
            else {
                await requestCreateBookMark(user_id);
            }
            // playDataState가 존재하므로 안전하게 스프레드 가능
            setPlayDataState({
                ...playDataState,
                is_bookmarked: !playDataState.is_bookmarked,
            })
        }
        catch (e) {
            const message = getApiErrorMessage(e);
            openError(<ErrorMessage message={message} />);
        }
    }

    async function handleSendPost() {
        // 게스트라면 로그인 컴포넌트
        if (is_guest) {
            openModal(<LoginComponent />)
            return;
        }
        openModal(<SendPost close={closeModal} userId={(await params).user_id}/>);
    }

    useEffect(() => {
        async function fetchStreamUrl() {
            console.log(playData);
            console.log("playback_url:", playData?.playback_url);
            if (playData?.playback_url) {
                setPlayDataState({
                    playback_url: playData.playback_url,
                    title: playData.title,
                    is_bookmarked: playData.is_bookmarked,
                    profile_img: playData.profile_img,
                    nickname: playData.nickname,
                    play_cnt: playData.play_cnt,
                    like_cnt: playData.like_cnt,
                    start_time: playData.start_time,
                })
            }
            else {
                try {
                    const response = await requestPlay(user_id);
                    console.log("Response:", response);
                    setPlayDataState(response);
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
                <div className="flex flex-row w-full p-4 border-t border-gray-700 flex items-center flex-shrink-0 space-x-4">
                  {/* 프로필 이미지 영역 */}
                  <div className="flex items-center justify-center space-x-2 min-w-[60px]">
                    <Image
                        src={playDataState?.profile_img || "/icons/anonymouse1.svg"} // 기본 이미지 경로
                        alt="프로필 이미지"
                        width={60}
                        height={60}
                        className="rounded-full"
                    />
                  </div>
                  {/* 설명 텍스트 영역 */}
                  <div className="flex w-full flex-col">
                    <h2 className="text-xl font-semibold">{playData?.title}</h2>
                    <p className="text-gray-400">{playData?.nickname}</p>
                    <div className="flex items-center space-x-4 text-gray-400 text-sm mt-1">
                        <span className="flex items-center space-x-1">
                            <FiUser 
                                title="시청자"
                            />
                            <span>{playDataState?.play_cnt ?? 0}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                            <FiHeart 
                                title="추천"
                            />
                            <span>{playDataState?.play_cnt ?? 0}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                            <MdOutlineBookmark 
                                title="북마크"
                            />
                            <span>{playDataState?.like_cnt ?? 0}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                            <AiOutlineClockCircle />
                            <span>{formatElapsedTime(playDataState?.start_time || null)}</span>
                        </span>
                    </div>
                  </div>
                  {/* 아이콘 영역 */}
                  <div className="flex items-center justify-end space-x-4 text-gray-400 text-2xl"> {/* text-xl -> text-2xl */}
                    <button 
                        title="북마크" 
                        className="hover:text-white transition-colors duration-200"
                        onClick={() => { toggleBookmark();}}
                    >
                      {playDataState?.is_bookmarked ? <MdOutlineBookmark/> : <MdOutlineBookmarkBorder />} {/* 조건부 렌더링 */}
                    </button>
                    <button 
                        title="쪽지" 
                        className="hover:text-white transition-colors duration-200"
                        onClick={() => {
                            handleSendPost();
                        }}
                    >
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
