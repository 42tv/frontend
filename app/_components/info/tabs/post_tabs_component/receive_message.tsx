import { deletePost, deletePosts, getPosts, readPost } from "@/app/_apis/posts";
import BlockAlertComponent from "@/app/_components/modals/block_alert";
import PostDetail from "@/app/_components/info/tabs/post_tabs_component/post_detail";
import CheckboxButton from "@/app/_components/utils/custom_ui/checkbox";
import useModalStore from "@/app/_components/utils/store/modalStore";
import popupModalStore from "@/app/_components/utils/store/popupModalStore";
import SendPost from "./send_post";
import { useEffect, useState } from "react";
import { LuSettings } from "react-icons/lu";
import { MdDelete } from "react-icons/md";

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
    }
    is_read: boolean;
    sentAt: string;
    readAt: string;
}

export default function ReceiveMessage() {
    const { openModal, closeModal } = useModalStore();
    const { openPopup, closePopup } = popupModalStore();
    const [posts, setPosts] = useState<Post[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isChecked, setIsChecked] = useState(false);
    const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
    const postsPerPage = 10;
    const pageSetSize = 5; // Number of page buttons to show at once
    
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

    useEffect(() => {
        async function fetchPosts() {
            // Fetch posts from API
            const response = await getPosts();
            setPosts(response);
        }
        fetchPosts();
    }, [])
    
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

    async function changePopupComponent(compoent: JSX.Element) {
        closePopup();
        openPopup(compoent);
    }
    // 차단 창 팝업으로 띄우기
    async function requestBlockUser(blockedIdx: number, blockUserId: string, blockedNickname: string) {
        openPopup(BlockAlertComponent({ blockedIdx, blockUserId, blockedNickname, closePopup, changePopupComponent }));
    }

    async function openModalSendpost() {
        openModal(<SendPost close={closeModal}/>);
    }

    async function responsePost(userId: string) {
        closeModal();
        openModal(<SendPost close={closeModal} userId={userId}/>);
    }

    // Page navigation functions
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    
    // Navigate to next or previous set of pages
    const navigateToSet = (setNumber: number) => {
        const targetPage = (setNumber - 1) * pageSetSize + 1;
        setCurrentPage(targetPage);
    };

    /**
     * 쪽지 자세히 보기
     * @param userId 
     * @param nickname 
     * @param message 
     * @param sentAt 
     * @param postId 
     */
    async function showSendPostModal(userId: string, nickname: string, message:string, sentAt: string, postId: number) {
        try{
            await readPost(postId);
            setPosts(posts.map(post => post.id === postId ? {
                ...post, 
                readAt: new Date().toISOString(),
                is_read: true
            } : post));
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        catch(error) {
        }
        openModal(
            <PostDetail 
                userId={userId} 
                nickname={nickname} 
                message={message} 
                sentAt={sentAt} 
                postId={postId} 
                closeModal={closeModal} 
                deleteSinglePost={deleteSinglePost}
                responsePost={responsePost}
        />);
    }

    /**
     * 여러개의 쪽지 삭제
     */
    async function handleDeletePosts() {
        try {
            // Delete selected posts
            await deletePosts(selectedPosts);
            setPosts(posts.filter(post => !selectedPosts.includes(post.id)));
            setSelectedPosts([]);
            setIsChecked(false);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
        }
    }

    async function deleteSinglePost(postId: number) {
        try {
            await deletePost(postId);
            // Then update the state
            setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            console.log(error);
        }
    }

    function handleCheckedMaster() {
        if (!isChecked) {
            setIsChecked(true);
            // Only select posts on the current page instead of all posts
            setSelectedPosts(currentPosts.map(post => post.id));
        } else {
            setIsChecked(false);
            setSelectedPosts([]);
        }
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
                        border-borderButton1 dark:border-borderButton1-dark hover:bg-colorFg01"
                        onClick={handleDeletePosts}
                    >
                        <MdDelete className="text-iconBg-dark"/>
                        <span>삭제</span>
                    </button>
                </div>
                <div className="flex space-x-2">
                    <input
                        className="w-[200px] h-[40px] rounded-[8px] border focus:outline-none pl-2
                         border-borderButton1 dark:border-borderButton1-dark 
                         placeholder-textSearch dark:placeholder-textSearch-dark"
                        placeholder="닉네임을 입력하세요"
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
                            <th className="p-2 w-[50px] text-textBase-dark-bold">
                                <CheckboxButton handleClick={handleCheckedMaster} isChecked={isChecked}/>
                            </th>
                            <th className="p-2 w-[400px] text-textBase-dark-bold">내용</th>
                            <th className="p-2 w-[200px] text-textBase-dark-bold">보낸 회원</th>
                            <th className="p-2 w-[140px] text-textBase-dark-bold">날짜</th>
                            <th className="p-2 w-[100px] text-textBase-dark-bold">상태</th>
                            <th className="p-2 w-[50px] text-textBase-dark-bold">차단</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPosts.map((post) => {
                          return (
                            <tr key={post.id} className={`border-b border-tableRowBorder dark:border-tableRowBorder-dark text-center align-middle text-textBase dark:text-textBase-dark overflow-hidden`}>
                              <td className="p-2 text-textBase-dark-bold">
                                <CheckboxButton handleClick={() => handleSelectPost(post.id)} isChecked={selectedPosts.includes(post.id)}/>
                              </td>
                              <td className={`p-2 ${post.is_read ? '' : 'text-black dark:text-white'}`}>
                                  <div className="pl-5 mx-auto overflow-hidden">
                                      <button
                                          onClick={() => showSendPostModal(post.sender.userId, post.sender.nickname, post.message, post.sentAt, post.id)}
                                          className="truncate block w-full text-left"
                                          title={post.message}
                                      >
                                          {post.message}
                                      </button>
                                  </div>
                              </td>
                              <td className={`p-2 ${post.is_read ? '' : 'text-black dark:text-white'}`}>
                              <button
                                    onClick={() => showSendPostModal(post.sender.userId, post.sender.nickname, post.message, post.sentAt, post.id)}>
                                    <span>
                                        {post.sender.nickname}
                                    </span>
                                </button>
                              </td>
                              <td className={`p-2 ${post.is_read ? '' : 'text-black dark:text-white'}`}>{formatDateFromString(post.sentAt)}</td>
                              <td className={`p-2 ${post.is_read ? '' : 'text-black dark:text-white'}`}>{post.is_read ? "읽음" : "안읽음"}</td>
                              <td className={`p-2 text-black dark:text-textBase-dark`}>
                                <button
                                  onClick={() => requestBlockUser(post.sender.idx, post.sender.userId, post.sender.nickname)}
                                >
                                    차단
                                </button>
                              </td>
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
                    onClick={() => openModalSendpost()}
                >
                    쪽지 보내기
                </button>
            </div>
        </div>
    )
}