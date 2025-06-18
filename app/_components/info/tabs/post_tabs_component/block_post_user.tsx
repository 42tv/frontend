import { getBlockedPostUser, unblockPostUser, unblockPostUsers } from "@/app/_apis/posts";
import CheckboxButton from "@/app/_components/utils/custom_ui/checkbox";
import { useEffect, useState } from "react";
import { BiTrash } from "react-icons/bi";

interface BlockedUser {
    id: number;
    blocked: {  // Fixed spelling from "blcoked" to "blocked"
        idx: number;
        user_id: string;
        nickname: string;
        profile_img: string;
    }
    created_at: string;
}

export default function BlockPostUser() {
    const [blockedUser, setBlockedUser] = useState<BlockedUser[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<BlockedUser[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isChecked, setIsChecked] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [searchNickname, setSearchNickname] = useState('');
    const postsPerPage = 10;
    const pageSetSize = 5; // Number of page buttons to show at once
    
    // Calculate the posts to display on current page (use filtered users if search is active)
    const usersToShow = searchNickname ? filteredUsers : blockedUser;
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentUsers = usersToShow.slice(indexOfFirstPost, indexOfLastPost);
    
    // Calculate total pages
    const totalPages = Math.ceil(usersToShow.length / postsPerPage);
    
    // Calculate current page set
    const currentSet = Math.ceil(currentPage / pageSetSize);
    const lastSet = Math.ceil(totalPages / pageSetSize);
    
    // Calculate start and end page numbers for current set
    const startPage = (currentSet - 1) * pageSetSize + 1;
    const endPage = Math.min(currentSet * pageSetSize, totalPages);

    useEffect(() => {
        async function fetchPosts() {
            const response = await getBlockedPostUser()
            setBlockedUser(response)
            setFilteredUsers(response)
            console.log(response)
        }
        fetchPosts();
    }, [])

    async function removeBlockedUsers() {
        try {
            const reponse = await unblockPostUsers(selectedUsers)
            setBlockedUser(prev => prev.filter(user => !selectedUsers.includes(user.blocked.idx)))
            setFilteredUsers(prev => prev.filter(user => !selectedUsers.includes(user.blocked.idx)))
            setSelectedUsers([])
            setIsChecked(false)
            console.log(reponse)
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        catch(e) {
        }

    }

    async function removeBlockedUser(userIdx: number) {
        try {
            const reponse = await unblockPostUser(userIdx)
            setBlockedUser(prev => prev.filter(user => user.blocked.idx !== userIdx))
            setFilteredUsers(prev => prev.filter(user => user.blocked.idx !== userIdx))
            console.log(reponse)
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        catch(e) {
        }
    }

    /**
     * 검색어 변경 시 실시간 검색
     */
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchNickname(value);
        
        if (value.trim() === '') {
            // 검색어가 비어있으면 모든 차단 유저 보여주기
            setFilteredUsers(blockedUser);
        } else {
            // 닉네임 또는 유저ID로 필터링
            const filtered = blockedUser.filter(user => 
                user.blocked.nickname.toLowerCase().includes(value.toLowerCase()) ||
                user.blocked.user_id.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
        // 검색 후 첫 페이지로 이동
        setCurrentPage(1);
    };
    
    // Format the date as xxxx년 xx월 xx일 xx시 xx분
    const formatDateFromString = (dateString: string) => {
        const [datePart, timePart] = dateString.split("T");
        const [year, month, day] = datePart.split("-");
        const [hour, minute] = timePart.split(":");
      
        return `${year}-${month}-${day} ${hour}:${minute}`;
    };

    const handleSelectPost = (userIdx: number) => {
        setSelectedUsers(prev =>
            prev.includes(userIdx)
                ? prev.filter(id => id !== userIdx)
                : [...prev, userIdx]
        );
    };

    // Page navigation functions
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    
    // Navigate to next or previous set of pages
    const navigateToSet = (setNumber: number) => {
        const targetPage = (setNumber - 1) * pageSetSize + 1;
        setCurrentPage(targetPage);
    };

    function handleCheckedMaster() {
        if (!isChecked) {
            setIsChecked(true);
            // Only select posts on the current page instead of all posts
            setSelectedUsers(currentUsers.map(user => user.blocked.idx));
        } else {
            setIsChecked(false);
            setSelectedUsers([]);
        }
    }

    return (
        <div className="mb-20">
            <div className="flex flex-row my-5 mx-5 justify-end">
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
                   {usersToShow.length}
                  </span>
                  <span className="text-textBase">
                    건
                  </span>
                  {searchNickname && (
                    <span className="text-textBase ml-2">
                      (전체 {blockedUser.length}건 중)
                    </span>
                  )}
                </div>
                <table className="w-full border-t border-t-2 border-b border-tableBorder dark:border-tableBorder-dark">
                    <thead>
                        <tr className="border-b border-b border-tableRowBorder dark:border-tableRowBorder-dark text-center align-middle">
                            <th className="p-2 w-[50px] text-textBase-dark-bold">
                                <CheckboxButton handleClick={handleCheckedMaster} isChecked={isChecked}/>
                            </th>
                            <th className="p-2 w-[200px] text-textBase-dark-bold">닉네임</th>
                            <th className="p-2 w-[140px] text-textBase-dark-bold">차단일</th>
                            <th className="p-2 w-[50px] text-textBase-dark-bold">삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((user) => {
                          return (
                            <tr key={user.id} className={`border-b border-tableRowBorder dark:border-tableRowBorder-dark text-center align-middle text-textBase dark:text-textBase-dark overflow-hidden`}>
                              <td className="p-2 text-textBase-dark-bold">
                                <CheckboxButton handleClick={() => handleSelectPost(user.blocked.idx)} isChecked={selectedUsers.includes(user.blocked.idx)}/>
                              </td>
                              <td className={`p-2 `}>
                                <span>
                                    {user.blocked.nickname + "(" + user.blocked.user_id + ")"}
                                </span>
                              </td>
                              <td className={`p-2 `}>{formatDateFromString(user.created_at)}</td>
                              <td className={`p-2 h-[41px] flex justify-center items-center`}>
                                <BiTrash 
                                    className="text-xl cursor-pointer hover:text-error transition-colors"
                                    onClick={() => removeBlockedUser(user.blocked.idx)}
                                />
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                </table>
                {/* Pagination Controls */}
                {blockedUser.length > postsPerPage && (
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
                    onClick={() => removeBlockedUsers()}
                >
                    차단 해제
                </button>
            </div>
        </div>
    )
}