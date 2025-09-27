"use client";

import React from "react";

type SidebarToggleButtonProps = {
    isOpen: boolean;
    onClick: () => void;
};

const SidebarToggleButton: React.FC<SidebarToggleButtonProps> = ({ isOpen, onClick }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-expanded={isOpen}
            aria-controls="mobile-sidebar"
            className="inline-flex items-center justify-center rounded-lg border border-contrast px-3 py-2 active:scale-[0.98]"
        >

            <svg width="20" height="20" viewBox="0 0 24 24" className="block">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="ml-2 text-body3">Menu</span>
        </button>
    );
};

export default SidebarToggleButton;
