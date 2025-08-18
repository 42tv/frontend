import React from 'react';
import CheckboxButton from "@/app/_components/utils/custom_ui/checkbox";
import { Post } from './usePosts';

interface PostsTableProps {
    posts: Post[];
    selectedPosts: number[];
    isAllSelected: boolean;
    onSelectPost: (postId: number) => void;
    onSelectAll: () => void;
    onShowPostModal: (userId: string, nickname: string, message: string, sentAt: string, postId: number, senderIdx: number) => void;
}

const PostsTable: React.FC<PostsTableProps> = ({
    posts,
    selectedPosts,
    isAllSelected,
    onSelectPost,
    onSelectAll,
    onShowPostModal
}) => {
    const formatDateFromString = (dateString: string) => {
        const [datePart, timePart] = dateString.split("T");
        const [year, month, day] = datePart.split("-");
        const [hour, minute] = timePart.split(":");
      
        return `${year}-${month}-${day} ${hour}:${minute}`;
    };

    return (
        <table className="w-full border-t border-t-2 border-b border-tableBorder dark:border-tableBorder-dark">
            <thead>
                <tr className="border-b border-b border-tableRowBorder dark:border-tableRowBorder-dark text-center align-middle">
                    <th className="p-2 w-[50px] text-textBase-dark-bold">
                        <CheckboxButton handleClick={onSelectAll} isChecked={isAllSelected}/>
                    </th>
                    <th className="p-2 w-[400px] text-textBase-dark-bold">내용</th>
                    <th className="p-2 w-[200px] text-textBase-dark-bold">닉네임</th>
                    <th className="p-2 w-[140px] text-textBase-dark-bold">날짜</th>
                    <th className="p-2 w-[100px] text-textBase-dark-bold">상태</th>
                </tr>
            </thead>
            <tbody>
                {posts.map((post) => {
                    return (
                        <tr key={post.id} className={`border-b border-tableRowBorder dark:border-tableRowBorder-dark text-center align-middle text-textBase dark:text-textBase-dark overflow-hidden`}>
                            <td className="p-2 text-textBase-dark-bold">
                                <CheckboxButton 
                                    handleClick={() => onSelectPost(post.id)} 
                                    isChecked={selectedPosts.includes(post.id)}
                                />
                            </td>
                            <td className={`p-2 `}>
                                <div className="max-w-[400px] mx-auto overflow-hidden">
                                    <button
                                        onClick={() => onShowPostModal(
                                            post.recipient.userId, 
                                            post.recipient.nickname, 
                                            post.message, 
                                            post.sentAt, 
                                            post.id, 
                                            post.sender.idx
                                        )}
                                        className="truncate block w-full text-left"
                                        title={post.message}
                                    >
                                        {post.message}
                                    </button>
                                </div>
                            </td>
                            <td className={`p-2 `}>
                                <button
                                    onClick={() => onShowPostModal(
                                        post.recipient.userId, 
                                        post.recipient.nickname, 
                                        post.message, 
                                        post.sentAt, 
                                        post.id, 
                                        post.sender.idx
                                    )}
                                >
                                    <span>
                                        {post.recipient.nickname}
                                    </span>
                                </button>
                            </td>
                            <td className={`p-2 `}>{formatDateFromString(post.sentAt)}</td>
                            <td className={`p-2 `}>{post.is_read ? "읽음" : "안읽음"}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default PostsTable;