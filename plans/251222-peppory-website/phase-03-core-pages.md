# Phase 03: Core Pages

**Status**: Pending
**Priority**: High

---

## Context
- [Phase 02](./phase-02-design-system.md)
- [Plan Overview](./plan.md)

---

## Overview

Build out all 4 pages using design system components. Focus on content structure and visual hierarchy.

---

## Implementation Steps

### 1. Home Page (`/`)
- Hero section: Full-width image + tagline
- Introduction: Brief about Peppory
- Featured products: 3-4 highlighted pieces
- CTA: Visit showroom

### 2. About Page (`/about`)
- Story section: Origin of Peppory
- Philosophy: Wabi-sabi approach to pottery
- Process: How pieces are made
- Team/Founder: Brief bio

### 3. Showroom Page (`/showroom`)
- Category filters (optional)
- Masonry/grid gallery
- Product cards with hover preview
- Lightbox for detail view

### 4. Contact Page (`/contact`)
- Contact form (name, email, message)
- Address + map placeholder
- Social links
- Hours of operation

---

## Content (Placeholder)

```
Tagline: "Handcrafted pottery, made with soul"
Description: "Tại Peppory, chúng tôi tạo ra những tác phẩm gốm thủ công..."
Products: 6-8 placeholder images
```

---

## Success Criteria

- [ ] All pages responsive (mobile-first)
- [ ] Content hierarchy clear
- [ ] Images optimized with next/image
- [ ] Contact form functional (or static)

---

## Files to Create/Modify

```
app/
├── page.tsx (home)
├── about/page.tsx
├── showroom/page.tsx
├── contact/page.tsx
data/
└── products.ts (placeholder data)
```
