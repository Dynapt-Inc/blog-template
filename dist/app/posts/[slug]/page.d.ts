import type { Metadata } from "next";
export declare const dynamic = "force-dynamic";
export declare const revalidate = 0;
interface Params {
    slug: string;
}
interface PostPageProps {
    params?: Promise<Params>;
}
export declare function generateMetadata({ params, }: PostPageProps): Promise<Metadata>;
export default function PostPage({ params }: PostPageProps): Promise<import("react/jsx-runtime").JSX.Element>;
export {};
