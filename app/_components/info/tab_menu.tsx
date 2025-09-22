import Link from "next/link"
import { usePathname } from "next/navigation"

export default function TabMenu() {
    const pathname = usePathname()
    
    const tabLists = [
        {
            name: '회원 정보',
            link: '/my/info'
        },
        {
            name: '쪽지함',
            link: '/my/post'
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
        <div className="w-full h-[60px] items-center justify-center text-center">
            <ul className="flex flex-row items-center text-center justify-center border-border-primary border-b py-4">
                {
                    tabLists.map((tab, index) => {
                        const isActive = pathname === tab.link
                        return (
                            <li key={index} className="flex w-[100px] items-center justify-center text-text-secondary">
                                <Link href={tab.link} className={`${isActive ? "font-bold text-accent border-b-2 border-accent pb-1" : "hover:text-accent"} transition-colors`}> {tab.name} </Link>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}