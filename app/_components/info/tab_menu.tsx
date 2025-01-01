export default function TabMenu() {
    const tabLists = [
        {
            name: 'Tab1',
            link: '/info/tab1'
        },
        {
            name: 'Tab2',
            link: '/info/tab2'
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
                                <a href={tab.link}>{tab.name}</a>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}