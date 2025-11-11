import "./globals.css";
import { createBlogShell } from "@caleblawson/blog-shell";
import { brandConfig } from "../brand-config";

const { RootLayout, generateRootMetadata } = createBlogShell(brandConfig);

export const metadata = generateRootMetadata;
export default RootLayout;
