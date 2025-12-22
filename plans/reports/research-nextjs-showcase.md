# Research Report: Next.js 15 Best Practices for Showcase/Portfolio Websites

**Date:** December 22, 2025
**Scope:** Next.js 15 App Router, image optimization, styling, SEO, and performance
**Target:** Simple portfolio sites (4-5 pages)

---

## Executive Summary

Next.js 15 provides an optimized foundation for portfolio/showcase websites via the App Router (file-based routing), automatic image optimization, and robust SEO metadata APIs. Key advantages: **Turbopack** default bundler (faster dev), **React Server Components** (reduced JS), **ISR/SSG** for static content. Stack recommendation: **Next.js 15 + TypeScript + Tailwind CSS + next/image**. Minimal dependencies required; avoid unnecessary state management for simple portfolios.

---

## App Router Structure (4-5 Pages)

### File-System Routing Pattern

```
app/
├── layout.tsx          # Root layout + shared nav
├── page.tsx            # Home (/)
├── about/
│   └── page.tsx        # /about
├── projects/
│   ├── page.tsx        # /projects (list)
│   └── [id]/
│       └── page.tsx    # /projects/:id (dynamic)
└── contact/
    └── page.tsx        # /contact
```

### Key Principles
- **Folder = Route**: Each folder name becomes URL segment
- **page.tsx = Page UI**: Required file for rendering route
- **layout.tsx = Shared UI**: Wraps child routes (nav, footer)
- **Server Components by Default**: Use `'use client'` only for interactivity
- **Zero Config**: Works out-of-box without routing config files

### Minimal Root Layout Template

```tsx
// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Portfolio',
  description: 'Showcase of my work',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

---

## Image Optimization (next/image)

### Performance Impact
- Images account for **>50% of typical webpage size**
- Automatic format detection (WebP/AVIF) via Accept header
- Native lazy loading (no hydration required)
- Prevents **Cumulative Layout Shift (CLS)** via width/height

### Critical Implementation Details

```tsx
import Image from 'next/image';

export default function HeroSection() {
  return (
    <Image
      src="/portfolio-hero.jpg"
      alt="Portfolio showcase"
      width={1200}
      height={600}
      priority // For above-fold images
      quality={75} // Default; good balance
    />
  );
}
```

### Best Practices
1. **Priority Loading**: Mark hero/above-fold images with `priority` prop
2. **Remote Images**: Always provide explicit `width` & `height` for external URLs
3. **Quality Setting**: Default 75 balances file size vs. visual quality
4. **Blur Placeholder**: Use `blurDataURL` for progressive loading effect
5. **Lazy Loading**: Default enabled; native browser implementation

### Vercel Deployment
- Image optimization works out-of-box on Vercel
- No additional config needed
- Custom deployments: configure custom image loader

---

## Styling Approach: Tailwind CSS

### Why Tailwind for Portfolios
- **Utility-first**: Rapid UI iteration without context-switching
- **Low bundle impact**: Tree-shakes unused styles
- **Responsive by default**: Mobile-first utilities (`md:`, `lg:`)
- **Dark mode support**: Toggle with single class
- **Zero CSS files**: No cascading issues

### Setup (included in `create-next-app`)

```bash
npx create-next-app@latest --typescript --tailwind
```

### Portfolio Example Component

```tsx
// components/Nav.tsx
export default function Nav() {
  return (
    <nav className="flex gap-8 p-6 bg-white shadow">
      <a href="/" className="font-bold hover:text-blue-600">Home</a>
      <a href="/projects" className="hover:text-blue-600">Projects</a>
      <a href="/about" className="hover:text-blue-600">About</a>
    </nav>
  );
}
```

---

## SEO Optimization

### Metadata API (Static + Dynamic)

**Static (for fixed content):**
```tsx
// app/page.tsx
export const metadata: Metadata = {
  title: 'John Doe - Full Stack Developer',
  description: 'Portfolio showcasing 5+ years of web development experience',
  openGraph: {
    title: 'John Doe Portfolio',
    description: 'Full stack developer portfolio',
    url: 'https://johndoe.com',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
};
```

**Dynamic (for parameterized routes):**
```tsx
// app/projects/[id]/page.tsx
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const project = await fetchProject(params.id);
  return {
    title: project.name,
    description: project.description,
  };
}
```

### Critical Elements
- **Title**: Keep ≤60 chars, include primary keyword
- **Meta Description**: 155-160 chars, action-oriented language
- **Open Graph Tags**: Enable rich sharing on social platforms (Facebook, LinkedIn, Twitter)
- **File-based metadata**: `robots.txt`, `sitemap.xml`, favicon files override exports

### Structured Data
JSON-LD optional but recommended for portfolios:
```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'John Doe',
      url: 'https://johndoe.com',
      jobTitle: 'Full Stack Developer',
    }),
  }}
