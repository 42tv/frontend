import { deletePost, deletePosts, getPosts, getPostSetting, readPost } from "@/app/_apis/posts";
import BlockAlertComponent from "@/app/_components/modals/block_alert";
import MessageSettingsModal from "@/app/_components/modals/message_settings_modal";
import PostDetail from "@/app/_components/info/tabs/post_tabs_component/post_detail";
import CheckboxButton from "@/app/_components/utils/custom_ui/checkbox";
import SendMessageForm from "@/app/_components/common/SendMessageForm";
import { useEffect, useState } from "react";
import { LuSettings } from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import { openModal, closeAllModals } from "@/app/_components/utils/overlay/overlayHelpers";

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

interface PostSetting {
    fanLevels: FanLevel[];
    minFanLevel: number | null;
}

interface FanLevel {
    id: number;
    name: string;
    min_donation: number;
}

export default function ReceiveMessage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const [postSetting, setPostSetting] = useState<PostSetting>();
    const [currentPage, setCurrentPage] = useState(1);
    const [isChecked, setIsChecked] = useState(false);
    const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
    const [searchNickname, setSearchNickname] = useState('');
    const postsPerPage = 10;
    const pageSetSize = 5; // Number of page buttons to show at once
    
    // Calculate the posts to display on current page (use filtered posts if search is active)
    const postsToShow = searchNickname ? filteredPosts : posts;
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = postsToShow.slice(indexOfFirstPost, indexOfLastPost);
    
    // Calculate total pages
    const totalPages = Math.ceil(postsToShow.length / postsPerPage);
    
    // Calculate current page set
    const currentSet = Math.ceil(currentPage / pageSetSize);
    const lastSet = Math.ceil(totalPages / pageSetSize);
    
    // Calculate start and end page numbers for current set
    const startPage = (currentSet - 1) * pageSetSize + 1;
    const endPage = Math.min(currentSet * pageSetSize, totalPages);

    useEffect(() => {
        async function fetchInitialData() {
            // Fetch posts from API
            const posts = await getPosts();
            setPosts(posts);
            setFilteredPosts(posts);
            const postSetting: PostSetting = await getPostSetting();
            console.log(postSetting);
            setPostSetting(postSetting);
        }
        fetchInitialData();
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

    const handleOpenSettings = () => {
        openModal((close) => <MessageSettingsModal closeModal={close} postSetting={postSetting} setPostSetting={setPostSetting}/>);
    };

    /**
     * 검색어 변경 시 실시간 검색
     */
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchNickname(value);
        
        if (value.trim() === '') {
            // 검색어가 비어있으면 모든 포스트 보여주기
            setFilteredPosts(posts);
        } else {
            // 닉네임으로 필터링
            const filtered = posts.filter(post => 
                post.sender.nickname.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredPosts(filtered);
        }
        // 검색 후 첫 페이지로 이동
        setCurrentPage(1);
    };

    async function changePopupComponent(component: JSX.Element) {
        closeAllModals();
        openModal(component);
    }
    // 차단 창 팝업으로 띄우기
    async function requestBlockUser(blockedIdx: number, blockUserId: string, blockedNickname: string) {
        openModal((close) => 
            BlockAlertComponent({ 
                blockedIdx, 
                blockUserId, 
                blockedNickname, 
                closePopup: close, 
                changePopupComponent 
            })
        );
    }

    async function openModalSendpost() {
        openModal((close) => <SendMessageForm closeModal={close} />);
    }

    async function responsePost(userId: string) {
        openModal((close) => <SendMessageForm initialUserId={userId} closeModal={close} />);
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
     * @param senderIdx 
     */
    async function showSendPostModal(userId: string, nickname: string, message:string, sentAt: string, postId: number, senderIdx: number) {
        try{
            await readPost(postId);
            const updatedPosts = posts.map(post => post.id === postId ? {
                ...post, 
                readAt: new Date().toISOString(),
                is_read: true
            } : post);
            setPosts(updatedPosts);
            setFilteredPosts(filteredPosts.map(post => post.id === postId ? {
                ...post, 
                readAt: new Date().toISOString(),
                is_read: true
            } : post));
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        catch(error) {
        }
        openModal((close) => 
            <PostDetail 
                userId={userId} 
                nickname={nickname} 
                message={message} 
                sentAt={sentAt} 
                postId={postId} 
 
                deleteSinglePost={deleteSinglePost}
                responsePost={responsePost}
                senderIdx={senderIdx}
                closeModal={close}
            />
        );
    }

    /**
     * 여러개의 쪽지 삭제
     */
    async function handleDeletePosts() {
        try {
            // Delete selected posts
            await deletePosts(selectedPosts, 'receive');
            setPosts(posts.filter(post => !selectedPosts.includes(post.id)));
            setFilteredPosts(filteredPosts.filter(post => !selectedPosts.includes(post.id)));
            setSelectedPosts([]);
            setIsChecked(false);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
        }
    }

    async function deleteSinglePost(postId: number) {
        try {
            await deletePost(postId);
            // Then update both posts and filtered posts state
            setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
            setFilteredPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
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
                        border-border-primary dark:border-border-primary-dark hover:bg-bg-hover dark:hover:bg-bg-hover-dark transition-colors"
                        onClick={handleOpenSettings}
                    >
                        <LuSettings className="text-icon-primary dark:text-icon-primary-dark"/>
                        <span className="text-text-primary dark:text-text-primary-dark">설정</span>
                    </button>
                    <button 
                        className="flex flex-row w-[95px] h-[40px] rounded-[8px] items-center space-x-1 justify-center border
                        border-border-primary dark:border-border-primary-dark hover:bg-bg-hover dark:hover:bg-bg-hover-dark transition-colors"
                        onClick={handleDeletePosts}
                    >
                        <MdDelete className="text-icon-primary dark:text-icon-primary-dark"/>
                        <span className="text-text-primary dark:text-text-primary-dark">삭제</span>
                    </button>
                </div>
                <div className="flex space-x-2">
                    <input
                        className="w-[200px] h-[40px] rounded-[8px] border focus:outline-none pl-2
                         border-borderButton1 dark:border-borderButton1-dark 
                         placeholder-textSearch dark:placeholder-textSearch-dark"
                        placeholder="아이디를 입력하세요"
                        value={searchNickname}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>
            <div className="p-4">
                <div className="mb-2">
                  <span className="text-textBase">
                    {searchNickname ? '검색 결과' : '총 게시물'} :
                  </span>
                  <span className="font-semibold">
                   {postsToShow.length}
                  </span>
                  <span className="text-textBase">
                    건
                  </span>
                  {searchNickname && (
                    <span className="text-textBase ml-2">
                      (전체 {posts.length}건 중)
                    </span>
                  )}
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
                              <td className={`p-2 ${post.is_read ? '' : 'text-text-primary dark:text-text-primary-dark'}`}>
                                  <div className="pl-5 mx-auto overflow-hidden">
                                      <button
                                          onClick={() => showSendPostModal(post.sender.userId, post.sender.nickname, post.message, post.sentAt, post.id, post.sender.idx)}
                                          className="truncate block w-full text-left"
                                          title={post.message}
                                      >
                                          {post.message}
                                      </button>
                                  </div>
                              </td>
                              <td className={`p-2 ${post.is_read ? '' : 'text-text-primary dark:text-text-primary-dark'}`}>
                              <button
                                    onClick={() => showSendPostModal(post.sender.userId, post.sender.nickname, post.message, post.sentAt, post.id, post.sender.idx)}>
                                    <span>
                                        {post.sender.nickname}
                                    </span>
                                </button>
                              </td>
                              <td className={`p-2 ${post.is_read ? '' : 'text-text-primary dark:text-text-primary-dark'}`}>{formatDateFromString(post.sentAt)}</td>
                              <td className={`p-2 ${post.is_read ? '' : 'text-text-primary dark:text-text-primary-dark'}`}>{post.is_read ? "읽음" : "안읽음"}</td>
                              <td className={`p-2 text-text-primary dark:text-textBase-dark`}>
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
                {postsToShow.length > postsPerPage && (
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
                                after:content-[''] after:absolute after:h-[2px] after:bg-primary after:left-1/4 after:right-1/4
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
                        text-primary-foreground
                        hover:bg-opacity-80"
                    onClick={() => openModalSendpost()}
                >
                    쪽지 보내기
                </button>
            </div>
        </div>
    )
}