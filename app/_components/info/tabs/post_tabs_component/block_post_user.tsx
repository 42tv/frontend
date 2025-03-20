import { getBlockedPostUser } from "@/app/_apis/posts";
import CheckboxButton from "@/app/_components/utils/custom_ui/checkbox";
import { useEffect, useState } from "react";

interface BlockedUser {
    id: number;
    blcoked: {
        idx: number;
        nickname: string;
        profile_img: string;
    }
}

export default function BlockPostUser() {
    const [blockedUser, setblockedUser] = useState<BlockedUser[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isChecked, setIsChecked] = useState(false);
    const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
    const postsPerPage = 10;
    const pageSetSize = 5; // Number of page buttons to show at once
    
    // Calculate the posts to display on current page
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = blockedUser.slice(indexOfFirstPost, indexOfLastPost);
    
    // Calculate total pages
    const totalPages = Math.ceil(blockedUser.length / postsPerPage);
    
    // Calculate current page set
    const currentSet = Math.ceil(currentPage / pageSetSize);
    const lastSet = Math.ceil(totalPages / pageSetSize);
    
    // Calculate start and end page numbers for current set
    const startPage = (currentSet - 1) * pageSetSize + 1;
    const endPage = Math.min(currentSet * pageSetSize, totalPages);

    useEffect(() => {
        async function fetchPosts() {
            const response = await getBlockedPostUser()
            console.log(response)
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
            setSelectedPosts(currentPosts.map(post => post.id));
        } else {
            setIsChecked(false);
            setSelectedPosts([]);
        }
    }

    return (
        <div className="mb-20">
            <div className="p-4">
                <div className="mb-2">
                  <span className="text-textBase">
                    총 게시물 :
                  </span>
                  <span className="font-semibold">
                   {blockedUser.length}
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
                            <th className="p-2 w-[200px] text-textBase-dark-bold">닉네임</th>
                            <th className="p-2 w-[140px] text-textBase-dark-bold">차단일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPosts.map((blockedUser) => {
                          return (
                            <tr key={blockedUser.id} className={`border-b border-tableRowBorder dark:border-tableRowBorder-dark text-center align-middle text-textBase dark:text-textBase-dark overflow-hidden`}>
                              <td className="p-2 text-textBase-dark-bold">
                                {/* <CheckboxButton handleClick={() => handleSelectPost(blockedUser.id)} isChecked={selectedPosts.includes(post.id)}/> */}
                              </td>
                              <td className={`p-2 `}>
                                  <div className="max-w-[400px] mx-auto overflow-hidden">
                                      {/* <button
                                          className="truncate block w-full text-left"
                                          title={blockedUser.blcoked}
                                      >
                                          {blockedUser.message}
                                      </button> */}
                                  </div>
                              </td>
                              <td className={`p-2 `}>
                              <button
                              >
                                    <span>
                                        {/* {blockedUser.recipient.nickname} */}
                                    </span>
                                </button>
                              </td>
                              {/* <td className={`p-2 `}>{formatDateFromString(blockedUser.blcoked.)}</td>
                              <td className={`p-2 `}>{blockedUser.is_read ? "읽음" : "안읽음"}</td> */}
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