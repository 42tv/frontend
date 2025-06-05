'use client';
import { getApiErrorMessage } from "@/app/_apis/interfaces";
import { requestPlay, requestLike } from "@/app/_apis/live";
import { requestCreateBookMark, requestDeleteBookMark } from "@/app/_apis/user";
import SendPost from "@/app/_components/info/tabs/post_tabs_component/send_post";
import Chat from "@/app/_components/live/stream/Chat";
import StreamPlayer from "@/app/_components/live/stream/StreamPlayer";
import ErrorMessage from "@/app/_components/modals/error_component";
import errorModalStore from "@/app/_components/utils/store/errorModalStore";
import useModalStore from "@/app/_components/utils/store/modalStore";
import usePlayStore from "@/app/_components/utils/store/playStore";
import { useEffect, useState, useRef, use } from "react";
import { AiOutlineClockCircle, AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FiHeart, FiMail, FiUser } from "react-icons/fi";
import { GiPresent } from "react-icons/gi";
import { MdOutlineBookmark, MdOutlineBookmarkBorder } from "react-icons/md";
import Image from 'next/image'; 
import { PlayData } from "@/app/_components/utils/interfaces";
import useUserStore from "@/app/_components/utils/store/userStore";
import LoginComponent from "@/app/_components/modals/login_component";
import { formatElapsedTimeBySeconds } from "@/app/_components/utils/utils";
import { Socket, io } from "socket.io-client";
import { useRouter } from "next/navigation";
import { BsPlayFill } from "react-icons/bs";

interface LivePageProps {
    broadcasterId: string;
}

