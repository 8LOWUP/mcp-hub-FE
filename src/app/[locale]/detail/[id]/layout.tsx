// src/app/[locale]/detail/[id]/layout.tsx
"use client";

import QueryProvider from "@/providers/QueryProvider";

export default function DetailLayout({ children }: { children: React.ReactNode }) {
    return (
        <QueryProvider>
            <div className="flex flex-col min-h-screen">
                <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8">
                    {children}
                </div>
            </div>
        </QueryProvider>
    );
}

