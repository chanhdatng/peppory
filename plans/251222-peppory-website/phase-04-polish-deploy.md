# Phase 04: Polish & Deploy

**Status**: Pending
**Priority**: Medium

---

## Context
- [Phase 03](./phase-03-core-pages.md)
- [Tech Stack](../../docs/tech-stack.md)

---

## Overview

Final polish, SEO optimization, and deployment to Vercel.

---

## Implementation Steps

### 1. SEO Optimization
- Metadata for all pages
- Open Graph images
- sitemap.xml
- robots.txt

### 2. Performance Audit
- Run Lighthouse
- Optimize images (WebP)
- Check LCP, CLS, FID
- Target: 90+ score

### 3. Accessibility
- Alt text for all images
- Keyboard navigation
- Color contrast check
- Screen reader test

### 4. Final Polish
- 404 page
- Loading states
- Error boundaries
- Favicon + app icons

### 5. Deployment
- Connect to Vercel
- Configure custom domain
- Set up analytics (optional)
- Test production build

---

## SEO Metadata Template

```tsx
export const metadata = {
  title: 'Peppory - Gốm Thủ Công',
  description: 'Tiệm gốm thủ công với phong cách wabi-sabi...',
  openGraph: {
    title: 'Peppory',
    description: '...',
    images: ['/og-image.jpg'],
  },
};
```

---

## Success Criteria

- [ ] Lighthouse 90+
- [ ] All metadata present
- [ ] Site deployed to Vercel
- [ ] Custom domain configured

---

## Files to Create

```
app/
├── not-found.tsx
├── sitemap.ts
├── robots.ts
public/
├── og-image.jpg
├── favicon.ico
└── apple-icon.png
```
