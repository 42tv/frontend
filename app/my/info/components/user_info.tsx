"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/app/_lib/stores";
import UserProfileImg from "./user_profile_img";
import { getPosts } from "@/app/_apis/posts";
import type { Post } from "./tabs/post_tabs_component/types/message";
import { StarCoinIcon } from "@/app/_components/icons/StarCoinIcon";
import { PostIcon } from "@/app/_components/icons/PostIcon";

// UserInfo 컴포넌트는 사용자의 프로필 이미지와 닉네임, 코인, 메시지 수를 보여주는 컴포넌트입니다.
export default function UserInfo() {
    const fetchUser = useUserStore(state => state.fetchUser);
    const profile_img = useUserStore(state => state.profile_img);
    const nickname = useUserStore(state => state.nickname);
    const coinBalance = useUserStore(state => state.coin.balance);
    const [isUserLoading, setIsUserLoading] = useState(() => !Boolean(useUserStore.getState().user_id));
    const [isPostsLoading, setIsPostsLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState<number>(0);

    useEffect(() => {
        let active = true;

        async function loadUser() {
            try {
                if (!useUserStore.getState().user_id) {
                    await fetchUser();
                }
            } finally {
                if (active) {
                    setIsUserLoading(false);
                }
            }
        }

        loadUser();

        return () => {
            active = false;
        };
    }, [fetchUser]);

    useEffect(() => {
        let active = true;

        getPosts()
            .then((posts: Post[]) => {
                if (!active) return;
                const count = posts.filter((p) => !p.is_read).length;
                setUnreadCount(count);
            })
            .catch(() => {
                if (!active) return;
                setUnreadCount(0);
            })
            .finally(() => {
                if (active) {
                    setIsPostsLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, []);

    if (isUserLoading) {
        return <UserInfoSkeleton />;
    }

    return (
        <div className="flex flex-col w-full h-[200px] justify-center pt-[48px]">
            <div className="flex justify-center">
                <UserProfileImg
                    profilePath={profile_img || ''} // 기본값 제공
                    width={100}
                    height={100}
                />
            </div>
            <div className='flex-col w-full h-[48px] justify-center items-center text-center text-text-primary dark:text-text-primary-dark'>
                <div className="font-semibold text-lg">{nickname}</div>
                <div className="flex justify-center items-center gap-4 text-text-secondary dark:text-text-secondary-dark mt-2">
                    <span className="flex items-center gap-1">
                        <StarCoinIcon size={18} />
                        {coinBalance.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                        <PostIcon size={18} />
                        {isPostsLoading ? <CountValueSkeleton /> : unreadCount}
                    </span>
                </div>
            </div>
        </div>
    )
}

function UserInfoSkeleton() {
    return (
        <div className="flex flex-col w-full h-[200px] justify-center pt-[48px]" aria-hidden="true">
            <div className="flex justify-center">
                <div className="relative">
                    <div className="h-[100px] w-[100px] animate-pulse rounded-full border border-border-primary bg-bg-secondary" />
                    <div className="absolute bottom-0 right-1/2 h-8 w-8 translate-x-10 translate-y-1 animate-pulse rounded-full bg-bg-secondary" />
                </div>
            </div>
            <div className="flex flex-col w-full h-[48px] items-center justify-center text-center mt-3">
                <div className="h-6 w-28 animate-pulse rounded bg-bg-secondary" />
                <div className="mt-2 flex items-center justify-center gap-4 text-text-secondary dark:text-text-secondary-dark">
                    <div className="h-5 w-16 animate-pulse rounded bg-bg-secondary" />
                    <div className="h-5 w-14 animate-pulse rounded bg-bg-secondary" />
                </div>
            </div>
        </div>
    );
}

function CountValueSkeleton() {
    return <span className="h-4 w-8 animate-pulse rounded bg-bg-secondary" aria-hidden="true" />;
}
