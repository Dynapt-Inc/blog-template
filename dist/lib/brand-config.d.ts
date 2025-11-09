import type { SeoData, SiteData, ThemeData } from "./site";
export type BrandSiteConfig = Partial<Omit<SiteData, "theme" | "seo">> & {
    theme?: ThemeData;
    seo?: SeoData;
};
export interface BrandConfig {
    site?: BrandSiteConfig;
    theme?: ThemeData;
    seo?: SeoData;
}
export declare function initializeBrandConfig(config: BrandConfig): void;
export declare function getBrandConfig(): BrandConfig;
export declare function defineBrandConfig(config: BrandConfig): BrandConfig;
