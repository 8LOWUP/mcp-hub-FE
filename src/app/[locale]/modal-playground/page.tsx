"use client";

import React from "react";
import { PrimaryModal, type PrimaryVariantKey } from "@/components/ui/modal/primary";

export default function ModalPlaygroundPage() {
    const [open, setOpen] = React.useState(false);
    const [variant, setVariant] = React.useState<PrimaryVariantKey>("apiKeyView");

    return (
        <div className="p-6">
            <button
                className="rounded-md bg-accent text-black px-4 py-2"
                onClick={() => setOpen(true)}
            >
                Open PrimaryModal
            </button>

            <PrimaryModal
                isOpen={open}
                onClose={() => setOpen(false)}
                variant={variant}
            />
        </div>
    );
}
