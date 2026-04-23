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
            name: '후원 내역',
            link: '/my/donation'
        },
    ]
    return (
        <div className="w-full h-[60px] items-center justify-center text-center">
            <ul className="flex flex-row items-center text-center justify-center border-border-primary border-b py-4">
                {
                    tabLists.map((tab, index) => {
                        const isActive = pathname === tab.link
                        return (
                            <li key={index} className="flex w-[100px] items-center justify-center">
                                <Link
                                    href={tab.link}
                                    aria-current={isActive ? "page" : undefined}
                                    className={`border-b-2 pb-1 transition-colors ${
                                        isActive
                                            ? "font-bold border-current text-text-primary"
                                            : "border-transparent text-text-secondary hover:border-current hover:text-text-primary"
                                    }`}
                                >
                                    {tab.name}
                                </Link>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}
