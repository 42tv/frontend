import CheckboxButton from "@/app/_components/utils/custom_ui/checkbox";
import { Post } from "../types/message";

interface MessageTableProps {
  posts: Post[];
  selectedPosts: number[];
  isChecked: boolean;
  onSelectPost: (postId: number) => void;
  onSelectAll: () => void;
  onShowPostModal: (userId: string, nickname: string, message: string, sentAt: string, postId: number, senderIdx: number) => void;
  onBlockUser: (blockedIdx: number, blockUserId: string, blockedNickname: string) => void;
  formatDate: (dateString: string) => string;
}

export default function MessageTable({
  posts,
  selectedPosts,
  isChecked,
  onSelectPost,
  onSelectAll,
  onShowPostModal,
  onBlockUser,
  formatDate
}: MessageTableProps) {
  return (
    <table className="w-full border-t border-t-2 border-b border-tableBorder dark:border-tableBorder-dark">
      <thead>
        <tr className="border-b border-b border-tableRowBorder dark:border-tableRowBorder-dark text-center align-middle">
          <th className="p-2 w-[50px] text-textBase-dark-bold">
            <CheckboxButton handleClick={onSelectAll} isChecked={isChecked}/>
          </th>
          <th className="p-2 w-[400px] text-textBase-dark-bold">내용</th>
          <th className="p-2 w-[200px] text-textBase-dark-bold">보낸 회원</th>
          <th className="p-2 w-[140px] text-textBase-dark-bold">날짜</th>
          <th className="p-2 w-[100px] text-textBase-dark-bold">상태</th>
          <th className="p-2 w-[50px] text-textBase-dark-bold">차단</th>
        </tr>
      </thead>
      <tbody>
        {posts.map((post) => (
          <tr key={post.id} className="border-b border-tableRowBorder dark:border-tableRowBorder-dark text-center align-middle text-textBase dark:text-textBase-dark overflow-hidden">
            <td className="p-2 text-textBase-dark-bold">
              <CheckboxButton handleClick={() => onSelectPost(post.id)} isChecked={selectedPosts.includes(post.id)}/>
            </td>
            <td className={`p-2 ${post.is_read ? '' : 'text-text-primary dark:text-text-primary-dark'}`}>
              <div className="pl-5 mx-auto overflow-hidden">
                <button
                  onClick={() => onShowPostModal(post.sender.userId, post.sender.nickname, post.message, post.sentAt, post.id, post.sender.idx)}
                  className="truncate block w-full text-left"
                  title={post.message}
                >
                  {post.message}
                </button>
              </div>
            </td>
            <td className={`p-2 ${post.is_read ? '' : 'text-text-primary dark:text-text-primary-dark'}`}>
              <button
                onClick={() => onShowPostModal(post.sender.userId, post.sender.nickname, post.message, post.sentAt, post.id, post.sender.idx)}
              >
                <span>{post.sender.nickname}</span>
              </button>
            </td>
            <td className={`p-2 ${post.is_read ? '' : 'text-text-primary dark:text-text-primary-dark'}`}>
              {formatDate(post.sentAt)}
            </td>
            <td className={`p-2 ${post.is_read ? '' : 'text-text-primary dark:text-text-primary-dark'}`}>
              {post.is_read ? "읽음" : "안읽음"}
            </td>
            <td className="p-2 text-text-primary dark:text-textBase-dark">
              <button
                onClick={() => onBlockUser(post.sender.idx, post.sender.userId, post.sender.nickname)}
              >
                차단
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}