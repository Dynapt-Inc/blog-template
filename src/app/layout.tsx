import { createBlogShell } from "@caleblawson/blog-shell";
import "@caleblawson/blog-shell/styles/globals.css";
import { brandConfig } from "../brand-config";

const { RootLayout, generateRootMetadata } = createBlogShell(brandConfig);

export const metadata = generateRootMetadata;
export default RootLayout;
