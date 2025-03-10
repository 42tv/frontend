import PostDetail from "@/app/_components/modals/post_detail";
import useModalStore from "@/app/_components/utils/store/modalStore";
import { useState } from "react";
import { LuSettings } from "react-icons/lu";
import { MdDelete } from "react-icons/md";

const posts = [
    {
      "id": 9,
      "message": "대충 쪽지 내용1",
      "sender": {
        "idx": 5,
        "userId": "3333",
        "nickname": "3333"
      },
      "recipient": {
        "idx": 4,
        "userId": "1234",
        "nickname": "1234"
      },
      "sentAt": "2025-03-10T15:12:33.468Z",
      "readAt": "2025-03-10T15:12:33.468Z"
    },
    {
      "id": 10,
      "message": "대충 쪽지 내용12",
      "sender": {
        "idx": 5,
        "userId": "3333",
        "nickname": "3333"
      },
      "recipient": {
        "idx": 4,
        "userId": "1234",
        "nickname": "1234"
      },
      "sentAt": "2025-03-10T15:12:35.952Z",
      "readAt": null
    },
    {
      "id": 11,
      "message": "대충 쪽지 내용123",
      "sender": {
        "idx": 5,
        "userId": "3333",
        "nickname": "3333"
      },
      "recipient": {
        "idx": 4,
        "userId": "1234",
        "nickname": "1234"
      },
      "sentAt": "2025-03-10T15:12:37.378Z",
      "readAt": null
    },
    {
      "id": 12,
      "message": "대충 쪽지 내용1234",
      "sender": {
        "idx": 5,
        "userId": "3333",
        "nickname": "3333"
      },
      "recipient": {
        "idx": 4,
        "userId": "1234",
        "nickname": "1234"
      },
      "sentAt": "2025-03-10T15:12:39.143Z",
      "readAt": null
    }
  ]

