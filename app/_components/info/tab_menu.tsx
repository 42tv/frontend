import Link from "next/link"

export default function TabMenu() {
    const tabLists = [
        {
            name: '회원 정보',
            link: '/my/info'
        },
        {
            name: '쪽지함',
            link: '/my/gift'
        },
        {
            name: '결제 내역',
            link: '/my/gift'
        },
        {
            name: '선물 내역',
            link: '/my/gift'
        },
    ]
    return (
        <div className="w-full h-[60px] items-center justify-center text-center mb-4">
            <ul className="flex flex-row h-full items-center text-center justify-center">
                {
                    tabLists.map((tab, index) => {
                        return (
                            <li key={index} className="flex w-[100px] h-full items-center justify-center hover:text-white">
                                <Link href={tab.link}> {tab.name} </Link>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}