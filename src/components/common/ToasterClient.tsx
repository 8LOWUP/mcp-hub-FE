"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterClient() {
    return (
        <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{

                style: { background: "var(--tw-bg-opacity, #1f2937)", color: "white" },
                success: { duration: 1800 },
                error: { duration: 2500 },
                loading: { duration: 4000 },
            }}
        />
    );
}
