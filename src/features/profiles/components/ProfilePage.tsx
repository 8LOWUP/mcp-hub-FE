// src/features/profiles/components/ProfilePage.tsx
import React from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileCard from "./ProfileCard";
import { DUMMY_MCP_LIST, PROFILE_GRID_COLS } from "../constants";

const ProfilePage: React.FC = () => {
    return (
        <section className="p-6 md:p-8">
            <ProfileHeader
                title="내가 저장한 MCP"
                subtitle="자신이 좋아하거나 즐겨찾는 MCP들을 관리하는 페이지"
            />

            <div className={PROFILE_GRID_COLS}>
                {DUMMY_MCP_LIST.map((item) => (
                    <ProfileCard key={item.id} item={item} />
                ))}
            </div>
        </section>
    );
};

export default ProfilePage;
