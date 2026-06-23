---
title: "The Typesafe Full-Stack Monorepo: One Repo, One Language, Every Platform"
description: "What a monorepo + backend-for-frontend + cross-platform client actually is, why the combination feels unfamiliar, how I built a runnable template for it from scratch, and—most importantly—how to scale it from a weekend project to a many-team codebase without it rotting."
category: ["typescript", "react", "backend", "concept", "system-design", "tanstack"]
pubDate: "2026-06-22"
published: true
---

## Table of contents

# Introduction

Most "unfamiliar" repos aren't using exotic technology. They're using three or four *familiar* patterns stacked on top of each other, and the stacking is what trips you up. I ran into one recently: a repo that ships a single React app to web **and** desktop **and** mobile, talks to its own little server, and somehow keeps the frontend and backend types in lockstep. Coming from a plain single-page-app background, it looked alien.

It wasn't. It was three well-known ideas layered together:

1. A **monorepo** (many packages, one repository).
2. A **backend-for-frontend (BFF)** (a thin server that exists only to serve that one frontend).
3. A **cross-platform client** (one codebase, many platforms, via a native webview shell).

Tie those together with **end-to-end type safety** and you get what people loosely call a *typesafe full-stack monorepo*. This article is about that shape: what each layer is, why you'd combine them, how I built a small runnable template to learn it, and—the part everyone underestimates—**how to scale it** before it turns into the thing you were trying to avoid.

# The shape, in one picture

Here's the whole arrangement. Three tiers, one language, one repo:

```
┌───────────────────────────────────────────────────────────────┐
│  apps/web — React SPA (client-rendered)                         │
│  • runs in a browser (web bundle)                               │
│  • runs in a native webview (desktop/mobile via Tauri)          │
└───────────────────────────┬───────────────────────────────────┘
                            │  typed client + zod contracts
                            │  (the only way the app talks to the server)
┌───────────────────────────▼───────────────────────────────────┐
│  api — Backend-for-Frontend (BFF)                               │
│  • stateless · owns no database                                 │
│  • brokers auth, hides backend quirks, gateways AI              │
└───────────────┬───────────────────────────┬───────────────────┘
                │ HTTP (+ identity headers)  │ provider keys (server-only)
┌───────────────▼─────────────┐   ┌──────────▼──────────────────┐
│  your real backend / DB      │   │  third-party APIs (AI, etc.) │
│  (the system of record)      │   │                              │
└──────────────────────────────┘   └──────────────────────────────┘
```

The rule that holds it together: **the app never talks to the real backend or to third parties directly.** It only talks to the BFF, and only through a typed client. That single constraint is what makes the whole thing safe to change.

# Layer 1: the monorepo

A monorepo is just *many packages in one git repository*, wired so they can import each other without publishing to a registry. The opposite is the **polyrepo** (one repo per deployable), which is what most people start with.

```
polyrepo:     [ web-app repo ]   [ api repo ]   [ ui-library repo ]
              three repos, three CIs, version drift across them

monorepo:     ┌─ one repo ─────────────────────────────────────┐
              │ apps/web   api   packages/{ui, core, api-client}│
              │ one install · one CI · one version of each dep  │
              └────────────────────────────────────────────────┘
```

What you gain: **atomic cross-cutting changes** (rename a field in the contract and fix the app and the server in the *same commit*), shared code without a publish step, and one source of truth for versions. What you pay: the tooling is heavier, and you need discipline so the packages don't turn into a mud ball.

The concrete layout I use:

```
.
├── apps/
│   └── web/                 # the React SPA (+ src-tauri/ for native)
├── api/                     # the BFF (Hono on Bun)
├── packages/
│   ├── api-client/          # typed client + zod contracts  ← the seam
│   ├── core/                # shared hooks / domain types
│   └── ui/                  # design system (components + theme)
├── pnpm-workspace.yaml      # workspace globs + the shared version "catalog"
├── tsconfig.base.json       # one strict base config everyone extends
└── biome.json               # one linter/formatter for the whole repo
```

Two mechanics make this work in pnpm:

- **`workspace:*`** — `apps/web` depends on `"@template/ui": "workspace:*"`, so pnpm symlinks the local package instead of fetching from npm. Edit `ui`, the app sees it instantly.
- **the catalog** — `pnpm-workspace.yaml` holds a single `catalog:` block of versions. Every package references shared deps as `"react": "catalog:"`. The whole repo resolves to **one** version of React, one of Vite, one of TypeScript. No more "the app is on React 19.1 but the design system locked 19.0."

