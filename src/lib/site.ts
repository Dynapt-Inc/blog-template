export interface ThemeData {
  colors?: {
    primary?: string;
    secondary?: string;
    tertiary?: string;
    background?: string;
    foreground?: string;
  };
}

export interface SeoData {
  title?: string;
  description?: string;
  keywords?: string | string[];
}

export interface SiteData {
  siteName: string;
  logoUrl?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl?: string;
  aboutText: string;
  aboutImageUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  theme?: ThemeData;
  seo?: SeoData;
}
