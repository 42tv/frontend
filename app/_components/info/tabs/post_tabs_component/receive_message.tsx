import { useState } from "react";
import { LuSettings } from "react-icons/lu";
import { MdDelete } from "react-icons/md";

const posts = [
    { id: 1, content: "123123132", sender: "1", date: "25.03.06 20:33:53", status: "차단" },
    { id: 2, content: "456456456", sender: "2", date: "25.03.06 20:18:36", status: "차단" },
    { id: 3, content: "789789789", sender: "3", date: "25.03.06 15:19:57", status: "차단" },
    { id: 4, content: "101010101", sender: "4", date: "25.03.06 15:19:40", status: "차단" },
    { id: 5, content: "123123132", sender: "1", date: "25.03.06 20:33:53", status: "차단" },
    { id: 6, content: "456456456", sender: "2", date: "25.03.06 20:18:36", status: "차단" },
    { id: 7, content: "789789789", sender: "3", date: "25.03.06 15:19:57", status: "차단" },
    { id: 8, content: "101010101", sender: "4", date: "25.03.06 15:19:40", status: "차단" },
    { id: 9, content: "123123132", sender: "1", date: "25.03.06 20:33:53", status: "차단" },
    { id: 10, content: "456456456", sender: "2", date: "25.03.06 20:18:36", status: "차단" },
    { id: 11, content: "789789789", sender: "3", date: "25.03.06 15:19:57", status: "차단" },
    { id: 12, content: "101010101", sender: "4", date: "25.03.06 15:19:40", status: "차단" }
];

export default function ReceiveMessage() {
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10;
    
    // Calculate the posts to display on current page
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    
    // Calculate total pages
    const totalPages = Math.ceil(posts.length / postsPerPage);
    
    // Page navigation functions
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);;

    return (
        <div className="mb-20">
            <div className="flex flex-row my-5 mx-5 space-x-2">
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
                            <th className="p-2 text-textBase-dark-bold">번호</th>
                            <th className="p-2 text-textBase-dark-bold">내용</th>
                            <th className="p-2 text-textBase-dark-bold">보낸회원</th>
                            <th className="p-2 text-textBase-dark-bold">보낸일</th>
                            <th className="p-2 text-textBase-dark-bold">차단</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPosts.map((post) => (
                          <tr key={post.id} className="border-b border-tableRowBorder dark:border-tableRowBorder-dark text-center align-middle">
                            <td className="p-2 text-textBase">{post.id}</td>
                            <td className="p-2 text-textBase">{post.content}</td>
                            <td className="p-2 text-textBase">{post.sender}</td>
                            <td className="p-2 text-textBase">{post.date}</td>
                            <td className="p-2 text-textBase text-red-500">{post.status}</td>
                          </tr>
                        ))}
                    </tbody>
                </table>
                {/* Pagination Controls */}
                {posts.length > postsPerPage && (
                    <div className="flex justify-center mt-6">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                            <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={`px-3 py-1 mx-1 rounded relative
                                hover:font-semibold ${currentPage === number ? 'font-semibold' : ''}
                                after:content-[''] after:absolute after:h-[2px] after:bg-blue-500 after:left-1/4 after:right-1/4
                                after:bottom-0 after:scale-x-0 ${currentPage === number ? 'after:scale-x-100' : 'hover:after:scale-x-100'}`}
                            >
                                {number}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div className="flex w-full justify-center items-center mt-5">
                <button className="w-[120px] h-[40px] bg-primary rounded-[8px]">
                    쪽지쓰기
                </button>
            </div>
        </div>
    )
}