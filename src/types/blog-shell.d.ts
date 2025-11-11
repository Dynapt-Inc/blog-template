/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from 'next';
import React from 'react';

declare module '@caleblawson/blog-shell' {
  export interface BrandConfig {
    site?: {
      siteName?: string;
      heroTitle?: string;
      heroSubtitle?: string;
      theme?: any;
      seo?: any;
    };
    theme?: any;
    seo?: any;
  }

  export interface BlogShellEntryPoints {
    RootLayout: (props: { children: React.ReactNode }) => React.JSX.Element;
    generateRootMetadata: () => Metadata;
    home: {
      Page: () => Promise<React.JSX.Element>;
      dynamic: "force-dynamic";
      revalidate: 0;
    };
    postsIndex: {
      Page: () => Promise<React.JSX.Element>;
      dynamic: "force-dynamic";
      revalidate: 0;
    };
    postDetail: {
      Page: (props: { params?: Promise<{ slug: string }> }) => Promise<React.JSX.Element>;
      dynamic: "force-dynamic";
      revalidate: 0;
      generateMetadata: (props: { params?: Promise<{ slug: string }> }) => Promise<Metadata>;
    };
  }

  export function createBlogShell(config: BrandConfig): BlogShellEntryPoints;

  export function defineBrandConfig(): BrandConfig;
}
