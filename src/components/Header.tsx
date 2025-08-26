import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  siteName: string;
  logoUrl?: string;
}

export function Header({ siteName, logoUrl }: HeaderProps) {
  const isValidImageSrc = (src?: string) => {
    if (!src) return false;
    return /^https?:\/\//.test(src) || src.startsWith("/");
  };
  return (
    <header className="border-b">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded bg-gray-200 overflow-hidden flex items-center justify-center">
            {isValidImageSrc(logoUrl) ? (
              <Image
                src={logoUrl as string}
                alt={siteName}
                width={40}
                height={40}
              />
            ) : null}
          </div>
          <Link href="/" className="text-xl font-semibold hover:underline">
            {siteName}
          </Link>
        </div>
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          <Link className="hover:underline" href="/posts">
            Articles
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