/>
```

---

## Performance Best Practices

### Rendering Strategies

| Strategy | Use Case | Build Time |
|----------|----------|-----------|
| **SSG** (Static) | About, home, projects list | Build only |
| **ISR** | Blog posts updated weekly | Build + periodic revalidation |
| **SSR** | Rarely needed for portfolios | Per request |

### SSG Implementation (Recommended Default)

```tsx
// app/projects/page.tsx
export const revalidate = 86400; // Revalidate daily

async function getProjects() {
  const res = await fetch('https://api.example.com/projects', {
    next: { revalidate: 86400 }
  });
  return res.json();
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <div>{/* render projects */}</div>;
}
```

### Bundle & Runtime Optimization
1. **Turbopack**: Now default in Next.js 15 (replaces Webpack)
   - ~20% faster build times
   - Instant HMR for dev experience
2. **Dependencies**: Minimize external packages
   - Avoid state management (React hooks sufficient)
   - Tree-shake unused code with `next/dynamic`
3. **Web Fonts**: Load locally to reduce latency
   - Avoid Google Fonts CDN if possible
   - Use `next/font` for optimization

---

## Common Pitfalls & Solutions

| Issue | Root Cause | Solution |
|-------|-----------|----------|
| Images cause CLS | Missing `width`/`height` | Always provide explicit dimensions |
| Slow dev server | Webpack default | Upgrade to Next.js 15+ (Turbopack) |
| Over-engineering | Unnecessary complexity | Avoid state management libraries for simple sites |
| Poor LCP | Unoptimized hero images | Add `priority` prop to above-fold images |
| Missing Open Graph | Forgot social metadata | Use `openGraph` in metadata export |

---

## Implementation Checklist

- [ ] Initialize: `npx create-next-app@latest --typescript --tailwind`
- [ ] Structure routes in `app/` directory (home, about, projects, contact)
- [ ] Replace all `<img>` with `next/image` + `width`/`height`
- [ ] Add metadata exports to `layout.tsx` & `page.tsx`
- [ ] Configure `sitemap.xml` & `robots.txt` in `public/`
- [ ] Test with Lighthouse (target: 90+)
- [ ] Deploy to Vercel (automatic image optimization)

---

## Resources & References

### Official Documentation
- [Next.js 15 Getting Started](https://nextjs.org/docs/getting-started)
- [Image Optimization Guide](https://nextjs.org/docs/app/getting-started/images)
- [Metadata & OG Images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [generateMetadata Function](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)

### Recommended Learning
- [Next.js 15 in 2025: Features & Best Practices](https://javascript.plainenglish.io/next-js-15-in-2025-features-best-practices-and-why-its-still-the-framework-to-beat-a535c7338ca8)
- [Best Practices for Organizing Next.js 15](https://dev.to/bajrayejoon/best-practices-for-organizing-your-nextjs-15-2025-53ji)
- [Lighthouse 100 Optimization with Next.js 15](https://medium.com/@annasaaddev/how-i-optimized-my-portfolio-website-for-lighthouse-100-with-next-js-15-adc7610ae4b3)
- [React & Next.js 2025 Best Practices](https://strapi.io/blog/react-and-nextjs-in-2025-modern-best-practices)

### Community Templates
- [Vercel Next.js Portfolio Template](https://vercel.com/templates/next.js/nextjs-portfolio)

---

## Unresolved Questions

1. What image CDN integrations work best for remote images on custom deployments?
2. Should portfolios implement analytics (e.g., Vercel Analytics) or keep minimal?
3. Recommended animation library for Next.js 15 portfolios (Framer Motion overhead vs. CSS)?

---

**Report Status:** Complete
**Last Updated:** 2025-12-22
