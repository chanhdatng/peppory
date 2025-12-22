# Peppory Tech Stack

## Core Stack

| Layer | Technology | Reason |
|-------|------------|--------|
| Framework | Next.js 15 | App Router, SSG, SEO, Vercel deploy |
| Language | TypeScript | Type safety, better DX |
| Styling | Tailwind CSS | Utility-first, fast iteration |
| Images | next/image | Auto WebP/AVIF, lazy load |
| Fonts | next/font | Local optimization |
| Animations | CSS + Framer Motion (minimal) | Subtle wabi-sabi transitions |

## Structure

```
app/
├── layout.tsx      # Root layout + nav
├── page.tsx        # Home hero + intro
├── about/
│   └── page.tsx    # About Peppory
├── showroom/
│   └── page.tsx    # Product gallery
└── contact/
    └── page.tsx    # Contact form
```

## Design Stack

- **Style**: Wabi-sabi / Organic
- **Colors**: Earthy tones (terracotta, sage, sand, cream)
- **Typography**: Serif + handwritten accent
- **Textures**: Paper grain, subtle imperfections

## Deployment

- **Platform**: Vercel (recommended) or Cloudflare Pages
- **Image CDN**: Built-in with Vercel
- **Domain**: Custom domain via Vercel

## Dependencies (Minimal)

```json
{
  "next": "^15.x",
  "react": "^19.x",
  "tailwindcss": "^4.x",
  "framer-motion": "^11.x"
}
```

## Performance Targets

- Lighthouse: 90+
- LCP: <2.5s
- CLS: <0.1
- FID: <100ms
