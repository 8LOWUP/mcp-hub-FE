// src/features/profiles/components/ProfileSidebarPlaceholder.tsx
import React from "react";

const ProfileSidebarPlaceholder: React.FC = () => {
    return (
        <div className="p-4 space-y-2">
            <div className="text-sm text-gray-400">Stored MCP</div>
            <div className="text-sm text-gray-400">Deployed MCP</div>
            <div className="text-sm text-gray-400">Support</div>

            <div className="mt-6 space-y-2">
                <button className="w-full rounded-md bg-[#222] py-2 text-sm">Log Out</button>
                <button className="w-full rounded-md bg-[#222] py-2 text-sm">Delete Account</button>
            </div>
        </div>
    );
};

export default ProfileSidebarPlaceholder;
