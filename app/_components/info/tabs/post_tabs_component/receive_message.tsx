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
        <div>
            <div className="flex flex-row my-5 mx-5 space-x-2">
                <button 
                    className="flex flex-row w-[95px] h-[40px] rounded-[8px] items-center space-x-1 justify-center border
                    border-borderLightButton1 dark:border-borderDarkButton1 hover:bg-colorFg01">
                    <LuSettings className="text-iconDarkBg"/>
                    <span>설정</span>
                </button>
                <button 
                    className="flex flex-row w-[95px] h-[40px] rounded-[8px] items-center space-x-1 justify-center border
                    border-borderLightButton1 dark:border-borderDarkButton1 hover:bg-colorFg01">
                    <MdDelete className="text-iconDarkBg"/>
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
                  <span className="text-colorFg01">
                    건
                  </span>
                </div>
                <table className="w-full border-t border-b border-gray-300">
                    <thead>
                        <tr className="border-b border-borderDarkButton1 text-center align-middle">
                            <th className="relative p-2">번호</th>
                            <th className="p-2">내용</th>
                            <th className="p-2">보낸회원</th>
                            <th className="p-2">보낸일</th>
                            <th className="p-2">차단</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPosts.map((post) => (
                          <tr key={post.id} className="border-b border-borderDarkButton1 text-center align-middle">
                            <td className="p-2">{post.id}</td>
                            <td className="p-2">{post.content}</td>
                            <td className="p-2">{post.sender}</td>
                            <td className="p-2">{post.date}</td>
                            <td className="p-2 text-red-500">{post.status}</td>
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
                                className={`px-3 py-1 mx-1 rounded dark:border-borderDarkButton1 relative
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
        </div>
    )
}