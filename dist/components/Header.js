"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from "next/link";
import { useState, useEffect } from "react";
export function Header({ siteName, logoUrl }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    const isValidImageSrc = (src) => {
        if (!src)
            return false;
        return /^https?:\/\//.test(src) || src.startsWith("/");
    };
    return (_jsx("header", { className: `sticky top-0 z-50 transition-all duration-300 ${isScrolled
            ? "glass shadow-lg backdrop-blur-md"
            : "bg-[color:var(--background)] border-b border-theme"}`, children: _jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "flex items-center justify-between h-16", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "relative h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary overflow-hidden flex items-center justify-center shadow-md", children: isValidImageSrc(logoUrl) ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    _jsx("img", { src: logoUrl, alt: siteName, className: "h-8 w-8 object-contain rounded-full" })) : (_jsx("span", { className: "text-white font-bold text-sm", children: siteName.charAt(0).toUpperCase() })) }), _jsx(Link, { href: "/", className: "text-xl font-bold tracking-tight text-primary hover:text-primary-hover transition-colors duration-200", children: siteName })] }), _jsxs("nav", { className: "hidden md:flex items-center gap-8", children: [_jsxs(Link, { href: "/", className: "text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 relative group", children: ["Home", _jsx("span", { className: "absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full" })] }), _jsxs(Link, { href: "/posts", className: "text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 relative group", children: ["Articles", _jsx("span", { className: "absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full" })] })] }), _jsx("button", { className: "md:hidden p-2 rounded-lg hover:bg-muted transition-colors duration-200", onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen), "aria-label": "Toggle mobile menu", children: _jsxs("div", { className: "w-6 h-6 relative", children: [_jsx("span", { className: `absolute block h-0.5 w-6 bg-current transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 top-3" : "top-1"}` }), _jsx("span", { className: `absolute block h-0.5 w-6 bg-current transition-all duration-300 top-3 ${isMobileMenuOpen ? "opacity-0" : "opacity-100"}` }), _jsx("span", { className: `absolute block h-0.5 w-6 bg-current transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 top-3" : "top-5"}` })] }) })] }), _jsx("div", { className: `md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen
                        ? "max-h-48 opacity-100 pb-4"
                        : "max-h-0 opacity-0 overflow-hidden"}`, children: _jsxs("nav", { className: "flex flex-col gap-4 pt-4 border-t border-theme", children: [_jsx(Link, { href: "/", className: "text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 py-2", onClick: () => setIsMobileMenuOpen(false), children: "Home" }), _jsx(Link, { href: "/posts", className: "text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 py-2", onClick: () => setIsMobileMenuOpen(false), children: "Articles" })] }) })] }) }));
}
export default Header;
