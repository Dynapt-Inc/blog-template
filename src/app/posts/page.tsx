import { createBlogShell } from "@caleblawson/blog-shell";
import { brandConfig } from "../../brand-config";

const { postsIndex } = createBlogShell(brandConfig);

export const dynamic = postsIndex.dynamic;
export const revalidate = postsIndex.revalidate;

export default postsIndex.Page;
