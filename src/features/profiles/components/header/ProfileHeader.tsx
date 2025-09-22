// src/features/profiles/components/ProfileHeader.tsx
import React from "react";

type ProfileHeaderProps = {
    title: string;
    subtitle?: string;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ title, subtitle }) => {
    return (
        <header className="mb-8">
            <h1 className="text-title2">{title}</h1>
            {subtitle && <p className="text-body3 text-secondary mt-1">{subtitle}</p>}
        </header>
    );
};

export default ProfileHeader;
