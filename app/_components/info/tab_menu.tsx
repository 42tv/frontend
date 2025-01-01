import Link from "next/link"

export default function TabMenu() {
    const tabLists = [
        {
            name: 'Tab1',
            link: '/info/coin'
        },
        {
            name: 'Tab2',
            link: '/info/gift'
        },
        {
            name: 'Tab3',
            link: '/info/tab3'
        }
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