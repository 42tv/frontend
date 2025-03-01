import Image from 'next/image'


export default function UserProfileImg({profilePath, width, height} : {profilePath: string, width: number, height: number}) {
    return (
        <div className="flex w-full h-full justify-center items-center">
            <div 
                className="flex items-center justify-center rounded-full overflow-hidden border-white border-[1px]" 
                style={{ width: `${width}px`, height: `${height}px`, backgroundColor: 'white' }}
            >
                <Image
                    src={profilePath}
                    alt="Picture of the author"
                    width={width}
                    height={height}
                    priority={true}
                />
            </div>
        </div>
    )
}