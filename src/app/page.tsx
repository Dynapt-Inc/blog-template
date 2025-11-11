import { createBlogShell } from "@caleblawson/blog-shell";
import { brandConfig } from "../brand-config";

const { home } = createBlogShell(brandConfig);

export const dynamic = home.dynamic;
export const revalidate = home.revalidate;

export default home.Page;
