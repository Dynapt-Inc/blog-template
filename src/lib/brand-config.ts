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

let runtimeConfig: BrandConfig | null = null;
let warnedAboutMissingConfig = false;

function cloneConfig(config: BrandConfig): BrandConfig {
  try {
    return structuredClone(config);
  } catch {
    return JSON.parse(JSON.stringify(config)) as BrandConfig;
  }
}

export function initializeBrandConfig(config: BrandConfig): void {
  runtimeConfig = cloneConfig(config);
  warnedAboutMissingConfig = false;
}

function defaultBrandConfig(): BrandConfig {
  return {
    site: {},
  };
}

export function getBrandConfig(): BrandConfig {
  if (!runtimeConfig) {
    if (!warnedAboutMissingConfig) {
      console.warn(
        "[brand-config] No runtime brand configuration detected; falling back to defaults."
      );
      warnedAboutMissingConfig = true;
    }
    runtimeConfig = defaultBrandConfig();
  }
  return runtimeConfig;
}

export function defineBrandConfig(config: BrandConfig): BrandConfig {
  return config;
}
