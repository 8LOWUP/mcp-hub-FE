import Image from "next/image";

interface ProfileAvatarProps {
    src?: string; // 이미지 경로, 기본값을 제공
    alt?: string;
    size?: number; // width & height
    className?: string; // 추가 스타일
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
                                                         src = "/catprofile.svg",
                                                         alt = "Profile",
                                                         size = 32,
                                                         className = "",
                                                     }) => {
    return (
        <div
            className={`rounded-full border border-accent-color-1 overflow-hidden w-${size} h-${size} mx-1 ${className}`}
            style={{ width: size, height: size }}
        >
            <Image
                src={src}
                alt={alt}
                width={size}
                height={size}
                className="object-cover w-full h-full"
            />
        </div>
    );
};

export default ProfileAvatar;