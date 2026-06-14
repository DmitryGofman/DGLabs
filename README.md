# Gofman Labs — Website

**Technology for Human Evolution.** Marketing & research site for Gofman Labs — a
personal research lab and product studio building technologies that cultivate
human capability.

## Design

A premium, mobile-first static site with a dark cinematic hero that transitions
into a clean white research-lab body as you scroll.

- Restrained palette: near-black, charcoal, warm ivory, stone, muted gold.
- Editorial serif (Fraunces) headlines + geometric sans (Inter) body.
- Thin-line, custom SVG iconography (sacred-geometry inspired, used with restraint).
- Smooth dark→light scroll experience, subtle fade-in reveals, full-screen mobile menu.
- Accessible, semantic HTML; respects `prefers-reduced-motion`.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home — vision, mission, projects, philosophy, journal preview |
| `projects.html` | Detailed view of each product & experiment |
| `vision.html` | Long-form manifesto |
| `about.html` | Dmitry Gofman — background & practice |
| `journal.html` | Essays & research notes |
| `contact.html` | Contact form + details |

## Stack

No build step. Vanilla HTML, CSS, and a small JavaScript file — fast on mobile,
easy to host anywhere.

```
assets/
  css/style.css   Design system & layout
  js/main.js      Nav, mobile menu, scroll reveals, form
  icons.svg       SVG sprite (projects, pillars, UI, social)
```

## Run locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Serve over HTTP (not `file://`) so the SVG sprite references resolve.

## Deploy

Any static host works — GitHub Pages, Netlify, Vercel, Cloudflare Pages.
Point it at the repository root.
