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
| `learn.html` | **The Builder's Path** — interactive coding curriculum (see below) |
| `vision.html` | Long-form manifesto |
| `about.html` | Dmitry Gofman — background & practice |
| `journal.html` | Essays & research notes |
| `contact.html` | Contact form + details |

## Learn — The Builder's Path

An interactive learning section that takes you from "vibe coding" to real
engineering, oriented toward building tools for **mechanical engineering,
robotics, and physical AI** with Claude Code and other modern tooling.

- **The Iceberg** — an interactive map of vibe coding (the easy tip) vs. the
  production reality beneath the surface (version control, testing, CI/CD,
  environments, data, architecture).
- **Four tracks, 22 lessons** — Foundations · Mastering Claude Code ·
  Production Reality · Building for Your Domain. Each lesson pairs a short
  "why it matters" with a concrete command to run in Claude Code. Progress is
  saved per-device in `localStorage` (no backend, no accounts).
- **Command Dojo** — a simulated Claude Code terminal to practise commands
  (`/init`, `/plan`, `/clear`, `/review`, `git status`) risk-free.
- **Prompt Lab** — a heuristic prompt grader that scores your instruction on
  context, constraints, action, and a definition of "done", plus before/after
  examples.
- **Domain builds** — copy-paste starter prompts for a parametric CAD part,
  a ROS 2 sense-and-react node, and a sensor-fusion (Kalman) pipeline.
- **Knowledge check** — a short interactive quiz on the engineering mindset.

Implemented in `assets/css/learn.css` and `assets/js/learn.js`, layered on the
shared design system. No build step, no dependencies.

## Stack

No build step. Vanilla HTML, CSS, and a small JavaScript file — fast on mobile,
easy to host anywhere.

```
assets/
  css/style.css   Design system & layout
  css/learn.css   Learn module — curriculum, iceberg, dojo, prompt lab, quiz
  js/main.js      Nav, mobile menu, scroll reveals, form
  js/learn.js     Learn module — curriculum data, progress, interactions
  icons.svg       SVG sprite (projects, pillars, learn, UI, social)
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
