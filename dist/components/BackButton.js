"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from "next/link";
export function BackButton({ fallbackUrl = "/posts" }) {
    const handleBackClick = (e) => {
        // If we have browser history, go back
        if (typeof window !== "undefined" && window.history.length > 1) {
            e.preventDefault();
            window.history.back();
        }
        // Otherwise, the Link component will handle navigation to fallbackUrl
    };
    return (_jsxs(Link, { href: fallbackUrl, onClick: handleBackClick, className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-theme bg-card hover:bg-muted text-muted-foreground hover:text-primary transition-all duration-200 group", children: [_jsx("svg", { className: "w-4 h-4 transition-transform group-hover:-translate-x-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }), _jsx("span", { className: "font-medium", children: "Back to Articles" })] }));
}
export default BackButton;
