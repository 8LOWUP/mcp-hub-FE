"use client";
import { useState, useEffect, forwardRef, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

type UrlStatus = "valid" | "invalid" | null;
interface ServerURLInputProps { defaultValue?: string; onEnter?: () => void; }

const ServerURLInput = forwardRef<HTMLInputElement, ServerURLInputProps>(({ defaultValue, onEnter }, ref) => {
    const [url, setUrl] = useState<string>("");
    const [status, setStatus] = useState<UrlStatus>(null);
    const [message, setMessage] = useState<string>("");

    const urlRegex = /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;

    const checkUrl = (value: string) => {
        setUrl(value);
        if (!value) { setStatus(null); setMessage(""); return; }
        if (urlRegex.test(value)) { setStatus("valid"); setMessage(""); }
        else { setStatus("invalid"); setMessage("⚠️ 유효하지 않은 URL 형식입니다."); }
    };

    // ✨ 프리필
    useEffect(() => {
        if (typeof defaultValue === "string") checkUrl(defaultValue);
    }, [defaultValue]);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") { e.preventDefault(); onEnter?.(); }
    };

    return (
        <motion.div className="mb-6 w-full" animate={status === "invalid" ? { x: [-5, 5, -5, 5, 0] } : {}} transition={{ duration: 0.4 }}>
            <label className="block mb-2 text-lg font-semibold">Server URL</label>
            <div className="relative w-full">
                <input
                    ref={ref}
                    type="url"
                    placeholder="https://play.example.com"
                    value={url}
                    onChange={(e) => checkUrl(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={`w-full px-4 py-3 rounded-lg bg-surface-2 text-white pr-10
            ${status === "invalid" ? "border-2 border-red-500" : "border-contrast focus:outline-none focus:ring-2 focus:ring-yellow-200 transition"} focus:outline-none`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {status === "valid" && <CheckCircle className="text-yellow-400" size={22} />}
                    {status === "invalid" && <XCircle className="text-red-500" size={22} />}
                </div>
            </div>
            {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
        </motion.div>
    );
});

ServerURLInput.displayName = "ServerURLInput";
export default ServerURLInput;
