import { jsx as _jsx } from "react/jsx-runtime";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { loadSite, loadTheme, loadSeo, } from "../lib/content";
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});
const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});
export function generateMetadata() {
    const site = loadSite();
    const seo = site.seo || loadSeo();
    return {
        title: (seo === null || seo === void 0 ? void 0 : seo.title) || site.siteName,
        description: (seo === null || seo === void 0 ? void 0 : seo.description) || site.heroSubtitle,
        keywords: (seo === null || seo === void 0 ? void 0 : seo.keywords)
            ? Array.isArray(seo.keywords)
                ? seo.keywords
                : [seo.keywords]
            : undefined,
    };
}
export default function RootLayout({ children, }) {
    var _a, _b, _c, _d, _e;
    const theme = loadTheme();
    // Prioritize environment variables for runtime CSS custom properties
    const styleVars = {
        "--primary": process.env.NEXT_PUBLIC_PRIMARY_COLOR || ((_a = theme === null || theme === void 0 ? void 0 : theme.colors) === null || _a === void 0 ? void 0 : _a.primary),
        "--secondary": process.env.NEXT_PUBLIC_SECONDARY_COLOR || ((_b = theme === null || theme === void 0 ? void 0 : theme.colors) === null || _b === void 0 ? void 0 : _b.secondary),
        "--tertiary": process.env.NEXT_PUBLIC_TERTIARY_COLOR || ((_c = theme === null || theme === void 0 ? void 0 : theme.colors) === null || _c === void 0 ? void 0 : _c.tertiary),
        "--background": process.env.NEXT_PUBLIC_BACKGROUND_COLOR || ((_d = theme === null || theme === void 0 ? void 0 : theme.colors) === null || _d === void 0 ? void 0 : _d.background),
        "--foreground": process.env.NEXT_PUBLIC_FOREGROUND_COLOR || ((_e = theme === null || theme === void 0 ? void 0 : theme.colors) === null || _e === void 0 ? void 0 : _e.foreground),
    };
    return (_jsx("html", { lang: "en", children: _jsx("body", { className: `${geistSans.variable} ${geistMono.variable} antialiased`, style: styleVars, children: children }) }));
}
