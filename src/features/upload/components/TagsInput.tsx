"use client";

import { useState } from "react";

export default function TagsInput() {
    const tags = ["web server", "memory", "browser", "language", "etc"];
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    const handleTagClick = (tag: string) => {
        setSelectedTag(prev => (prev === tag ? null : tag)); // 클릭하면 선택 토글, 최대 1개
    };

    return (
        <div className="mb-6 w-full">
            <label className="block mb-3 text-lg font-bold">Tags</label>
            <div className="flex flex-wrap gap-4 w-full">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        onClick={() => handleTagClick(tag)}
                        className={`flex-1 min-w-[120px] text-center text-base px-6 py-3 rounded-2xl shadow-md cursor-pointer
              ${selectedTag === tag
                            ? "bg-accent text-black"
                            : "bg-surface-2 hover:bg-accent hover:text-black"
                        }`}
                    >
            {tag}
          </span>
                ))}
            </div>
        </div>
    );
}
