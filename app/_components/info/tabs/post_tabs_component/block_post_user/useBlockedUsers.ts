import { useState, useEffect } from "react";
import { getBlockedPostUser, unblockPostUser, unblockPostUsers } from "@/app/_apis/posts";

interface BlockedUser {
    id: number;
    blocked: {
        idx: number;
        user_id: string;
        nickname: string;
        profile_img: string;
    }
    created_at: string;
}

export const useBlockedUsers = () => {
    const [blockedUser, setBlockedUser] = useState<BlockedUser[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<BlockedUser[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [searchNickname, setSearchNickname] = useState('');

    useEffect(() => {
        async function fetchPosts() {
            const response = await getBlockedPostUser();
            setBlockedUser(response);
            setFilteredUsers(response);
            console.log(response);
        }
        fetchPosts();
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchNickname(value);
        
        if (value.trim() === '') {
            setFilteredUsers(blockedUser);
        } else {
            const filtered = blockedUser.filter(user => 
                user.blocked.nickname.toLowerCase().includes(value.toLowerCase()) ||
                user.blocked.user_id.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    };

    const handleSelectUser = (userIdx: number) => {
        setSelectedUsers(prev =>
            prev.includes(userIdx)
                ? prev.filter(id => id !== userIdx)
                : [...prev, userIdx]
        );
    };

    const removeBlockedUsers = async () => {
        try {
            const response = await unblockPostUsers(selectedUsers);
            setBlockedUser(prev => prev.filter(user => !selectedUsers.includes(user.blocked.idx)));
            setFilteredUsers(prev => prev.filter(user => !selectedUsers.includes(user.blocked.idx)));
            setSelectedUsers([]);
            console.log(response);
            return { success: true };
        } catch (e) {
            console.error(e);
            return { error: "차단 해제에 실패했습니다." };
        }
    };

    const removeBlockedUser = async (userIdx: number) => {
        try {
            const response = await unblockPostUser(userIdx);
            setBlockedUser(prev => prev.filter(user => user.blocked.idx !== userIdx));
            setFilteredUsers(prev => prev.filter(user => user.blocked.idx !== userIdx));
            console.log(response);
            return { success: true };
        } catch (e) {
            console.error(e);
            return { error: "차단 해제에 실패했습니다." };
        }
    };

    return {
        blockedUser,
        filteredUsers,
        selectedUsers,
        searchNickname,
        handleSearchChange,
        handleSelectUser,
        removeBlockedUsers,
        removeBlockedUser,
        setSelectedUsers
    };
};

export type { BlockedUser };