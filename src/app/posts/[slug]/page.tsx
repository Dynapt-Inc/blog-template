import { createBlogShell } from "@caleblawson/blog-shell";
import { brandConfig } from "../../../brand-config";

const { postDetail } = createBlogShell(brandConfig);

export const dynamic = postDetail.dynamic;
export const revalidate = postDetail.revalidate;
export const generateMetadata = postDetail.generateMetadata;

export default postDetail.Page;
