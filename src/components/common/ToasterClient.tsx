"use client";

import { Toaster } from "sonner";

export default function ToasterClient() {
    return (
        <Toaster
            position="top-center"
            offset={20}
            toastOptions={{
                style: { background: "var(--tw-bg-opacity, #404248)", color: "white" },
            }}
            duration={2000}
        />
    );
}
