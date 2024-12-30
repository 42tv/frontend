import UserProfileImg from "./user_profile_img";

export default function UserInfo() {
    return (
        <div className="flex w-full h-[200px] justify-center pt-[48px]">
            <UserProfileImg 
                profilePath="/icons/7824721.svg" 
                width={100}
                height={100}
            />
        </div>
    )
}