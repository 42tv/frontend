import Image from 'next/image'

export default function UserProfileImg({profilePath, width, height} : {profilePath: string, width: number, height: number}) {
    return (
        <div className="flex-col w-full h-full justify-center items-center">
            <div 
                className="flex items-center justify-center rounded-full overflow-hidden border-white border-[1px]" 
                style={{ width: `${width}px`, height: `${height}px`, backgroundColor: 'white' }}
            >
                <Image
                    src={profilePath}
                    alt="Picture of the author"
                    width={width}
                    height={height}
                />
            </div>
            {/* <div className='flex-col w-full h-[48px] bg-blue-400 justify-center items-center text-center'>
                <div>닉네임</div>
                Coin 100 Message 100
            </div> */}


        </div>
    )
}