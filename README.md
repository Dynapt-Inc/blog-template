# Modern Blog Template

A beautifully designed, responsive blog template built with Next.js, TypeScript, and Tailwind CSS. This template is a **consumer of the @caleblawson/blog-shell package**, providing a clean starting point for new blogs created by the blog generator system.

## ✨ Features

### 🎨 Modern Design

- **Responsive Design**: Mobile-first approach with seamless desktop scaling
- **Dark Mode Support**: Automatic dark/light mode based on user preference
- **Modern Typography**: Beautiful typography with the Geist font family
- **Smooth Animations**: Subtle animations and transitions for enhanced UX
- **Glassmorphism Effects**: Modern glass effects on scroll and overlays

### 📱 User Experience

- **Sticky Navigation**: Header with scroll effects and mobile hamburger menu
- **Advanced Search & Filtering**: Search articles by title, content, author, or category
- **Multiple View Modes**: Grid and list views for article browsing
- **Reading Time Estimation**: Automatic calculation of reading time
- **Enhanced Article Reading**: Improved typography and layout for better readability
- **Related Articles**: Smart related posts suggestion based on categories

### 🛠 Technical Features

- **TypeScript**: Fully typed for better development experience
- **Azure Cosmos DB (MySQL)**: Multi-tenant data backend—no local JSON files required
- **Environment Variable Support**: Runtime theming and content customization
- **SEO Optimized**: Meta tags, Open Graph, and Twitter Card support
- **Performance Optimized**: Fast loading with Next.js App Router
- **Accessibility**: WCAG compliant with proper ARIA labels and focus management

### 🎯 Blog Generator Integration

- **Complete Data Compatibility**: Accepts all scraped data variables
- **Flexible Content Structure**: Supports various content formats and metadata
- **Theme Customization**: Runtime theme customization via environment variables
- **Dynamic Categories**: Automatic category detection and filtering
- **Author Management**: Support for multiple authors with avatar generation

### 👥 Multi-User Architecture

This template is a **consumer of the @caleblawson/blog-shell package** that powers multiple user blogs:

- **Shared Codebase**: All users share the same blog shell package, ensuring consistency and easy updates
- **Per-User Branding**: Each user gets their own `brand-config.ts` file with custom colors, logos, and content
- **Database Isolation**: Posts are stored in a shared Azure Cosmos DB with tenant-based isolation
- **Automatic Updates**: When the package is updated, all user blogs automatically get the new features
- **Environment Configuration**: Runtime customization through environment variables

#### How It Works

1. **Template Cloning**: Blog generator clones this template repository for each new blog
2. **Package Installation**: Template automatically installs `@caleblawson/blog-shell`
3. **Brand Configuration**: Blog generator creates a `brand-config.ts` file with user-specific branding
4. **Shell Integration**: Template imports components from the package and initializes branding
5. **Database Connection**: Blogs connect to shared database using tenant IDs for data isolation
6. **Updates**: Publishing new package versions automatically updates all user blogs via package manager

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd blog-template
```

2. Run the setup script (builds dependencies and configures CSS):

```bash
npm run setup
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router entry points
│   ├── page.tsx            # Homepage with featured articles
│   ├── posts/
│   │   ├── page.tsx        # Articles listing with search/filter
│   │   └── [slug]/page.tsx # Individual article page
│   └── layout.tsx          # Root layout with theme support
├── components/             # Reusable React components
└── lib/
    ├── brand-config.ts     # Runtime brand config loader + helpers
    ├── content.ts          # Content loading and processing
    ├── db.ts               # Cosmos DB connection utilities
    ├── posts.ts            # Queries for published posts
    └── site.ts             # Shared Site/Theme/SEO types

brand-config.ts             # Tenant-provided config consumed via createBlogShell
```

## ⚙️ Configuration

### Site Configuration (`brand-config.ts`)

Every customer repository now ships a tiny config module that defines the allowed brand inputs. The config is typed so Renovate/Dependabot PRs stay safe:

```ts
import { defineBrandConfig } from "@caleblawson/blog-shell";

