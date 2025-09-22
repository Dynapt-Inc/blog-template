"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface HeaderProps {
  siteName: string;
  logoUrl?: string;
}

export function Header({ siteName, logoUrl }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isValidImageSrc = (src?: string) => {
    if (!src) return false;
    return /^https?:\/\//.test(src) || src.startsWith("/");
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass shadow-lg backdrop-blur-md"
          : "bg-[color:var(--background)] border-b border-theme"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Site Name */}
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary overflow-hidden flex items-center justify-center shadow-md">
              {isValidImageSrc(logoUrl) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl as string}
                  alt={siteName}
                  className="h-8 w-8 object-contain rounded-full"
                />
              ) : (
                <span className="text-white font-bold text-sm">
                  {siteName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-primary hover:text-primary-hover transition-colors duration-200"
            >
              {siteName}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link
              href="/posts"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 relative group"
            >
              Articles
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <div className="w-6 h-6 relative">
              <span
                className={`absolute block h-0.5 w-6 bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? "rotate-45 top-3" : "top-1"
                }`}
              ></span>
              <span
                className={`absolute block h-0.5 w-6 bg-current transition-all duration-300 top-3 ${
                  isMobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              ></span>
              <span
                className={`absolute block h-0.5 w-6 bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? "-rotate-45 top-3" : "top-5"
                }`}
              ></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? "max-h-48 opacity-100 pb-4"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <nav className="flex flex-col gap-4 pt-4 border-t border-theme">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/posts"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Articles
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
