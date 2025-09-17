// pages or components
"use client"

import { useState } from "react";
import Modal from "./ModalExample";

export default function Example() {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-6">
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-blue-600 text-white px-4 py-2"
      >
        Open modal
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="설정">
        내용이 여기에 들어갑니다.
      </Modal>
    </div>
  );
}