export default defineBrandConfig({
  site: {
    siteName: "Acme Widgets Blog",
    logoUrl: "/brand/logo.svg",
    heroTitle: "Insights from the Acme team",
    heroSubtitle: "Thought leadership, case studies, and playbooks.",
    heroImageUrl: "/brand/hero.png",
    aboutText: "We build tools that make developers faster.",
    contactEmail: "hello@acme.com",
    contactPhone: "+1 (555) 123-4567",
    contactAddress: "500 5th Ave, New York, NY",
    theme: {
      colors: {
        primary: "#2563eb",
        secondary: "#6366f1",
        tertiary: "#06b6d4",
      },
    },
  },
  seo: {
    title: "Acme Engineering Blog",
    description: "Ship faster with Acme guidance.",
    keywords: ["acme", "engineering", "platform"],
  },
});
```

Store logo files under `public/brand` (or any folder you prefer) so each tenant commits assets alongside the config. The helper simply validates the shape and the shell runtime consumes the object through `createBlogShell`.

### Environment Variables

Configure the following variables (all required unless noted):

```env
# Cosmos DB for MySQL (shared multi-tenant database)
COSMOS_MYSQL_HOST="your-cosmos-host.mysql.cosmos.azure.com"
COSMOS_MYSQL_PORT="3306"
COSMOS_MYSQL_USERNAME="cosmos-user@your-cosmos-host"
COSMOS_MYSQL_PASSWORD="super-secure-password"
COSMOS_MYSQL_DATABASE="blog_platform"
# optional: provide "skip" to disable TLS validation for local proxies
COSMOS_MYSQL_SSL="required"
# optional: inline cert or relative path if you use custom CA
COSMOS_MYSQL_CA_CERT="./certs/cosmos-ca.pem"

# Tenant selector (each blog instance gets a unique tenant id)
BLOG_TENANT_ID="tenant_1234"
NEXT_PUBLIC_BLOG_TENANT_ID="tenant_1234"

# Site branding (optional overrides)
NEXT_PUBLIC_ORG_NAME="Your Organization"
NEXT_PUBLIC_ORG_LOGO_URL="https://..."

# Theme colors (optional)
NEXT_PUBLIC_PRIMARY_COLOR="#2563eb"
NEXT_PUBLIC_SECONDARY_COLOR="#6366f1"
NEXT_PUBLIC_TERTIARY_COLOR="#06b6d4"

# SEO (optional)
NEXT_PUBLIC_SEO_TITLE="Your SEO Title"
NEXT_PUBLIC_SEO_DESCRIPTION="Your SEO Description"
```

> ℹ️ `BLOG_TENANT_ID` is the authoritative value used on the server. `NEXT_PUBLIC_BLOG_TENANT_ID` is provided so the client bundle can reference the same tenant when needed.

### Runtime Customization

Brand settings and theme colors now come from each tenant's `brand-config.ts`. Environment variables still win at runtime, which keeps automated deployments flexible (blue/green, previews, etc.).

## Multi-Tenant Shell Package

This template consumes the reusable `@caleblawson/blog-shell` package. Each customer repo stays tiny: commit a `brand-config.ts`, a `/public/brand` folder for assets, and simple wrapper files that re-export the packaged routes.

1. **Install the shell**

   ```bash
   npm install @caleblawson/blog-shell
   ```

2. **Create `brand-config.ts`** using the snippet above and commit logos/icons alongside it.

3. **Wire the package into your Next.js `app/` directory**

   ```ts
   // app/layout.tsx
   import brandConfig from "../brand-config";
   import { createBlogShell } from "@caleblawson/blog-shell";

   const { RootLayout, generateRootMetadata } = createBlogShell(brandConfig);

   export const metadata = generateRootMetadata;
   export default RootLayout;
   ```

   ```ts
   // app/page.tsx
   import brandConfig from "../brand-config";
   import { createBlogShell } from "@caleblawson/blog-shell";

   const { home } = createBlogShell(brandConfig);

   export const dynamic = home.dynamic;
   export const revalidate = home.revalidate;
   export default home.Page;
   ```

   ```ts
   // app/posts/page.tsx
   import brandConfig from "../../brand-config";
   import { createBlogShell } from "@caleblawson/blog-shell";

   const { postsIndex } = createBlogShell(brandConfig);

   export const dynamic = postsIndex.dynamic;
   export const revalidate = postsIndex.revalidate;
   export default postsIndex.Page;
   ```

   ```ts
   // app/posts/[slug]/page.tsx
   import brandConfig from "../../../brand-config";
   import { createBlogShell } from "@caleblawson/blog-shell";

   const { postDetail } = createBlogShell(brandConfig);

   export const dynamic = postDetail.dynamic;
   export const revalidate = postDetail.revalidate;
   export const generateMetadata = postDetail.generateMetadata;
   export default postDetail.Page;
   ```

Let Dependabot or Renovate watch `@caleblawson/blog-shell` releases so every tenant repo automatically receives updates whenever the shared shell ships a new version.

## 📝 Content Management

### Cosmos-Backed Articles

Articles are no longer stored as JSON files. Instead, every published post resides in the shared Azure Cosmos DB for MySQL instance provisioned by the blog generator:

- The `posts` table is multi-tenant; rows are scoped by `organization_id`.
- New articles generated via the blog generator are instantly available to every deployed template instance pointing at the corresponding tenant id.
- Deleting or updating posts happens centrally—no repository changes required.

### Editor Workflow

1. Generate or edit posts inside the blog generator dashboard.
2. Publish them—this writes to Cosmos DB.
3. The template reads directly from Cosmos DB at runtime, automatically reflecting new content.

If you need to backfill legacy JSON posts, import them into the `posts` table using the schema provided in the generator repo docs. A sample migration script is included in `docs/cosmos-schema.sql`.

```env
# Site branding
NEXT_PUBLIC_ORG_NAME="Your Organization"
NEXT_PUBLIC_ORG_LOGO_URL="https://..."

