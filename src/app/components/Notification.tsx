"use client";

import React from "react";

interface NotificationProps {
  message: string | null;
}

export default function Notification({ message }: NotificationProps) {
  if (!message) return null;

  return (
    <div className="fixed top-5 right-5 bg-[#10B981] text-white py-3 px-5 rounded-lg font-[Poppins] text-sm font-normal z-9999 shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
      {message}
    </div>
  );
}
