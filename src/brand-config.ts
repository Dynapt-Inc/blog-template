import type { BrandConfig } from "@caleblawson/blog-shell";

// Brand configuration for this blog instance
// This is the only file that should be customized per blog
export const brandConfig: BrandConfig = {
  site: {
    siteName: "My Blog",
    logoUrl: "/next.svg",
    heroTitle: "Welcome to My Blog",
    heroSubtitle: "Discover amazing content and insights",
    heroImageUrl: "/globe.svg",
    aboutText: "We create amazing content to help you grow your business and achieve your goals.",
    aboutImageUrl: "/window.svg",
    contactEmail: "hello@myblog.com",
    contactPhone: "+1 (555) 123-4567",
    contactAddress: "123 Main St, Anytown, USA",
  },
  theme: {
    colors: {
      primary: "#3b82f6",
      secondary: "#64748b",
      tertiary: "#8b5cf6",
      background: "#ffffff",
      foreground: "#000000",
    },
  },
  seo: {
    title: "My Blog - Amazing Content and Insights",
    description: "Discover amazing content and insights to help you grow your business and achieve your goals.",
    keywords: ["blog", "content", "insights", "business", "growth"],
  },
};