# Theme colors
NEXT_PUBLIC_PRIMARY_COLOR="#2563eb"
NEXT_PUBLIC_SECONDARY_COLOR="#6366f1"
NEXT_PUBLIC_TERTIARY_COLOR="#06b6d4"

# SEO
NEXT_PUBLIC_SEO_TITLE="Your SEO Title"
NEXT_PUBLIC_SEO_DESCRIPTION="Your SEO Description"
```

### Supported Content Features

- **Markdown/HTML Support**: Content is stored as HTML, but Markdown can be preprocessed before insertion.
- **Categories**: Stored per post in metadata within Cosmos DB.
- **Authors**: Managed via metadata; defaults to “Editorial Team” when omitted.
- **Images**: Pass `imageUrl` in metadata to render featured media.
- **SEO**: Individual article meta tags and social sharing ready via stored excerpt/title data.

## 🎨 Customization

### Theme Customization

The template uses CSS custom properties for easy theming:

```css
:root {
  --primary: #2563eb;
  --secondary: #6366f1;
  --tertiary: #06b6d4;
  /* ... more variables */
}
```

### Component Variants

PostCard component supports multiple variants:

- `default`: Standard card layout
- `horizontal`: Side-by-side layout for featured content
- `minimal`: Compact list-style layout

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Adding New Features

1. **New Components**: Add to `src/components/`
2. **New Pages**: Add to `src/app/`
3. **Styling**: Use Tailwind classes and CSS variables
4. **Content**: Update `src/lib/content.ts` for new data structures

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Azure Container Apps (Existing Setup)

On push to `main`, GitHub Actions builds and deploys the app.

Required GitHub secrets now include Cosmos DB access:

- `AZURE_CLIENT_ID`
- `AZURE_TENANT_ID`
- `AZURE_SUBSCRIPTION_ID`
- `AZURE_RESOURCE_GROUP`
- `AZURE_CONTAINER_APP_NAME`
- `ACR_NAME` (Azure Container Registry name)
- `ACR_LOGIN_SERVER` (e.g. `myregistry.azurecr.io`)
- `COSMOS_MYSQL_HOST`
- `COSMOS_MYSQL_PORT`
- `COSMOS_MYSQL_USERNAME`
- `COSMOS_MYSQL_PASSWORD`
- `COSMOS_MYSQL_DATABASE`
- `BLOG_TENANT_ID`

### Other Platforms

The template works on any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Integration with Blog Generator

This template is designed to work seamlessly with the blog generator system:

1. **Data Compatibility**: Accepts all scraped data formats
2. **Environment Integration**: Uses environment variables for runtime customization
3. **Content Processing**: Handles various content structures and formats
4. **Theme Application**: Applies custom themes from scraped data

## 📄 License

MIT License - feel free to use this template for your projects.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Typography by [Geist Font](https://vercel.com/font)
- Icons from [Heroicons](https://heroicons.com/)
