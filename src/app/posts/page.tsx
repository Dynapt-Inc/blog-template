import { createBlogShell } from "@caleblawson/blog-shell";
import { brandConfig } from "../../brand-config";

const { postsIndex } = createBlogShell(brandConfig);

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default postsIndex.Page;
