# Peppory Design Guidelines

Wabi-sabi inspired design system for handcrafted pottery e-commerce.

## 1. Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `terracotta` | #C4A484 | Primary CTA, accents, pottery elements |
| `sage` | #9CAF88 | Secondary actions, success states |
| `sand` | #E5DDD3 | Card backgrounds, dividers |
| `charcoal` | #4A4A4A | Body text, icons |
| `cream` | #FAF8F5 | Page background |

**Extended**: `-light` +15% brightness, `-dark` -15% brightness
**Hover states**: Use dark variants. Transitions 300ms ease.

## 2. Typography

| Element | Font | Size (mobile/lg) | Weight | Line Height |
|---------|------|------------------|--------|-------------|
| h1 | Playfair Display | 2.5/3.5rem | 600 | 1.1 |
| h2 | Playfair Display | 2/2.5rem | 600 | 1.2 |
| h3 | Playfair Display | 1.5/1.75rem | 500 | 1.3 |
| h4 | Playfair Display | 1.25/1.5rem | 500 | 1.4 |
| body | Source Sans 3 | 1/1.125rem | 400 | 1.6 |
| caption | Source Sans 3 | 0.875rem | 400 | 1.5 |
| accent | Caveat | 1.25rem | 400 | 1.4 |

```js
fontFamily: {
  serif: ['Playfair Display', 'Georgia', 'serif'],
  sans: ['Source Sans 3', 'system-ui', 'sans-serif'],
  accent: ['Caveat', 'cursive'],
}
```

## 3. Spacing Scale

Base: 4px. Use Tailwind utilities.

| Token | Value | Use |
|-------|-------|-----|
| xs/sm/md | 4/8/16px | Padding, gaps |
| lg/xl | 24/32px | Component margins |
| 2xl/3xl | 48/64px | Section breaks |

**Section rhythm**: Mobile `py-12`, Desktop `py-20`

## 4. Components

### Buttons
- Primary: `bg-terracotta text-cream rounded-full px-6 py-3`
- Secondary: `border-2 border-charcoal rounded-full px-6 py-3`
- Min height: 48px, transition 300ms

### Cards
- Background: sand, radius `rounded-2xl` (16px)
- Shadow: `0 4px 20px rgba(74,74,74,0.08)`
- Hover: `translateY(-4px)`

### Navigation
- Fixed header, cream + backdrop blur
- Active link: terracotta underline (2px, offset 4px)
- Mobile: hamburger with slide drawer

## 5. Image Treatment

**Style**: Natural lighting, muted earthy tones, texture close-ups, lifestyle context
**Specs**: WebP/AVIF, 85% quality, lazy load below-fold
**Ratios**: 1:1 (product), 4:3 (cards), 16:9 (hero)

```css
/* Paper grain overlay */
.texture::after {
  background: url('/textures/paper-grain.png');
  opacity: 0.03;
  mix-blend-mode: multiply;
}

/* Organic mask */
.organic-mask { border-radius: 40% 60% 55% 45% / 55% 45% 60% 40%; }
```

## 6. Animation

| Type | Duration | Easing |
|------|----------|--------|
| Hover | 200-300ms | ease-out |
| Reveal | 400-600ms | cubic-bezier(0.16, 1, 0.3, 1) |
| Page | 300-400ms | ease-in-out |

**Principles**: Subtle, organic, purposeful. Never distract.

```js
// Framer Motion
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
}
```

**Reduced motion**: Respect `prefers-reduced-motion`.

## 7. Do's and Don'ts

| Do | Don't |
|----|-------|
| Organic shapes, rounded corners | Sharp corners, rigid grids |
| Asymmetry, imperfection | Heavy drop shadows |
| Generous whitespace | Bright saturated colors |
| Texture overlays < 5% opacity | Over-animate |
| Handwritten accents for warmth | Mix more than 3 fonts |
| Mobile-first approach | Generic stock photos |

## 8. Tailwind Config

```js
extend: {
  colors: {
    terracotta: { DEFAULT: '#C4A484', light: '#D4BEA8', dark: '#A68B6A' },
    sage: { DEFAULT: '#9CAF88', light: '#B8C9AE', dark: '#7A9068' },
    sand: '#E5DDD3',
    charcoal: '#4A4A4A',
    cream: '#FAF8F5',
  },
  boxShadow: {
    organic: '0 4px 20px rgba(74,74,74,0.08)',
  },
  borderRadius: {
    blob: '40% 60% 55% 45% / 55% 45% 60% 40%',
  }
}
```

## 9. Accessibility

- Contrast: 4.5:1 min (charcoal on cream = 7.2:1)
- Touch targets: 44x44px min
- Focus states: visible on all interactive elements
- Reduced motion: supported
- Semantic headings: maintained

---
*Updated: 2025-12-22*
