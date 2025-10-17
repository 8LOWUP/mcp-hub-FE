"use client";

import { Toaster } from "sonner";

export default function ToasterClient() {
    return (
        <Toaster
            position="top-center"
            reverseOrder={false}
            offset={20}
            toastOptions={{
                style: { background: "var(--tw-bg-opacity, #404248)", color: "white" },
                success: { duration: 1800 },
                error: { duration: 2500 },
                loading: { duration: 4000 },
                warning: { duration: 5000 }, // warning 타입 duration 추가
            }}
        />
    );
}
