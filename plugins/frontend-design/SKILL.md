---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, or applications. Generates creative, polished code that avoids generic AI aesthetics.
source: anthropics/claude-code
path: plugins/frontend-design
---

# Frontend Design Plugin

Sourced from `anthropics/claude-code` — see `.agents/skills/frontend-design/SKILL.md` for full instructions.

This is the plugin-level registration. The canonical skill body lives at:
- `.agents/skills/frontend-design/SKILL.md` (project agents)
- `skills/frontend-design/SKILL.md` (skills registration)

---

## ⚡ Superpowers

### 1. Motion & Micro-interactions
- Fluid entrance/exit animations using Framer Motion or CSS keyframes
- Staggered list reveals, parallax scrolling, and scroll-triggered transitions
- Hover states with spring physics, magnetic effects, and cursor-reactive elements

### 2. Glassmorphism & Material FX
- Multi-layer frosted glass with backdrop-filter blur + saturation
- Dynamic gradient meshes, noise textures, and grain overlays
- Layered box-shadows with color-matched glow effects

### 3. Advanced Typography
- Variable font animations (weight, width morphing on scroll/hover)
- Kinetic text: character-by-character reveals, scramble effects, typewriter
- Fluid type scaling with `clamp()` for perfect responsive sizing

### 4. Dark-Mode First Design
- Semantic color token system (CSS custom properties) with instant theme switching
- Contrast-safe palette generation with WCAG AA/AAA compliance baked in
- Adaptive images and icon treatment per theme

### 5. Component Intelligence
- Compound component patterns with Context-driven composition
- Headless UI foundations with full aria/keyboard accessibility
- Auto-responsive layouts: CSS Grid subgrid, container queries, intrinsic sizing

### 6. Performance-Grade Output
- Zero layout-shift images with explicit aspect-ratio and blur placeholders
- Critical CSS inlining strategy, code-split boundaries at route level
- Virtualized lists and deferred rendering for data-heavy views

### 7. 3D & Immersive
- Three.js / React Three Fiber scene scaffolding with lighting presets
- CSS 3D card flips, perspective tilt, and depth-layered parallax
- Lottie/Rive animation integration with play-on-scroll control

### 8. Design Token Mastery
- Generates full token sets: spacing scale, radius, shadow, motion, z-index
- Tailwind config extension or CSS custom property sheet — your choice
- Token-to-component traceability for design-system consistency

### 9. Luxury Brand Aesthetics
- Editorial layouts borrowed from high-fashion and luxury hospitality UI
- Gold/platinum accent systems, serif + grotesque font pairings
- Spacious whitespace ratios, asymmetric grids, full-bleed hero patterns

### 10. Rapid Prototyping Mode
- Single-file, zero-dependency HTML/CSS/JS deliverables for instant preview
- Storybook story generation alongside every component
- Screenshot-ready states: loading, empty, error, success — all covered