export default function ReceiveMessage() {
    const { openModal } = useModalStore();
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
    const postsPerPage = 10;
    const pageSetSize = 5; // Number of page buttons to show at once
    
    // Format the date as xxxx년 xx월 xx일 xx시 xx분
    const formatDateFromString = (dateString: string) => {
        const [datePart, timePart] = dateString.split("T");
        const [year, month, day] = datePart.split("-");
        const [hour, minute] = timePart.split(":");
      
        return `${year}-${month}-${day} ${hour}:${minute}`;
    };

    const handleSelectPost = (postId: number) => {
        setSelectedPosts(prev =>
            prev.includes(postId)
                ? prev.filter(id => id !== postId)
                : [...prev, postId]
        );
    };

    
    // Calculate the posts to display on current page
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    
    // Calculate total pages
    const totalPages = Math.ceil(posts.length / postsPerPage);
    
    // Calculate current page set
    const currentSet = Math.ceil(currentPage / pageSetSize);
    const lastSet = Math.ceil(totalPages / pageSetSize);
    
    // Calculate start and end page numbers for current set
    const startPage = (currentSet - 1) * pageSetSize + 1;
    const endPage = Math.min(currentSet * pageSetSize, totalPages);
    
    // Page navigation functions
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    
    // Navigate to next or previous set of pages
    const navigateToSet = (setNumber: number) => {
        const targetPage = (setNumber - 1) * pageSetSize + 1;
        setCurrentPage(targetPage);
    };

    function showSendPostModal(userId: string, nickname: string, message:string, sentAt: string) {
        openModal(<PostDetail userId={userId} nickname={nickname} message={message} sentAt={sentAt} />);
    }

    return (
        <div className="mb-20">
            <div className="flex flex-row my-5 mx-5 justify-between">
                <div className="flex space-x-2">
                    <button 
                        className="flex flex-row w-[95px] h-[40px] rounded-[8px] items-center space-x-1 justify-center border
                        border-borderButton1 dark:border-borderButton1-dark hover:bg-colorFg01">
                        <LuSettings className="text-iconBg-dark"/>
                        <span>설정</span>
                    </button>
                    <button 
                        className="flex flex-row w-[95px] h-[40px] rounded-[8px] items-center space-x-1 justify-center border
                        border-borderButton1 dark:border-borderButton1-dark hover:bg-colorFg01">
                        <MdDelete className="text-iconBg-dark"/>
                        <span>삭제</span>
                    </button>
                </div>
                <div className="flex space-x-2">
                    <input
                        className="w-[200px] h-[40px] rounded-[8px] border focus:outline-none pl-2
                         border-borderButton1 dark:border-borderButton1-dark 
                         placeholder-textSearch dark:placeholder-textSearch-dark"
                        placeholder="검색어를 입력하세요"
                    />
                    <button 
                        className="w-[80px] h-[40px] rounded-[8px] bg-color-darkBlue text-white hover:bg-opacity-80"
                    >
                        검색
                    </button>
                </div>
            </div>
            <div className="p-4">
                <div className="mb-2">
                  <span className="text-textBase">
                    총 게시물 :
                  </span>
                  <span className="font-semibold">
                   {posts.length}
                  </span>
                  <span className="text-textBase">
                    건
                  </span>
                </div>
                <table className="w-full border-t border-t-2 border-b border-tableBorder dark:border-tableBorder-dark">
                    <thead>
                        <tr className="border-b border-b border-tableRowBorder dark:border-tableRowBorder-dark text-center align-middle">
                            <th className="p-2 text-textBase-dark-bold">
                                <input 
                                    type="checkbox" 
                                    checked={selectedPosts.length === posts.length} 
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedPosts(posts.map(post => post.id));
                                        } else {
                                            setSelectedPosts([]);
                                        }
                                    }} 
                                />
                            </th>
                            <th className="p-2 text-textBase-dark-bold">내용</th>
                            <th className="p-2 text-textBase-dark-bold">보낸회원</th>
                            <th className="p-2 text-textBase-dark-bold">보낸일</th>
                            <th className="p-2 text-textBase-dark-bold">상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPosts.map((post) => {
                          const isUnread = post.readAt === null;
                          return (
                            <tr key={post.id} className={`border-b border-tableRowBorder dark:border-tableRowBorder-dark text-center align-middle ${isUnread ? 'font-semibold' : ''}`}>
                              <td>
                                <input 
                                      type="checkbox" 
                                      checked={selectedPosts.includes(post.id)} 
                                      onChange={(e) => {
                                          e.stopPropagation();
                                          handleSelectPost(post.id);
                                      }} 
                                />
                              </td>
                              <td className={`flex text-center p-2 ${isUnread ? 'text-textBase-dark-bold' : 'text-textBase'}`}>
                                <button
                                    onClick={() => showSendPostModal(post.sender.userId, post.sender.nickname, post.message, post.sentAt)}>
                                    <span>
                                        {post.message}
                                    </span>
                                </button>
                              </td>
                              <td className={`p-2 ${isUnread ? 'text-textBase-dark-bold' : 'text-textBase'}`}>
                              <button
                                    onClick={() => showSendPostModal(post.sender.userId, post.sender.nickname, post.message, post.sentAt)}>
                                    <span>
                                        {post.sender.nickname}
                                    </span>
                                </button>
                              </td>
                              <td className={`p-2 ${isUnread ? 'text-textBase-dark-bold' : 'text-textBase'}`}>{formatDateFromString(post.sentAt)}</td>
                              <td className={`p-2 ${isUnread ? 'text-textBase-dark-bold' : 'text-textBase'}`}>{post.readAt ? "읽음" : "안읽음"}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                </table>
                {/* Pagination Controls */}
                {posts.length > postsPerPage && (
                    <div className="flex justify-center mt-6">
                        {/* Previous set button */}
                        {currentSet > 1 && (
                            <button
                                onClick={() => navigateToSet(currentSet - 1)}
                                className="mx-3 py-1 rounded"
                            >
                                prev
                            </button>
                        )}
                        
                        {/* Page numbers */}
                        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(number => (
                            <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={`px-3 py-1 mx-1 rounded relative
                                ${currentPage === number ? 'font-semibold' : ''}
                                after:content-[''] after:absolute after:h-[2px] after:bg-blue-500 after:left-1/4 after:right-1/4
                                after:bottom-0 after:scale-x-0 ${currentPage === number ? 'after:scale-x-100' : 'hover:after:scale-x-100'}`}
                            >
                                {number}
                            </button>
                        ))}
                        
                        {/* Next set button */}
                        {currentSet < lastSet && (
                            <button
                                onClick={() => navigateToSet(currentSet + 1)}
                                className="mx-3 py-1 rounded"
                            >
                                next
                            </button>
                        )}
                    </div>
                )}
            </div>
            <div className="flex w-full justify-center items-center mt-5">
                <button 
                    className="w-[120px] h-[40px] rounded-[15px]
                        bg-color-darkBlue 
                        text-white
                        hover:bg-opacity-80"
                >
                    쪽지 보내기
                </button>
            </div>
        </div>
    )
}