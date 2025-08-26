"use client";

import Link from "next/link";

interface BackButtonProps {
  fallbackUrl?: string;
}

export function BackButton({ fallbackUrl = "/posts" }: BackButtonProps) {
  const handleBackClick = (e: React.MouseEvent) => {
    // If we have browser history, go back
    if (typeof window !== "undefined" && window.history.length > 1) {
      e.preventDefault();
      window.history.back();
    }
    // Otherwise, the Link component will handle navigation to fallbackUrl
  };

  return (
    <Link
      href={fallbackUrl}
      onClick={handleBackClick}
      className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      Back
    </Link>
  );
}

export default BackButton;
