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
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-theme bg-card hover:bg-muted text-muted-foreground hover:text-primary transition-all duration-200 group"
    >
      <svg
        className="w-4 h-4 transition-transform group-hover:-translate-x-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      <span className="font-medium">Back to Articles</span>
    </Link>
  );
}

export default BackButton;
