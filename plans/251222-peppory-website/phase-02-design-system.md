# Phase 02: Design System

**Status**: Pending
**Priority**: High

---

## Context
- [Design Guidelines](../../docs/design-guidelines.md)
- [Phase 01](./phase-01-setup.md)

---

## Overview

Create reusable components following wabi-sabi aesthetic. Focus on organic shapes, earthy colors, subtle textures.

---

## Implementation Steps

### 1. Create UI Components
- Button (primary, secondary, ghost)
- Card (product card with hover)
- Section wrapper with texture
- Typography components (H1-H4, paragraph)

### 2. Add Texture Overlays
- Paper grain SVG pattern
- Subtle noise texture
- Organic curved dividers

### 3. Image Components
- ProductImage with frame
- HeroImage with parallax
- Gallery grid

### 4. Animation Utilities
- Fade in on scroll
- Gentle hover transitions
- Organic movement patterns

---

## Design Tokens

```css
/* Spacing scale */
--space-xs: 0.5rem
--space-sm: 1rem
--space-md: 2rem
--space-lg: 4rem
--space-xl: 8rem

/* Border radius (organic) */
--radius-soft: 8px
--radius-organic: 12px 24px 12px 24px
```

---

## Success Criteria

- [ ] Components match wabi-sabi style
- [ ] Textures visible but subtle
- [ ] Consistent spacing across site
- [ ] Animations smooth, not distracting

---

## Files to Create

```
components/
├── ui/
│   ├── button.tsx
│   ├── card.tsx
│   ├── section.tsx
│   └── typography.tsx
├── product-image.tsx
├── hero-image.tsx
└── gallery-grid.tsx
```