# Layer 2: the backend-for-frontend

This is the layer that feels new if you've only built SPAs that call the backend directly. A BFF is a thin server whose **only customer is your frontend**. The giveaway that it's a BFF and not a "real" backend: it owns **no database**. It exists to make life easier and safer for the client.

```
WITHOUT a BFF:
  SPA ───────────────────────────▶ backend
  • the browser holds API keys / knows backend quirks
  • CORS, auth, shaping all happen client-side or not at all

WITH a BFF:
  SPA ──▶ api (BFF) ──▶ backend / DB
                  └────▶ AI providers, payments, email, ...
  • secrets live server-side, never in the bundle
  • the BFF shapes ugly backend responses into clean client types
  • one place to do auth, sessions, rate limiting, caching
```

Why bother? Four reasons that show up fast in a real app:

1. **Secrets.** A browser can't hold an AI provider key or a payment secret. The BFF can. The app posts to `/api/ai/chat`; the BFF calls the model server-side and streams the result back.
2. **Shaping.** Real backends are messy (a field is `email_addr` in one place, paginated weirdly in another). The BFF normalizes all of that *once*, so the client only ever sees clean shapes.
3. **Auth & sessions.** The BFF can mint its own short-lived tokens, set httpOnly cookies, and be the single chokepoint for "is this request allowed."
4. **One origin.** Serve the SPA and the BFF from the same origin and your cookies are same-site, CSRF is simpler, and deep links work.

The critical design property: **keep the BFF stateless.** It owns no data; every handler is either a passthrough to the real backend or a transformation of one. Statelessness is what lets you run ten copies of it behind a load balancer later (more on that in scaling).

# Layer 3: the cross-platform client

The SPA is built once and runs in two kinds of host:

```
        one React bundle
        ┌──────────────┐
        │  apps/web     │
        └──────┬───────┘
       build   │   wrap
   ┌───────────┴───────────┐
   ▼                       ▼
[ browser ]          [ native webview ]
  web bundle          Tauri (desktop now,
  (GCS/CDN/static)     mobile when wired)
```

Tauri (or Electron, or Capacitor) wraps the *same* static bundle in a native shell. You don't fork the codebase per platform; you make the app **responsive** and isolate the few places that differ (secure storage, opening external links, deep-link handling) behind one module. In the template that module is `apps/web/src/lib/platform.ts` and it exposes `isTauri()` plus a couple of capability functions. The rule: **never scatter `isTauri()` checks through components**—add a capability to `platform.ts` instead.

# The glue: end-to-end type safety

This is the payoff that makes a monorepo worth the overhead. The request/response shapes live in **one package** (`api-client`), as zod schemas. Both the SPA and the BFF import them. So the types literally connect the two tiers:

```
packages/api-client/src/schemas.ts
        ┌─────────────────────────────┐
        │ export const TodoSchema =    │
        │   z.object({ id, title, … }) │
        │ export type Todo = z.infer<…>│
        └──────────────┬──────────────┘
        imports         │         imports
   ┌────────────────────┴────────────────────┐
   ▼                                          ▼
apps/web (uses Todo to render)        api (uses TodoSchema to validate)

Change the schema ──▶ BOTH sides stop type-checking until they agree.
A whole class of "frontend and backend disagree" bugs becomes a red build.
```

zod gives you both at once: a **runtime** validator (so a misbehaving backend fails loudly at the boundary instead of leaking `undefined` into your UI) and a **compile-time** type (via `z.infer`). One declaration, two guarantees. (If you want the contract *and* the transport generated for you, tRPC is the heavier-weight cousin of this pattern; plain zod + a thin client is the version you can read end-to-end.)

# How I built the template

I wanted a runnable reference for all of this—something you can `pnpm install && pnpm dev` with **zero external services**. The decisions, in order:

**Tooling: boring on purpose.** pnpm workspaces, Vite, Bun (BFF runtime), `tsc`, Biome, Playwright. The production app I was learning from uses bleeding-edge variants (a custom build CLI, a prerelease typechecker, an alternate linter). Great for them, wrong for a template—a template's job is to install cleanly on any machine for years. The *architecture* is identical; only the tools are tamer.

