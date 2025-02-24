import Image from "next/image"
import { UserResponse } from "../../utils/interfaces"
import { useState } from "react"

export default function ProfileIcon({ user }: { user: UserResponse }) {
    const [clicked, setClicked] = useState(false);
    return (
        <div className="bg-white rounded-full mr-4">
            {
                user.profile_img ? 
                <Image src={user.profile_img} width={30} height={30} alt="profile icon" /> 
                : 
                <Image src="/icons/anonymouse1.svg" width={30} height={30} alt="profile icon" />
            }
            <div className="absolute top-10 right-0 bg-white rounded-lg shadow-md hidden">
            </div>
        </div>
    )
}