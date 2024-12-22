'use client';

import Image from 'next/image';

interface AvatarProps {
    src?: string | null | undefined;
    large?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ 
    src,
    large,
}) => {
    return (
        <Image
            className="rounded-full"
            height={large ? 50 : 30}
            width={large ? 50 : 30}
            alt="User Avatar"
            src={src || "/images/placeholder.jpg"}
        />
    );
}

export default Avatar;