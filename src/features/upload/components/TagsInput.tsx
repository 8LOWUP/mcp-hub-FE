"use client";
import { useState, useEffect, forwardRef } from "react";

interface Props { defaultValue?: string; } // ⬅️ 추가

const TagsInput = forwardRef<HTMLInputElement, Props>(({ defaultValue }, ref) => {
    const tags = ["web server", "memory", "browser", "language", "etc"];
    const [selectedTag, setSelectedTag] = useState<string>("etc");

    // ✨ 프리필
    useEffect(() => {
        if (!defaultValue) return;
        const lower = defaultValue.toLowerCase();
        setSelectedTag(tags.includes(lower) ? lower : "etc");
    }, [defaultValue]);

    const handleTagClick = (tag: string) => { setSelectedTag(tag); };

    return (
        <div className="mb-6 w-full">
            <label className="block mb-3 text-lg font-bold">Category</label>
            <div className="flex flex-wrap gap-4 w-full">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        onClick={() => handleTagClick(tag)}
                        className={`flex-1 min-w-[120px] text-center text-base px-6 py-3 rounded-2xl shadow-md cursor-pointer
              ${selectedTag === tag ? "bg-accent text-black" : "bg-surface-2 hover:bg-accent hover:text-black"}`}
                    >
            {tag}
          </span>
                ))}
            </div>

            {/* 선택값 전달용 hidden */}
            <input type="hidden" name="category" ref={ref} value={selectedTag} readOnly />
        </div>
    );
});

TagsInput.displayName = "TagsInput";
export default TagsInput;
