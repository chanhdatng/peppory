# Phase 01: Project Setup

**Status**: Pending
**Priority**: High

---

## Context
- [Tech Stack](../../docs/tech-stack.md)
- [Plan Overview](./plan.md)

---

## Overview

Initialize Next.js 15 project with TypeScript and Tailwind CSS. Configure fonts, colors, and base layout.

---

## Implementation Steps

### 1. Initialize Project
```bash
npx create-next-app@latest . --typescript --tailwind --app --use-pnpm
```

### 2. Configure Tailwind Colors
Update `tailwind.config.ts` with wabi-sabi palette:
- terracotta, sage, sand, charcoal, cream

### 3. Setup Fonts
- Playfair Display (heading)
- Source Sans 3 (body)
- Caveat (accent)

### 4. Create Base Layout
- `app/layout.tsx` with metadata, fonts
- Navigation component
- Footer component

### 5. Create Page Stubs
- Home, About, Showroom, Contact pages

---

## Success Criteria

- [ ] Project runs with `pnpm dev`
- [ ] Tailwind custom colors work
- [ ] Fonts load correctly
- [ ] Navigation works

---

## Files to Create/Modify

```
app/
├── layout.tsx
├── page.tsx
├── globals.css
components/
├── navigation.tsx
├── footer.tsx
tailwind.config.ts
```
