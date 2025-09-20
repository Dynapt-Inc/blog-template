import Link from "next/link";

interface HeroProps {
  title: string;
  subtitle: string;
  imageUrl?: string;
}

export function Hero({ title, subtitle, imageUrl }: HeroProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12 grid md:grid-cols-2 gap-10 items-center">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          {title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/posts"
            className="inline-flex items-center rounded bg-primary px-4 py-2 text-white hover:opacity-90 transition-opacity"
          >
            Read articles
          </Link>
        </div>
      </div>
      <div className="relative aspect-[16/10] w-full rounded-lg bg-muted overflow-hidden">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="image-cover" />
        ) : null}
      </div>
    </section>
  );
}

export default Hero;
