# DMGlabs — Website

**Technology for Human Evolution.** Marketing & research site for DMGlabs — a
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
| `learn.html` | **Learn hub** — indexes all interactive study modules |
| `builders-path.html` | Learn module · **The Builder's Path** — coding with Claude Code (see below) |
| `robotics.html` | Learn module · **Robotics Study Plan** — personalized robotics path (see below) |
| `architecture.html` | Learn module · **The Architect's Scroll** — gamified software-architecture course (Hebrew, RTL, self-contained) |
| `vision.html` | Long-form manifesto |
| `about.html` | Dmitry Gofman — background & practice |
| `journal.html` | **The Log** — dated, categorized blog with a client-side category filter |
| `contact.html` | Contact form + details |

> **Site architecture & growth plan:** see [`docs/SITE-ARCHITECTURE.md`](docs/SITE-ARCHITECTURE.md)
> for how the site is structured as a personal documentation blog and the one-repo-vs-many guidance.

## Learn — a hub of study modules

`learn.html` is a **hub** that lists interactive study modules as cards (with live
per-module progress read from `localStorage`). New subjects become new module pages
linked from the hub. Current modules: **The Builder's Path** (coding), **Robotics
Study Plan**, and **The Architect's Scroll** (software architecture).

### The Builder's Path (`builders-path.html`)

Takes you from "vibe coding" to real engineering, oriented toward building tools for
**mechanical engineering, robotics, and physical AI** with Claude Code.

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

## Robotics — Personalized Study Plan

A dedicated module (`robotics.html`) implementing a full personalized robotics
study plan as an interactive tool:

- **Self-assessment & gap analysis** — rate yourself across 16 robotics domains;
  a readiness score and a priority-ranked list of gaps (weighted by how
  foundational each area is) update live.
- **Competency curriculum** — 14 core topics in order of importance, each with a
  full-time study estimate, plus a **study-time calculator** that converts the
  remaining work into a realistic calendar based on your weekly hours.
- **Hands-on projects** — five builds from line-follower to sim-to-real, with
  deliverables and component lists.
- **Resources, 24-month timeline, and career prep** — authoritative sources, a
  five-phase roadmap with checkpoints at 6/12/24 months, target roles, and
  interview preparation.

Progress and self-assessment are saved per-device in `localStorage`. Built in
`assets/css/robotics.css` + `assets/js/robotics.js` on the shared design system.

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
