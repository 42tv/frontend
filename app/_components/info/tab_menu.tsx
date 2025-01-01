import Link from "next/link"

export default function TabMenu() {
    const tabLists = [
        {
            name: '정보 수정',
            link: '/info/coin'
        },
        {
            name: '선물내역',
            link: '/info/gift'
        },
    ]
    return (
        <div className="w-full h-[60px] items-center justify-center text-center">
            <ul className="flex flex-row h-full items-center text-center ">
                {
                    tabLists.map((tab, index) => {
                        return (
                            <li key={index} className="flex w-[100px] h-full items-center justify-center text-gray-300 hover:text-white">
                                <Link href={tab.link}> {tab.name} </Link>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}