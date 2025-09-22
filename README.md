# Modern Blog Template

A beautifully designed, responsive blog template built with Next.js, TypeScript, and Tailwind CSS. This template is specifically designed to work seamlessly with the blog generator scraper system, accepting all variable data while providing a modern, user-focused experience.

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

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
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
├── app/                    # Next.js App Router
│   ├── page.tsx           # Homepage with featured articles
│   ├── posts/
│   │   ├── page.tsx       # Articles listing with search/filter
│   │   └── [slug]/
│   │       └── page.tsx   # Individual article page
│   ├── layout.tsx         # Root layout with theme support
│   └── globals.css        # Global styles and CSS variables
├── components/            # Reusable React components
│   ├── Header.tsx         # Sticky header with navigation
│   ├── Hero.tsx           # Hero section with call-to-actions
│   ├── PostCard.tsx       # Article cards (3 variants)
│   ├── Footer.tsx         # Enhanced footer with links
│   ├── Markdown.tsx       # Enhanced markdown renderer
│   ├── BackButton.tsx     # Smart back navigation
│   └── RelatedPosts.tsx   # Related articles component
├── content/               # Content and configuration
│   ├── company.json       # Site configuration and theming
│   └── posts/             # Article JSON files
└── lib/
    └── content.ts         # Content loading and processing
```

## ⚙️ Configuration

### Site Configuration (`src/content/company.json`)

```json
{
  "site": {
    "siteName": "Your Blog Name",
    "logoUrl": "/logo.png",
    "heroTitle": "Your Hero Title",
    "heroSubtitle": "Your Hero Subtitle",
    "heroImageUrl": "https://...",
    "aboutText": "About your blog...",
    "contactEmail": "contact@yourblog.com",
    "theme": {
      "colors": {
        "primary": "#2563eb",
        "secondary": "#6366f1",
        "tertiary": "#06b6d4"
      }
    }
  },
  "seo": {
    "title": "Your SEO Title",
    "description": "Your SEO Description",
    "keywords": ["keyword1", "keyword2"]
  }
}
```

### Environment Variables

For runtime customization, you can use these environment variables:

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

## 📝 Content Management

### Article Structure

Articles are stored as JSON files in `src/content/posts/`:

```json
{
  "slug": "article-slug",
  "title": "Article Title",
  "excerpt": "Brief description...",
  "category": "Technology",
  "imageUrl": "https://...",
  "author": "Author Name",
  "publishedAt": "2024-01-15",
  "content": "Full markdown content..."
}
```

### Supported Content Features

- **Markdown Support**: Full markdown rendering with syntax highlighting
- **Categories**: Automatic category filtering and organization
- **Authors**: Author information with avatar generation
- **Images**: Featured images with responsive optimization
- **Reading Time**: Automatic calculation based on content length
- **SEO**: Individual article meta tags and social sharing

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

Required GitHub secrets:

- `AZURE_CLIENT_ID`
- `AZURE_TENANT_ID`
- `AZURE_SUBSCRIPTION_ID`
- `AZURE_RESOURCE_GROUP`
- `AZURE_CONTAINER_APP_NAME`
- `ACR_NAME` (Azure Container Registry name)
- `ACR_LOGIN_SERVER` (e.g. `myregistry.azurecr.io`)

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
