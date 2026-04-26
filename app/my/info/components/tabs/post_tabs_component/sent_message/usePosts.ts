import { deletePost, deletePosts, getSendPosts } from "@/app/_apis/posts";
import { useState, useEffect } from "react";

interface Post {
    id: number;
    message: string;
    sender: {
        idx: number;
        userId: string;
        nickname: string;
    };
    recipient: {
        idx: number;
        userId: string;
        nickname: string;
    };
    is_read: boolean;
    sentAt: string;
    readAt: string;
}

export const usePosts = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
    const [searchNickname, setSearchNickname] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

        async function fetchPosts() {
            try {
                setIsLoading(true);
                setError(null);
                const response = await getSendPosts();
                if (!active) return;
                setPosts(response);
                setFilteredPosts(response);
            } catch (fetchError) {
                console.error('Failed to fetch sent posts:', fetchError);
                if (!active) return;
                setPosts([]);
                setFilteredPosts([]);
                setError('보낸 메세지를 불러오는데 실패했습니다.');
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
            setFilteredPosts(posts);
        } else {
            const filtered = posts.filter(post => 
                post.recipient.nickname.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredPosts(filtered);
        }
    };

    const handleSelectPost = (postId: number) => {
        setSelectedPosts(prev =>
            prev.includes(postId)
                ? prev.filter(id => id !== postId)
                : [...prev, postId]
        );
    };

    const handleDeletePosts = async () => {
        try {
            await deletePosts(selectedPosts, 'sent');
            setPosts(posts.filter(post => !selectedPosts.includes(post.id)));
            setFilteredPosts(filteredPosts.filter(post => !selectedPosts.includes(post.id)));
            setSelectedPosts([]);
        } catch (error) {
            console.error('Error deleting posts:', error);
        }
    };

    const deleteSinglePost = async (postId: number) => {
        try {
            await deletePost(postId);
            setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
            setFilteredPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
        } catch (error) {
            console.log(error);
        }
    };

    return {
        posts,
        filteredPosts,
        selectedPosts,
        searchNickname,
        isLoading,
        error,
        handleSearchChange,
        handleSelectPost,
        handleDeletePosts,
        deleteSinglePost,
        setSelectedPosts
    };
};

export type { Post };
