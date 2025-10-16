"use client";

import * as React from "react";
import Image from "next/image";
import imageLoader from "@/lib/imageLoader";

export default function McpThumb({
                                     src,
                                     alt,
                                     size = 32,
                                 }: {
    src?: string | null;
    alt: string;
    size?: number;
}) {
    const [broken, setBroken] = React.useState(false);

    const safeSrc = !src || broken ? "/mcp-fallback.png" : src;

    return (
        <Image
            src={safeSrc}
            alt={alt}
            width={size}
            height={size}
            className="object-cover w-8 h-8"
            loader={imageLoader}
            unoptimized
            onError={() => setBroken(true)}
        />
    );
}