export default function LivePage({ params }: {params: Promise<LivePageProps>}) {
    const {playData} = usePlayStore();
    const {is_guest} = useUserStore();
    const [playDataState, setPlayDataState] = useState<PlayData | null>();
    const [elapsedTime, setElapsedTime] = useState<string>(''); // 경과 시간 상태 추가
    const [socket, setSocket] = useState<Socket | null>(null); // 소켓 상태 추가
    const socketRef = useRef<Socket | null>(null); // 최신 소켓 인스턴스 추적을 위한 ref 추가
    const {openModal, closeModal} = useModalStore();
    const {openError} = errorModalStore();
    const router = useRouter();

    // TODO: broadcasterIdx를 사용하여 라이브 스트림 정보 및 사용자 정보 가져오기
    const broadcasterId = use(params).broadcasterId;
    const streamData = { // 임시 데이터
        streamUrl: "https://3d26876b73d7.us-west-2.playback.live-video.net/api/video/v1/us-west-2.913157848533.channel.rkCBS9iD1eyd.m3u8", // 실제 스트림 URL 필요
        title: `User ${broadcasterId}'s Live Stream`,
        description: "Welcome to the stream!",
    };
    const userData = { // 임시 데이터
        nickname: `User ${broadcasterId}`,
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
                await requestDeleteBookMark(broadcasterId);
            }
            else {
                await requestCreateBookMark(broadcasterId);
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
        openModal(<SendPost close={closeModal} userId={(await params).broadcasterId}/>);
    }

    async function handleRecommend() {
        // 게스트라면 로그인 컴포넌트
        if (is_guest) {
            openModal(<LoginComponent />)
            return;
        }

        if (!playDataState) return;

        try {
            const response = await requestLike(playDataState.broadcaster_idx);
            console.log("Like response:", response);
            // Update like count if the API returns it
            if (response.recommend_cnt !== undefined) {
                setPlayDataState({
                    ...playDataState,
                    recommend_cnt: response.recommend_cnt,
                });
            }
        } catch (e) {
            const message = getApiErrorMessage(e);
            openError(<ErrorMessage message={message} />);
        }
    }

    useEffect(() => {
        async function fetchStreamUrl() {
            if (playData) {
                console.log(playData);
                setPlayDataState({
                    broadcaster_idx: playData.broadcaster_idx,
                    broadcaster_id: playData.broadcaster_id,
                    broadcaster_nickname: playData.broadcaster_nickname,
                    playback_url: playData.playback_url,
                    title: playData.title,
                    is_bookmarked: playData.is_bookmarked,
                    profile_img: playData.profile_img,
                    nickname: playData.nickname,
                    viewer_cnt: playData.viewer_cnt,
                    play_cnt: playData.play_cnt,
                    recommend_cnt: playData.recommend_cnt,
                    start_time: playData.start_time,
                    play_token: playData.play_token,
                })
                const newSocket: Socket = io(`ws://${process.env.NEXT_PUBLIC_BACKEND}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/chat`, {
                    withCredentials: true,
                    auth: {
                        token: `Bearer ${playData.play_token}`,
                    },
                    transports: ['websocket'],
                });
                setSocket(newSocket); // 소켓 상태 설정
                socketRef.current = newSocket; // ref에 최신 소켓 저장
            }
            else {
                try {
                    const response = await requestPlay(broadcasterId);
                    console.log("Response:", response);
                    setPlayDataState({
                        broadcaster_idx: response.broadcaster_idx,
                        broadcaster_id: response.broadcaster_id,
                        broadcaster_nickname: response.broadcaster_nickname,
                        playback_url: response.playback_url,
                        title: response.title,
                        is_bookmarked: response.is_bookmarked,
                        profile_img: response.profile_img,
                        nickname: response.nickname,
                        viewer_cnt: response.viewer_cnt,
                        play_cnt: response.play_cnt,
                        recommend_cnt: response.recommend_cnt,
                        start_time: response.start_time,
                        play_token: response.play_token,
                    });
                    const newSocket: Socket = io(`ws://${process.env.NEXT_PUBLIC_BACKEND}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/chat`, {
                        withCredentials: true,
                        auth: {
                            token: `Bearer ${response.play_token}`,
                        },
                        transports: ['websocket'],
                    });
                    setSocket(newSocket); // 소켓 상태 설정
                    socketRef.current = newSocket; // ref에 최신 소켓 저장
                }
                catch(e) {
                    const message = getApiErrorMessage(e);
                    router.push('/live'); // 홈으로 리다이렉트
                    openError(<ErrorMessage message={message} />);
                }
            }
        }
        fetchStreamUrl();

        return () => {
            // ref를 사용해 최신 소켓 인스턴스를 해제
            socketRef.current?.disconnect();
            socketRef.current = null;
            setSocket(null); // 소켓 상태 초기화
        };
    }, []); // Adjusted dependencies

    useEffect(() => {
        socketRef.current?.on('duplicate_connection', () => {
            openError(<ErrorMessage message="다른 기기에서 접속하였습니다" />);
            router.push('/'); // 홈으로 리다이렉트
        })
        socketRef.current?.on('viewer_count', (data) => {
            setPlayDataState((prevState) => {
                if (!prevState) return null; // 이전 상태가 없으면 null 반환
                return {
                    ...prevState,
                    viewer_cnt: data.viewer_cnt, // 서버로부터 받은 play_cnt 업데이트
                };
            });
        })
        return () => {
            socketRef.current?.off('duplicate_connection'); // 컴포넌트 언마운트 시 이벤트 리스너 해제
            socketRef.current?.off('viewer_count'); // 컴포넌트 언마운트 시 이벤트 리스너 해제
        }
    }, [socketRef.current]); // socketRef.current가 변경될 때마다 실행

    // 경과 시간 업데이트를 위한 useEffect 추가
    useEffect(() => {
        if (!playDataState?.start_time) {
            setElapsedTime(''); // 시작 시간이 없으면 초기화
            return;
        }
        // 초기 경과 시간 설정
        setElapsedTime(formatElapsedTimeBySeconds(playDataState.start_time));

        // 1초마다 경과 시간 업데이트
        const intervalId = setInterval(() => {
            setElapsedTime(formatElapsedTimeBySeconds(playDataState.start_time));
        }, 1000); // 1000ms = 1초
        
        // 컴포넌트 언마운트 시 인터벌 정리
        return () => clearInterval(intervalId);
    }, [playDataState?.start_time]); // start_time이 변경될 때마다 실행

    return (
        <div className="flex flex-row w-full h-full">
            <div className="flex flex-col flex-1">
                {/* 스트림 플레이어 영역 */}
                <StreamPlayer streamData={streamData} userData={userData} />
                {/* 스트림 정보 영역 */}
                <div className="flex flex-row w-full p-4 border-t border-gray-700 flex items-center space-x-4">
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
                    <h2 className="text-xl font-semibold">{playDataState?.title}</h2>
                    <p className="dark:text-textBase-dark text-textBase">{playDataState?.nickname}</p>
                    <div className="flex items-center space-x-4 dark:text-textBase-dark text-textBase text-sm mt-1">
                        <span className="flex items-center space-x-1 ">
                            <FiUser 
                                title="시청자"
                            />
                            <span>{playDataState?.viewer_cnt ?? 0}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                            <AiOutlineLike 
                                title="추천"
                            />
                            <span>{playDataState?.recommend_cnt ?? 0}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                            <MdOutlineBookmark 
                                title="북마크"
                            />
                            <span>{playDataState?.recommend_cnt ?? 0}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                            <AiOutlineClockCircle />
                            <span>{elapsedTime}</span> {/* 상태 변수 사용 */}
                        </span>
                    </div>
                  </div>
                  {/* 아이콘 영역 */}
                  <div className="flex items-center justify-end space-x-4 text-gray-400 text-2xl">
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
                    <button 
                        title="좋아요" 
                        className="hover:text-white transition-colors duration-200"
                        onClick={handleRecommend}
                    >
                      <AiOutlineLike/>
                    </button>
                    <button title="선물" className="hover:text-white transition-colors duration-200">
                      <GiPresent/>
                    </button>
                  </div>
                </div>
            </div>
             {/* 채팅 영역 컨테이너 */}
             <div className="flex flex-col h-full w-80 border-l border-gray-700 overflow-auto">
                <div className="flex-1 h-full">
                    <Chat broadcasterId={broadcasterId} socket={socket} />
                </div>
            </div>
        </div>
    );
}