**Mock mode by default.** The BFF serves an in-memory store, and a `MOCK` flag (on unless you set `MOCK=false`) gates it. This is the single most important "easy to run" decision: no database, no API keys, no cloud login. You clone, install, and it works.

```
request lifecycle in the template (all local):

  browser            Vite dev (:5173)            BFF (:8787)
    │  GET /api/todos     │                          │
    │────────────────────▶│  proxy strips /api       │
    │                     │─────────────────────────▶│  store.list()
    │                     │                          │  (in-memory mock)
    │   200 [todos]       │        200 [todos]       │
    │◀────────────────────│◀─────────────────────────│
```

The Vite dev server proxies `/api` to the BFF, so the browser talks **same-origin** to `:5173`—exactly like the deployed unified service would behave. No CORS in dev, cookies stay same-site.

**What's in it.** Three demo surfaces, each illustrating one idea:

- **Todos** — full CRUD through the typed client, server-state cached with TanStack Query (one `queryOptions()` per read, shared by the route loader and the component so keys can't drift).
- **Chat** — the AI-gateway pattern: the browser posts messages, the BFF streams back tokens over Server-Sent Events. The "model" is canned text, so it needs no key—swap in a real provider call and the client contract is unchanged.
- **Health** — the simplest possible typed read, to show the seam end to end.

Plus the Tauri shell, a Dockerfile, a GitHub Actions CI workflow, and a Playwright suite that boots both servers and clicks through the real UI.

**Verifying it actually runs.** A template that doesn't build is worse than no template. So I ran the full gate—install, typecheck, lint, build—and then a live smoke test hitting every endpoint through the proxy, including the SSE stream. All green before I called it done. (This is a good habit generally: "it should work" and "I watched it work" are different claims.)

> Testing this shape is its own topic—each tier wants a different kind of test, and the typed contract turns out to be both a test target and your single mock boundary. I wrote it up separately: [Testing the Typesafe Full-Stack Monorepo](/blog/113_testing-the-typesafe-monorepo).

# Scaling it

Everything above is a weekend's worth of repo. The interesting question is what happens at 5 apps, 30 packages, and 8 engineers. Here's where each layer bends, and what you do about it.

## Scaling the workspace (more packages, more apps)

The monorepo grows by adding `packages/*` and `apps/*`. The danger is the dependency graph turning into spaghetti—`ui` importing `api-client` importing `web`, cycles everywhere. Keep the direction **acyclic and one-way**:

```
apps/*  ────▶  packages/feature-*  ────▶  packages/{ui, core, api-client}
   │                                              │
   └──────────────────────────────────────────────┘
        apps may use leaf packages directly;
        leaf packages NEVER import apps or feature packages.

enforce it, don't just hope:
  • ESLint/Biome "no-restricted-imports" or a boundaries rule
  • or a graph check in CI (e.g. dependency-cruiser) that fails on a cycle
```

The other workspace-scaling move is **splitting by bounded context** once a package gets fat: `ui` stays primitives; domain components live in `packages/feature-billing`, `feature-campaigns`, etc. Colocation beats a 400-file `components/` folder.

## Scaling the build (this is where it hurts first)

The first real pain isn't runtime—it's that `pnpm build` starts taking four minutes because it rebuilds everything every time. The fix is a **task graph with caching**: Turborepo or Nx. They model "task A depends on task B's output," run independent tasks in parallel, and—crucially—**skip work whose inputs didn't change**.

```
naive:   build api → build ui → build core → build web   (serial, always)

with a task runner + cache:
   core ─┐
   ui  ──┼─▶ web        only the affected subgraph runs;
   api ──┘                unchanged packages restore from cache (local + remote)

  touched only `ui`?  →  rebuild ui + web, restore api/core from cache
```

Pair that with **affected-only CI**: compute what changed since the base branch and test/build just that slice. With a **remote cache** shared across the team and CI, a colleague's untouched build restores in milliseconds. This single change is what keeps a 30-package monorepo's CI under a few minutes instead of half an hour.

## Scaling the contracts (type safety with many hands)

zod + a hand-written client is perfect at small scale. As the surface grows:

- **Split the schemas** by domain (`schemas/todos.ts`, `schemas/billing.ts`) and barrel them—one 2,000-line file is a merge-conflict factory.
- **Consider tRPC** if the BFF and the app are both yours and both TypeScript: it makes the client/transport disappear and gives you autocompletion for every procedure. The trade-off is coupling and a heavier abstraction.
- If the real backend is **not** TypeScript, generate types from its **OpenAPI/gRPC** schema at the BFF boundary, and keep hand-authored zod only for the BFF↔app seam. The BFF is the translation layer between "their contract" and "your clean contract."

The principle stays the same: **one source of truth per contract, imported by everyone who speaks it.**

## Scaling the BFF (the stateless payoff)

Because the BFF is stateless, you scale it the boring, reliable way: **run more copies behind a load balancer.** No instance owns anything, so any request can hit any instance.

```
            ┌──────────────────┐
            │   load balancer   │
            └───┬────┬────┬─────┘
                ▼    ▼    ▼
            [BFF] [BFF] [BFF]      ← horizontal scale: just add instances
                \   |   /
                 ▼  ▼  ▼
        ┌────────────────────────┐
        │ shared state goes HERE  │  Redis: sessions, rate-limit counters,
        │ (NOT in the BFF)        │  short-lived caches, pub/sub
        └────────────────────────┘
```

The moment you need something to outlive a single request—sessions, rate-limit windows, a cache, cross-instance messaging—it goes in a **shared store** (Redis/Memorystore), never in process memory. If you put a counter in a module variable, it works on one instance and silently breaks the moment you scale to two. Statelessness isn't a purity thing; it's the property that makes "add another instance" a non-event.

Other BFF scaling levers, in rough order of need: response caching for hot reads, request coalescing/batching to the real backend, circuit breakers so one slow upstream doesn't take the BFF down, and per-route rate limits.

## Scaling deployment

The template serves the SPA and BFF as **one origin** (the BFF serves the built static bundle). That's the right default—same-site cookies, simple CSRF, working deep links. You split them only when you have a reason:

```
start here (unified):          split later (when justified):
  ┌────────────────────┐         [ CDN edge ] ── static SPA bundle
  │ one service:        │         [ BFF service ] ── API only
  │ BFF + bundled SPA   │              │
  └────────────────────┘         (split for independent scaling, an
   one origin, simplest          edge-cached SPA, or separate deploy
                                  cadences — at the cost of cross-site
                                  cookie/CORS handling you must now solve)
```

Native apps scale on a *different* axis: they ship as signed binaries through an updater channel, versioned separately from the web deploy. The same `apps/web` source, two release pipelines.

## Scaling the team

Tooling scales the machine; conventions scale the humans.

- **CODEOWNERS** per package, so changes route to the right reviewers automatically.
- **Boundaries as lint rules**, not tribal knowledge—the dependency direction above should be *enforced*, so a new hire physically can't import `apps/web` from `packages/ui`.
- **One linter/formatter for the whole repo** (Biome here) so there's never a style debate in review.
- **A short per-package `CLAUDE.md`/`README`** stating that package's charter ("ui is primitives, immutable; api owns no DB"). Cheap to write, saves a hundred "where does this go?" Slacks.

# When NOT to reach for this

The honest section. This shape has real overhead, and it's overkill when:

- **It's one small app with no second client and no secrets to hide.** A plain Vite SPA calling your backend is fine. Don't add a BFF to feel architectural.
- **You'll never ship native.** Then "cross-platform via Tauri" is dead weight; drop that leg.
- **The teams are truly independent** with separate release cadences and no shared code—polyrepos with a published component library may serve them better than forcing everyone into one tree.

The combination earns its keep when you have **more than one client**, **secrets or shaping the browser shouldn't do**, and **shared code you want changed atomically**. That's exactly when a single SPA stops being enough—and it's why the pattern looks unfamiliar at first: you usually meet it right at the moment your old structure ran out.

# Takeaways

- A "weird" full-stack repo is usually just **monorepo + BFF + cross-platform client**, glued by **end-to-end typed contracts**. None of the pieces is exotic; the *combination* is the thing to learn.
- The load-bearing rules are simple: **one-way dependency direction**, **the app only talks to the BFF**, **the BFF owns no data**, **one source of truth per contract**, and **cross-env code lives in one module**.
- It scales along predictable axes: a **task runner + remote cache** for builds, **horizontal instances + a shared store** for the BFF, **enforced boundaries + CODEOWNERS** for the team.
- Build a tiny runnable version before you commit to it—mock mode, zero external services, and *watch it run*. Understanding the shape in your hands beats reading ten diagrams (even good ones).
