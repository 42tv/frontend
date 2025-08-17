import { deletePost, deletePosts, getPosts, getPostSetting, readPost } from "@/app/_apis/posts";
import BlockAlertComponent from "@/app/_components/modals/block_alert";
import MessageSettingsModal from "@/app/_components/modals/message_settings_modal";
import PostDetail from "@/app/_components/info/tabs/post_tabs_component/post_detail";
import SendMessageForm from "@/app/_components/common/SendMessageForm";
import { useEffect, useState } from "react";
import { openModal, closeAllModals } from "@/app/_components/utils/overlay/overlayHelpers";

// Components
import MessageActionButtons from "./components/MessageActionButtons";
import MessageSearchBar from "./components/MessageSearchBar";
import MessageStats from "./components/MessageStats";
import MessageTable from "./components/MessageTable";
import MessagePagination from "./components/MessagePagination";
import SendMessageButton from "./components/SendMessageButton";

// Types
import { Post, PostSetting } from "./types/message";

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
        // 쪽지를 읽음 처리하고 UI 상태 업데이트
        try {
            await readPost(postId);
            // 읽음 처리 성공 시 로컬 상태 업데이트
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
        } catch (error) {
            // 읽음 처리 실패 시에도 모달은 열되, 에러는 로깅만
            console.error('Failed to mark post as read:', error);
        }
        
        // 읽음 처리 성공/실패와 관계없이 모달 열기
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
                <MessageActionButtons 
                    onOpenSettings={handleOpenSettings}
                    onDeletePosts={handleDeletePosts}
                />
                <MessageSearchBar 
                    searchNickname={searchNickname}
                    onSearchChange={handleSearchChange}
                />
            </div>
            <div className="p-4">
                <MessageStats 
                    searchNickname={searchNickname}
                    postsToShowLength={postsToShow.length}
                    totalPostsLength={posts.length}
                />
                <MessageTable 
                    posts={currentPosts}
                    selectedPosts={selectedPosts}
                    isChecked={isChecked}
                    onSelectPost={handleSelectPost}
                    onSelectAll={handleCheckedMaster}
                    onShowPostModal={showSendPostModal}
                    onBlockUser={requestBlockUser}
                    formatDate={formatDateFromString}
                />
                <MessagePagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSetSize={pageSetSize}
                    onPageChange={paginate}
                    onSetNavigate={navigateToSet}
                />
            </div>
            <SendMessageButton onSendMessage={openModalSendpost} />
        </div>
    )
}