# dev-resume v2

Personal portfolio of Umejr Dzinovic — a single-page résumé with an interactive terminal, project deep dives
with real source code, a live GitHub contribution skyline and a CI pipeline view.

## Stack

- **Next.js 16** (App Router, Cache Components, intercepting routes) · **React 19** · **TypeScript**
- **Tailwind CSS 4** + **shadcn/ui** (Base UI primitives) · **motion** · **Lenis** smooth scroll
- **React Three Fiber** for the hero wave field, contribution skyline and tag sphere
- **Shiki** for server-side syntax highlighting
- **Vitest** + Testing Library, **Playwright** (desktop + mobile)

## Getting started

```bash
npm ci
npm run dev        # http://localhost:3000
```

### Environment

| Variable               | Required | Purpose                                                                                           |
| ---------------------- | -------- | ------------------------------------------------------------------------------------------------- |
| `GITHUB_TOKEN`         | no       | Enables live GitHub data (contribution calendar, streak, repo count, latest AuthKit CI run).      |
| `NEXT_PUBLIC_SITE_URL` | no       | Canonical URL for metadata, OG image, sitemap and robots. Defaults to `https://umex10.dev`.       |

Without `GITHUB_TOKEN` the site renders with deterministic fallback data — that is what CI uses.
The contribution calendar comes from the GraphQL API, which requires authentication; a fine-grained token
with no extra permissions (public data only) is enough. Locally with the GitHub CLI:

```bash
GITHUB_TOKEN=$(gh auth token) npm run build
```

GitHub responses are cached with `"use cache"` and revalidated hourly.

## Scripts

| Script              | What it does                                              |
| ------------------- | --------------------------------------------------------- |
| `npm run dev`       | Development server                                        |
| `npm run build`     | Production build                                          |
| `npm run start`     | Serve the production build                                |
| `npm run lint`      | ESLint                                                    |
| `npm run typecheck` | Generates route types, then `tsc --noEmit`                |
| `npm test`          | Unit tests (Vitest, jsdom)                                |
| `npm run e2e`       | Playwright against `next start` on port 3100 (build first) |

```bash
npm run build && npx playwright install chromium && npm run e2e
```

## Project layout

```
app/                  routes — home, /work/[slug] (standalone) and @modal/(.)work/[slug] (sheet)
components/           sections (hero, terminal, work, status, ship, stack, contact) and UI primitives
content/              projects, terminal commands, pipeline and stack data
content/code/         source excerpts copied verbatim from the project repositories
lib/                  GitHub data, contribution maths, accent colours, hooks
tests/unit, tests/e2e Vitest and Playwright suites
```

Project deep dives open as a sheet over the page when navigated to from the site, and as a standalone,
shareable page on a hard load of `/work/<slug>`.

## CI

`.github/workflows/ci.yml` runs on every push to `main` and on pull requests:
lint → typecheck → unit tests → build → Playwright (Chromium, desktop + mobile).
