// components/Portal.tsx
"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = { children: React.ReactNode; containerId?: string };

export default function Portal({ children, containerId = "portal-root" }: Props) {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let el = document.getElementById(containerId);
    if (!el) {
      el = document.createElement("div");
      el.id = containerId;
      document.body.appendChild(el);
    }
    setContainer(el);
  }, [containerId]);

  if (!container) return null;
  return createPortal(children, container);
}