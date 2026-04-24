import { useState, useEffect } from "react";
import { getBlockedPostUser, unblockPostUser, unblockPostUsers } from "@/app/_apis/posts";
import { BlockedUser } from "@/app/_types/blacklist";

export const useBlockedUsers = () => {
    const [blockedUser, setBlockedUser] = useState<BlockedUser[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<BlockedUser[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [searchNickname, setSearchNickname] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

        async function fetchPosts() {
            try {
                setIsLoading(true);
                setError(null);
                const response = await getBlockedPostUser();
                if (!active) return;
                setBlockedUser(response);
                setFilteredUsers(response);
            } catch (fetchError) {
                console.error('Failed to fetch blocked users:', fetchError);
                if (!active) return;
                setBlockedUser([]);
                setFilteredUsers([]);
                setError('차단 목록을 불러오는데 실패했습니다.');
            } finally {
                if (active) {
                    setIsLoading(false);
                }
            }
        }
        fetchPosts();

        return () => {
            active = false;
        };
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
        isLoading,
        error,
        handleSearchChange,
        handleSelectUser,
        removeBlockedUsers,
        removeBlockedUser,
        setSelectedUsers
    };
};

export type { BlockedUser };
