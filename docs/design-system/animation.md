# DALC Animation System

## Motion Principles

- Calm, premium, and controlled
- No flashy transitions
- Motion should communicate hierarchy and intent

## Core Animation Rules

- Use Framer Motion for UI transitions
- Keep timing in the 180ms-900ms range depending on context
- Prefer ease curves that feel smooth and elegant

## Required Animations

### AccessCard Entrance

- Fade in
- Slight upward movement
- Gentle scale from `0.96` to `1`

### Input Focus

- Gold border transition
- Soft outer glow

### Card Transformation

- AccessCard expands and transitions into category cards
- Use staggered reveal for category grid

### Category Hover

- Slight lift (`translateY`)
- Subtle border highlight
- Arrow shift to indicate action

### Page Transitions

- Crossfade with slight vertical motion
- Keep transitions fast enough for responsiveness

## Recommended Defaults

- Quick interactions: `180ms-260ms`
- Card hover: `220ms`
- Entrances: `500ms-900ms`
- Use cubic-bezier for premium feel (e.g. `[0.16, 1, 0.3, 1]`)

## Performance Guidance

- Animate `opacity` and `transform` first
- Avoid expensive layout thrashing
- Use `will-change` sparingly and only where needed
- Reduce motion density on lower-end devices
