interface FooterProps {
  siteName: string;
}

export function Footer({ siteName }: FooterProps) {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600">
          © {new Date().getFullYear()} {siteName}
        </div>
        <div className="flex items-center gap-4 text-sm">
          <a href="#" className="hover:underline">
            Privacy
          </a>
          <a href="#" className="hover:underline">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
