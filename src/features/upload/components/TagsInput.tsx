"use client";

import { forwardRef, useState } from "react";

const TagsInput = forwardRef<HTMLInputElement>((_, ref) => {
    const tags = ["web server", "memory", "browser", "language", "etc"];
    const [selectedTag, setSelectedTag] = useState<string>("etc"); // ✅ 기본값 etc

    const handleTagClick = (tag: string) => {
        setSelectedTag(tag);
        console.log("📌 선택된 카테고리:", tag);
    };

    return (
        <div className="mb-6 w-full">
            <label className="block mb-3 text-lg font-bold">Category</label>
            <div className="flex flex-wrap gap-4 w-full">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        onClick={() => handleTagClick(tag)}
                        className={`flex-1 min-w-[120px] text-center text-base px-6 py-3 rounded-2xl shadow-md cursor-pointer
              ${
                            selectedTag === tag
                                ? "bg-accent text-black"
                                : "bg-surface-2 hover:bg-accent hover:text-black"
                        }`}
                    >
                        {tag}
                    </span>
                ))}
            </div>

            {/* ✅ ref를 hidden input에 직접 연결 */}
            <input
                type="hidden"
                name="category"
                ref={ref}
                value={selectedTag}
                readOnly
            />
        </div>
    );
});

TagsInput.displayName = "TagsInput";
export default TagsInput;
