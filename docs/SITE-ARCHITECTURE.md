# DGLabs — Site Architecture & Growth Plan

A blueprint for evolving this site into your **personal lab notebook** — one place
that documents everything you make: software, mobile games, physical builds,
maker projects, art, yoga and practice, research, and learning.

---

## 1. The core question: one repo or many?

**Recommendation: one repo for the *website*, separate repos only for *real code projects*.**

Think of it as two different kinds of things:

| Thing | Where it lives | Why |
| --- | --- | --- |
| **The website / blog itself** (this repo) | **One repo** — `DGLabs` | It's a single publication. Splitting it per topic just multiplies deploys, nav, and CSS with no benefit. |
| **A software project with its own life** (a mobile game, a tool, a firmware repo) | **Its own repo** | It has its own issues, releases, CI, collaborators, and history. The blog *links to it* and hosts the write-up. |
| **Everything non-code** (yoga log, an art piece, a maker build, a photo essay) | **Content in the website repo** | There's no code to version separately — it's just a post with text + images. |

**Rule of thumb:** *If it compiles, tests, or ships on its own → new repo. If it's a story about something you did → a post in this repo.*

Why not a repo per topic (games repo, art repo, …)? Because "topic" is a **tag**, not a
boundary. A single post might be both "maker" and "physical AI." Tags handle that;
folders and repos don't. Keep the publication unified and slice it with categories.

---

## 2. Content architecture

Three top-level areas, all in this one repo:

```
Home            → who you are + latest across everything
Projects        → the "portfolio" — finished/ongoing things (links out to their repos)
Learn           → the study hub (Builder's Path, Robotics, Architect's Scroll, …)
Journal / Log   → THE BLOG — dated entries across every domain, filtered by category
About / Contact → the usual
```

### The Journal becomes your documentation feed
Today `journal.html` is a static grid of sample cards. Grow it into a real log where
every entry carries a **category** and optional **tags**:

- `Code` · `Robotics` · `Games` · `Physical / Maker` · `Art` · `Yoga / Practice` · `Research`

Each entry is a small page (or Markdown file) with: title, date, category, hero image,
the story (what you tried, what broke, what you learned), and links to the project repo,
a demo, or photos. A category filter bar at the top lets you (and visitors) view just
"Games" or just "Yoga."

This is the heart of "a personal blog where I record and document the things I'm doing."

---

## 3. How to actually build it (tooling)

You're on a **hand-authored static site** (vanilla HTML/CSS/JS, no build step). That's
genuinely good for now — fast, simple, no toolchain to maintain. But hand-writing full
HTML for *every* journal entry will get tedious around ~15–20 posts.

**Two-stage plan:**

### Stage A — now (0–20 posts): stay static, add a light system
- Keep one shared `nav`/`footer` pattern (you already do).
- Make each journal post a small HTML file in a `journal/` folder from a template.
- Add the category-filter bar (a few lines of JS over `data-category` attributes).
- **Cost:** zero new tools. **Effort:** low.

### Stage B — when posting gets frequent: adopt a static site generator
Move to **Astro** or **Eleventy (11ty)**. Then a post is just a Markdown file with a
little front-matter, and the generator builds the HTML, lists, tags, and RSS for you:

```markdown
---
title: "Line-follower v1 — it drifts on tight corners"
date: 2026-07-02
category: Robotics
tags: [maker, control, arduino]
repo: https://github.com/DmitryGofman/line-follower
cover: /img/linebot.jpg
---
Today I got the PID loop running but it overshoots on 90° turns...
```

- **Astro** — best if you want to keep your current design and sprinkle in interactivity
  (your Learn modules port over as-is). Ships zero JS by default.
- **Eleventy** — simplest, pure content site, tiny footprint.
- Both keep **GitHub Pages** deployment and your no-database, no-backend model.
- Your existing interactive modules (`learn.js`, `robotics.js`) drop in unchanged.

**Don't do Stage B until the friction is real.** Migrating early is wasted effort.

---

## 4. Media & assets
- Images in `assets/img/<topic>/` (or `/public/img` under Astro). Compress before commit
  (keep the repo light); for lots of video, link out to YouTube/Vimeo rather than commit binaries.
- Keep large CAD/STL/build files in the *project's own repo* or a release asset, linked from the post.

---

## 5. Deployment (already done)
- **GitHub Pages** via `.github/workflows/deploy-pages.yml`, auto-deploys on push to `main`.
- Live at `https://dmitrygofman.github.io/DGLabs/`.
- **Custom domain** when ready: buy `gofmanlabs.com`, add a `CNAME` file + DNS records —
  Pages supports it natively, no cost change. Recommended once the site is public-facing.

---

## 6. Linking the two worlds (blog ↔ project repos)
When you finish (say) a mobile game:
1. It lives in its **own repo** (`DmitryGofman/<game>`), with its own README, releases, CI.
2. You add a **Projects** entry and/or a **Journal** post here that links to it, embeds a
   screenshot/GIF, and tells the story.
3. Optional: the project repo's README links *back* to the write-up. Now the portfolio and
   the code cross-reference each other.

This gives you a clean portfolio (Projects), a running narrative (Journal), and independent,
professional code repos — without duplicating anything.

---

## 7. Suggested near-term roadmap
1. **Now:** Learn hub is live with modules (done). Keep adding study modules as cards.
2. **Next:** Upgrade the Journal into a real categorized log; write the first 3–5 real entries
   (one per domain — a game, a maker build, a yoga reflection) to prove the format.
3. **Then:** Flesh out Projects with your actual repos (Mangison, the agent Factory, games).
4. **When posting is frequent:** migrate to Astro, Markdown posts, tags, and RSS.
5. **When public:** custom domain + basic analytics.

---

## 8. Current structure (reference)

```
DGLabs/                     ← the one website repo
├── index.html              Home
├── projects.html           Portfolio (links out to project repos)
├── learn.html              Learn HUB — indexes all study modules
│   ├── builders-path.html    · Coding with Claude Code
│   ├── robotics.html         · Robotics Study Plan
│   └── architecture.html     · The Architect's Scroll (Hebrew, interactive)
├── journal.html            → grow into the categorized blog/log
├── vision.html · about.html · contact.html
├── assets/{css,js,icons}   Shared design system + per-module JS
├── docs/SITE-ARCHITECTURE.md  ← this file
└── .github/workflows/      GitHub Pages deploy

Separate repos (future): one per real software project, linked from Projects/Journal.
```
