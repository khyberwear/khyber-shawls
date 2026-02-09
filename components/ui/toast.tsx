// components/ui/toast.tsx
"use client";

import { useEffect, useRef } from "react";

type ToastProps = {
  message: string;
  show: boolean;
  onClose: () => void;
};

export function Toast({ message, show, onClose }: ToastProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (show) {
      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        onClose();
      }, 2000);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [show, onClose]);

  return (
    <div
      className={`fixed bottom-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-transform duration-300 ${show ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
    >
      {message}
    </div>
  );
}
