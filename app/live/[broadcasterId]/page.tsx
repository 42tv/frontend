'use client';
import { getApiErrorMessage } from "@/app/_apis/interfaces";
import { requestPlay, requestLike } from "@/app/_apis/live";
import { requestCreateBookMark, requestDeleteBookMark } from "@/app/_apis/user";
import SendPost from "@/app/_components/info/tabs/post_tabs_component/send_post";
import Chat from "@/app/_components/live/stream/Chat";
import StreamPlayer from "@/app/_components/live/stream/StreamPlayer";
import StreamInfo from "@/app/_components/live/StreamInfo";
import ErrorMessage from "@/app/_components/modals/error_component";
import errorModalStore from "@/app/_components/utils/store/errorModalStore";
import useModalStore from "@/app/_components/utils/store/modalStore";
import usePlayStore from "@/app/_components/utils/store/playStore";
import { useEffect, useState, useRef, use } from "react";
import { PlayData } from "@/app/_components/utils/interfaces";
import useUserStore from "@/app/_components/utils/store/userStore";
import LoginComponent from "@/app/_components/modals/login_component";
import { Socket, io } from "socket.io-client";
import { useRouter } from "next/navigation";

interface LivePageProps {
    broadcasterId: string;
}

export default function LivePage({ params }: {params: Promise<LivePageProps>}) {
    const {playData} = usePlayStore();
    const {is_guest, idx} = useUserStore();
    const [playDataState, setPlayDataState] = useState<PlayData | null>();
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
            console.log(playDataState.user.is_bookmarked) // playDataState가 존재하므로 안전하게 접근 가능
            if (playDataState.user.is_bookmarked) {
                await requestDeleteBookMark(broadcasterId);
            }
            else {
                await requestCreateBookMark(broadcasterId);
            }
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
            const response = await requestLike(playDataState.broadcaster.idx);
            console.log("Like response:", response);
            // Update like count if the API returns it
            if (response.recommend_cnt !== undefined) {
                setPlayDataState({
                    ...playDataState,
                    stream: {
                        ...playDataState.stream,
                        recommend_cnt: response.recommend_cnt,
                    }
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
                    broadcaster: playData.broadcaster,
                    stream: playData.stream,
                    user: playData.user,
                    viewer_cnt: 0,
                })
                const newSocket: Socket = io(`ws://${process.env.NEXT_PUBLIC_BACKEND}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/chat`, {
                    withCredentials: true,
                    auth: {
                        token: `Bearer ${playData.user.play_token}`,
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
                        broadcaster: response.broadcaster,
                        stream: response.stream,
                        user: response.user,
                        viewer_cnt: 0,
                    });
                    const newSocket: Socket = io(`ws://${process.env.NEXT_PUBLIC_BACKEND}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/chat`, {
                        withCredentials: true,
                        auth: {
                            token: `Bearer ${response.user.play_token}`,
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
        if (!socket) return; // socket이 없으면 아무것도 하지 않음

        const handleDuplicateConnection = () => {
            openError(<ErrorMessage message="다른 기기에서 접속하였습니다" />);
            router.push('/'); // 홈으로 리다이렉트
        };

        const handleRecommend = (data: any) => {
            setPlayDataState((prevState: PlayData | null | undefined) => {
                if (!prevState) return null; // 이전 상태가 없으면 null 반환
                return {
                    ...prevState,
                    stream: {
                        ...prevState.stream,
                        recommend_cnt: prevState.stream.recommend_cnt + 1, // 서버로부터 받은 recommend_cnt 업데이트
                    }
                };
            });
        };

        const handleViewerCount = (data: any) => {
            setPlayDataState((prevState: PlayData | null | undefined) => {
                if (!prevState) return null; // 이전 상태가 없으면 null 반환
                return {
                    ...prevState,
                    viewer_cnt: data.viewer_cnt, // 서버로부터 받은 viewer_cnt 업데이트
                };
            });
        };

        const handleBookmark = (data: any) => {
            setPlayDataState((prevState: PlayData | null | undefined) => {
                if (!prevState) {
                    console.log("Previous state is null, cannot update bookmark.");
                    return null; // 이전 상태가 없으면 null 반환
                }
                const adder = data.action == 'add' ? 1 : -1; // action에 따라 +1 또는 -1
                return {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        is_bookmarked: data.user_idx == idx ? !prevState.user.is_bookmarked : prevState.user.is_bookmarked, // 자신의 북마크가 아닌 경우에만 상태 변경
                    },
                    stream: {
                        ...prevState.stream,
                        bookmark_cnt: (prevState.stream.bookmark_cnt + adder),
                    }
                };
            });
        };

        socket.on('duplicate_connection', handleDuplicateConnection);
        socket.on('recommend', handleRecommend);
        socket.on('viewer_count', handleViewerCount);
        socket.on('bookmark', handleBookmark);

        return () => {
            socket.off('duplicate_connection', handleDuplicateConnection);
            socket.off('recommend', handleRecommend);
            socket.off('viewer_count', handleViewerCount);
            socket.off('bookmark', handleBookmark);
        };
    }, [socket, openError, router]); // socket이 변경될 때만 실행

    return (
        <div className="flex flex-row w-full h-full">
            <div className="flex flex-col flex-1">
                {/* 스트림 플레이어 영역 */}
                <StreamPlayer streamData={streamData} userData={userData} />
                {/* 스트림 정보 영역 */}
                <StreamInfo 
                    playDataState={playDataState}
                    onToggleBookmark={toggleBookmark}
                    onSendPost={handleSendPost}
                    onRecommend={handleRecommend}
                />
            </div>
             {/* 채팅 영역 컨테이너 */}
             <div className="flex flex-col h-full w-80 border-l border-border-secondary dark:border-border-secondary-dark overflow-auto">
                <div className="flex-1 h-full">
                    {playDataState && (
                        <Chat 
                            broadcasterId={broadcasterId} 
                            socket={socket} 
                            myInfo={playDataState.user}
                            broadcasterIdx={playDataState.broadcaster.idx}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
