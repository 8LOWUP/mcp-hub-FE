"use client";

import { useState, DragEvent, ChangeEvent, useRef } from "react";
import Image from "next/image";
import imageLoader from "@/lib/imageLoader";

interface UploadIconProps {
    onFileSelect?: (file: File | null) => void; // ✅ 파일을 상위 컴포넌트/훅에 전달
}

export default function UploadIcon({ onFileSelect }: UploadIconProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // ✅ 파일 처리
    const handleFile = (file: File) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            alert("이미지 파일만 업로드 가능합니다.");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            alert("10MB 이하만 업로드 가능합니다.");
            return;
        }

        // ✅ 미리보기 URL 생성 (이거 빠져서 안 보였던 거!)
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);

        console.log("이미지 생성됨:", {
            name: file.name,
            type: file.type,
            size: `${Math.round(file.size / 1024)}KB`,
        });

        // 상위 훅에 전달
        if (onFileSelect) onFileSelect(file);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
        const f = e.dataTransfer.files?.[0];
        if (f) handleFile(f);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) handleFile(f);
    };

    const handleRemove = () => {
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = ""; // input 초기화
        if (onFileSelect) onFileSelect(null); // ✅ null 전달
    };

    return (
        <div className="mb-6">
            <label className="block mb-2 text-lg font-semibold text-white">
                Upload Icon
            </label>

            <div
                className={`relative border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer p-6 w-full max-w-lg mx-auto
            ${dragOver ? "border-yellow-400 bg-yellow-50" : "border-gray-600 bg-color-3"}`}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
            >
                {preview ? (
                    <div className="relative">
                        <Image src={preview} alt="Preview" width={120} height={120} className="rounded-md object-contain" loader={imageLoader} />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute -top-1 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600"
                        >
                            ✕
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M3 15a4 4 0 01.88-7.903A5.001 5.001 0 0115 6h1a5 5 0 010 10H5a4 4 0 01-2-7.528" />
                        </svg>
                        <p className="cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <span className="text-yellow-400 font-medium">Upload a file</span> or drag and drop
                        </p>
                        <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                )}

                <input
                    type="file"
                    accept="image/png, image/jpeg, image/gif"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleInputChange}
                />
            </div>
        </div>
    );
}
