import Link from "next/link";

interface HeroProps {
  title: string;
  subtitle: string;
  imageUrl?: string;
}

export function Hero({ title, subtitle, imageUrl }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted to-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="animate-fadeInUp">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              Welcome to our blog
            </div>

            <h1 className="heading-1 text-gradient mb-6">{title}</h1>

            <p className="body-large text-muted-foreground mb-8 max-w-2xl">
              {subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/posts" className="btn btn-primary btn-lg group">
                <span>Explore Articles</span>
                <svg
                  className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>

              <Link href="#featured" className="btn btn-secondary btn-lg group">
                <span>Latest Posts</span>
                <svg
                  className="w-5 h-5 ml-2 transition-transform group-hover:translate-y-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </Link>
            </div>

            {/* Stats or Features */}
            <div className="mt-12 grid grid-cols-3 gap-8 pt-8 border-t border-theme">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">100+</div>
                <div className="text-sm text-muted-foreground">Articles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">50K+</div>
                <div className="text-sm text-muted-foreground">Readers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  Weekly
                </div>
                <div className="text-sm text-muted-foreground">Updates</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div
            className="relative animate-fadeInUp"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-2xl">
              {imageUrl ? (
                <div className="relative h-full w-full bg-gradient-to-br from-primary/20 to-secondary/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt=""
                    className="image-cover rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                </div>
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-primary via-secondary to-tertiary flex items-center justify-center rounded-2xl">
                  <div className="text-white text-center">
                    <svg
                      className="w-16 h-16 mx-auto mb-4 opacity-80"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      />
                    </svg>
                    <p className="text-lg font-medium opacity-90">
                      Your Blog Stories
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
            <div
              className="absolute -bottom-8 -left-8 w-32 h-32 bg-secondary/10 rounded-full blur-xl animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
