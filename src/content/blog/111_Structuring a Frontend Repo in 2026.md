---
title: "Structuring a Frontend Repo in 2026: Server State, Client State, and Everything Around It"
description: "A practical, opinionated tour of how to structure a scalable React codebase in 2026—domain-driven folders, typed file-based routing, the SWR/Zustand state split, a validated API boundary, shadcn component layers, and the concepts that keep it all from rotting."
category: ["frontend", "react", "concept", "typescript"]
pubDate: "2026-06-12"
published: true
---

## Table of contents

# Introduction

A frontend codebase doesn't usually die from a bad framework choice. It dies from a thousand small decisions made inconsistently: where does this component go, who owns this piece of state, how do we fetch data, what happens when the API returns something unexpected. Multiply that by a growing team and a few years, and you get the dreaded "nobody knows where anything is" repo.

This article is the structure I'd reach for in 2026, based on building and scaling a real React app. It's opinionated on purpose—**consistency beats cleverness** at scale. I'll walk the stack the way it actually layers up:

- **React 19 + TypeScript + Vite** as the base.
- **TanStack Router** for typed, file-based routing.
- **SWR** for server state, **Zustand** for client state (the single most important split in the whole app).
- A **domain-driven API layer** with a centralized client and **Zod** validation at the boundary.
- **React Hook Form + Zod** for forms.
- **shadcn/ui + Tailwind** for styling, organized into clear component layers.
- **Biome** for lint/format, and a layered testing strategy.

The throughline is *scalability*: every choice below is about making the codebase navigable, predictable, and safe to change when there are many hands in it.

# The stack at a glance

```
React 19 + TypeScript          UI + type safety
Vite                            build / dev server
TanStack Router                 typed, file-based routing
SWR                             server state (data fetching + cache)
Zustand                         client state (UI/ephemeral)
Zod                             runtime validation (the wire contract)
React Hook Form                 forms
Tailwind + shadcn/ui            styling + component primitives
Biome                           lint + format
Vitest / Testing Library / MSW / Playwright   testing
```

None of these are exotic in 2026—that's the point. The value isn't in picking rare tools; it's in **how you wire the common ones together.**

# Domain-driven folder structure

The first scalability decision is *colocation*. Organize by **domain/feature**, not by file type. A `components/` folder with 400 files is a graveyard; a `campaign/` folder that holds everything about campaigns is a map.

A structure that scales:

```
src/
  api/                 # one folder per domain
    campaign/
      campaign.ts        # raw API functions
      useCampaign.ts     # SWR hooks
      types.ts           # Zod schemas + inferred types
    billing/
    auth/
    api.ts             # the single API client (Result pattern)
  components/
    ui/                # design-system primitives (shadcn) — immutable
    blocks/            # compound components composed from ui/
    ...                # genuinely reusable app components
  routes/              # file-based routes (TanStack Router)
  lib/
    stores/            # Zustand stores (client state)
    utils.ts, hooks/, validation/
  context/             # React context providers
```

Two rules make this hold up:

1. **A domain owns its types, its raw API calls, and its hooks—together.** When you change the billing API, everything that needs to change is in `api/billing/`.
2. **The closer code lives to where it's used, the better.** Truly reusable things go up the tree; one-off things stay local (more on that below).

# Typed, file-based routing with TanStack Router

File-based routing means your URL structure *is* your folder structure—self-documenting and impossible to drift. TanStack Router adds full **type safety**: params, search params, and navigation are all typed, so a typo in a route is a compile error, not a runtime 404.

Two patterns worth adopting:

**Code-split by route.** Use a `.lazy.tsx` suffix (or your router's equivalent) so each route ships its own chunk. The user downloads the dashboard code when they visit the dashboard—not on first load. This is one of the highest-leverage performance wins and it's basically free with file-based routing.

**Colocate route-local code with a sigil.** Anything that belongs to exactly one route—components, utils—lives next to it in a folder the router ignores. A common convention is a `-` prefix:

```
routes/
  campaign/
    $campaignId.lazy.tsx
    -components/        # only used by this route, router ignores the `-`
      campaign-header.tsx
    -utils/
      campaign-math.ts
```

This is the antidote to the bloated global `components/` folder: most components aren't reusable, so don't pretend they are. Keep them local until a second consumer actually appears.

# The big idea: server state vs client state

If you take one architectural concept from this article, make it this: **server state and client state are different things and must be owned by different tools.**

- **Server state** is data that lives on the server and you cache locally: the current user, a list of invoices, a campaign. It's *asynchronous, shared, and can go stale.* It needs caching, revalidation, deduplication, and loading/error states.
- **Client state** is ephemeral UI state that only the browser cares about: is the sidebar collapsed, what's in this multi-step form draft, which tab is active. It's *synchronous and local.*

The classic mistake is jamming server data into a global client store (the old "fetch in a thunk, dump into Redux" pattern). That forces you to hand-manage caching, staleness, and refetching—badly. In 2026 you let a **data-fetching library own server state** and a **lightweight store own client state**.

## Server state: SWR

SWR (stale-while-revalidate) owns everything that comes from the network. The pattern is a thin hook per resource:

```ts
// api/campaign/useCampaign.ts
export function useCampaign(id: string | undefined) {
  return useSWR(
    id ? `/v2/campaign/${id}` : null,         // null key = don't fetch yet
    async (url) => {
      const result = await api.get<Campaign>(url);
      if (!result.ok) throw result.error;      // bridge Result -> SWR error
      return result.data;
    },
  );
}
```

```tsx
// in a component
const { data: campaign, error, isLoading, mutate } = useCampaign(id);
```

A few conventions that keep this consistent across a big team:

- **Name hooks `use<Domain><Entity>`** (`useCampaign`, `useBillingSummary`). Predictable names mean you can guess the hook before you find it.
- **Never call raw API functions from components**—always go through a hook. The hook is the cache boundary.
- **Configure globally** in one place: `revalidateOnFocus: false` (don't refetch on every tab switch), a `dedupingInterval` (collapse duplicate requests in a short window), `shouldRetryOnError: false` (let the error surface). These three settings alone prevent a lot of request storms.
- **A `null` key disables the fetch**, which is how you handle "don't fetch until I have an id"—cleaner than wrapping the hook in conditionals.

## Client state: Zustand

For the genuinely-local stuff, Zustand is a tiny store with no boilerplate and no provider tree:

```ts
// lib/stores/useSidebarStore.ts
export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      collapsed: false,
      setCollapsed: (collapsed) => set({ collapsed }),
    }),
    { name: "sidebar-storage" },   // persists to localStorage
  ),
);
```

Reach for Zustand for: auth/session UI state, sidebar/layout toggles, multi-step form drafts, cross-component ephemeral state. The `persist` middleware handles "remember this across reloads" for free.

A bonus: because a Zustand store is just a function with `getState()`, it's **trivially testable** without rendering anything.

**The boundary to hold:** if data came from the server, SWR owns it—don't copy it into Zustand. If it's UI/ephemeral, Zustand owns it—don't fake it through a data hook. Cross that line consistently and a huge class of "why is this stale / out of sync" bugs simply never happens.

# A validated API boundary

Here's a truth that bites every TypeScript codebase eventually: **`as Campaign` is a lie.** TypeScript types are erased at runtime; the server can send anything, and your beautiful types won't save you. At scale, with multiple backends evolving independently, you want runtime validation at the edge.

Two pieces make this robust:

**1. A single API client with a `Result` type.** Instead of throwing everywhere, return an explicit success-or-error value (Rust/Go style). It forces callers to handle both paths:

```ts
type Result<T, E = ApiError> =
  | { ok: true; data: T }
  | { ok: false; error: E };

const result = await api.post<Campaign>("/v2/campaign", body);
if (!result.ok) {
  toast.error(result.error.message); // always the best available copy
  return;
}
useCampaign(result.data.id);
```

Centralize the cross-cutting concerns here: auth header injection, 401 handling, error normalization. Every request goes through one place, so behavior is consistent and changes are one-line.

**2. Parse responses with Zod.** Define the schema once; infer the type from it; validate at the boundary:

```ts
export const CampaignSchema = z.object({
  token: z.string(),
  status: z.enum(["DRAFT", "ACTIVE", "PAUSED"]),
  amount: z.number(),
});
export type Campaign = z.infer<typeof CampaignSchema>;

// in the fetcher: validate, don't assume
return parseResponse(result, CampaignSchema, { endpoint: "GET /campaign" });
```

When the wire shape drifts, you get a loud, traceable `schema_validation_failed` error pointing at the exact field—instead of `undefined is not a function` three components deep. The schema becomes the single source of truth for both the runtime contract *and* the static type.

# Forms: React Hook Form + Zod

Forms are their own little state machine, and RHF + Zod is the 2026 default. The schema validates; RHF manages fields, dirty state, and submission:

```tsx
const form = useForm({
  resolver: zodResolver(CampaignSchema),
  defaultValues: { name: "" },
});
```

One TypeScript-specific gotcha worth internalizing: RHF's `formState` is a **Proxy**. You must *destructure* the fields you care about to subscribe to them—`const { isDirty } = form.formState`. Reading `form.formState.isDirty` inline won't trigger re-renders. It trips up everyone once.

# Styling and the component hierarchy

Styling in 2026 is **Tailwind + shadcn/ui**, and the important part isn't the CSS—it's how you *organize* components so the design system stays coherent.

The decision tree I use, from most to least reusable:

1. **`components/ui/` — the design-system primitives (shadcn).** Treat these as **immutable**. You install them with the CLI and they stay close to upstream so you can pull updates. *Never* edit a primitive to fix one call site—fix the call site. The moment you fork a primitive, you've lost the ability to update it and you've created a snowflake.
2. **`components/blocks/` — compound components composed from primitives.** A `MultiSelect` built from Popover + Command + Checkbox. A `SubmissionButton` that wraps Button with a loading state. These are *your* reusable patterns.
3. **`components/` — genuinely app-wide reusable components.**
4. **`routes/.../-components/` — route-local.** If it's used in one place, it lives in one place.

The mistake at scale is dumping everything into a flat `components/` folder and editing the shadcn primitives directly. Keep the layers distinct and the "where does this go?" question answers itself.

# The supporting cast: charts, toasts, tables, and friends

Beyond the core, a real app leans on a handful of focused libraries. The scalability rule here is boring but crucial: **pick exactly one library per concern and use it everywhere.** Three charting libraries in one repo is how you end up with three visual languages and a pile of duplicate vendor code.

The 2026 shortlist I reach for:

- **Charts — Recharts.** Composable, declarative React charts (`<LineChart>`, `<Bar>`, `<Tooltip>`). It reads like the rest of your JSX and you can feed it your design tokens so charts match the UI—good enough for the vast majority of dashboards without dropping down to raw D3.
- **Toasts / notifications — Sonner.** A tiny, beautiful toast system. The trick is to wire it to your `Result`-returning API client so every failed request has *one* consistent surface: `if (!result.ok) toast.error(result.error.message)`. One toast library, one place errors appear, zero bespoke notification components scattered around.
- **Forms — React Hook Form + Zod** (covered above). One form library, one validation library, one resolver tying them together.
- **Tables — TanStack Table.** *Headless* table logic—sorting, filtering, pagination—that you render with your own shadcn components. Headless is the right call at scale: the library owns the hard logic, you own the markup and styling.
- **Long lists — TanStack Virtual.** Virtualize anything with hundreds+ of rows so you render only what's on screen. It's the difference between a janky 5,000-row list and a smooth one.
- **Icons — Lucide.** One consistent, tree-shakeable icon set, imported per icon.
- **Command palette / fuzzy menus — cmdk.** Powers ⌘K-style searchable menus (and shadcn's combobox).
- **Dates — date-fns** (with a UTC variant for timezone-safe math). Small, functional, tree-shakeable—no more dragging in all of Moment.
- **Animation — Motion** (formerly Framer Motion) for declarative transitions when you need polish.

The meta-point isn't the specific picks—it's the **"one dependency per concern, used consistently"** rule. The payoff is that nobody ever has to ask "which chart/toast/table library do we use here?"—and your bundle isn't carrying three answers.

# Type safety, end to end

Scalability is, in large part, *change safety*—how confidently can you refactor without breaking things you can't see? TypeScript is the backbone, but a few practices amplify it:

- **Strict mode on, `any` banned** (prefer `unknown` and narrow). `any` is a hole in the type system that quietly spreads.
- **Infer types from runtime schemas** (Zod) rather than hand-writing interfaces that drift from reality.
- **Typed routes** (TanStack Router) so navigation and params are checked.
- **Nominal IDs** where it matters—branding token types so you can't pass an `advertiserId` where a `campaignId` is expected.

The compiler becomes a refactoring assistant: rename a field in the schema and TypeScript walks you to every consumer.

# Cross-cutting concerns

A scalable repo also has clear homes for the things that touch everything:

- **Environment config in one module.** A single `config.ts` that reads env vars and exposes typed values (API base URL, keys, current mode). Everything imports from there—no `import.meta.env` scattered across the app.
- **Feature flags** for safe, gradual rollout. New surfaces ship behind a flag and get turned on per-tenant; you decouple deploy from release.
- **Error boundaries** at the route and root level, wired to your monitoring, so a crash in one subtree degrades gracefully instead of whitescreening the app.
- **Observability** (error tracking, session replay, analytics) initialized once at the entry point.
- **Auth** that keeps the short-lived access token *in memory* and the refresh token in an HttpOnly cookie—more secure than localStorage, though it has implications for testing (see the note below).

# Testing fits the structure

I won't repeat my [full testing strategy](/blog) here, but it maps cleanly onto this architecture:

- **Unit tests** for the pure stuff: schemas, formatters, store logic, the `Result` mapping.
- **Integration tests** for the middle: render components with a providers helper, exercise SWR hooks against a mocked network (MSW), test forms.
- **E2E tests** for the few critical journeys, in a real browser.

The structure *enables* the testing: because server state lives in hooks, you can test those hooks in isolation; because client state lives in plain Zustand stores, you can test them via `getState()`; because the API client is centralized, you test error handling once. A well-structured repo is a testable repo.

(One real-world tie-in: the in-memory-token auth approach above means E2E can't just restore a saved session—you log in fresh per test worker. The architecture decision and the test design are connected; they usually are.)

# Tooling and DX

The unglamorous layer that keeps everything consistent:

- **Biome** for lint + format in one fast tool (replacing the ESLint + Prettier combo). Tab vs spaces, import sorting, Tailwind class ordering—decided once, enforced automatically, zero debate.
- **A fast package manager / runtime** (Bun, pnpm) and **Vite** for instant dev startup and HMR.
- **A pre-merge check** that runs lint + typecheck + the test suite, so `main` stays green without anyone policing it.

DX isn't a luxury at scale—it's what keeps a large team moving without stepping on each other.

# Scalability principles, distilled

Pulling the threads together, the concepts that actually keep a frontend repo healthy as it grows:

1. **Colocation by domain.** Everything about a feature lives together; reusability earns its way *up* the tree, it isn't assumed.
2. **One owner per kind of state.** SWR owns server state; Zustand owns client state. Never duplicate across the line.
3. **Validate at the boundary.** Types are erased at runtime—Zod + a `Result`-returning client turn "mystery undefined" into a precise, traceable error.
4. **Immutable design-system primitives.** Compose, don't fork. Fix the call site, not the primitive.
5. **Type safety as change-safety.** Strict TS, schema-inferred types, typed routes—so the compiler guides refactors.
6. **Consistency over cleverness.** Predictable names, predictable folders, conventions written down. A new contributor (or an AI agent) should be able to guess where things are.
7. **Structure that's testable by design.** Hooks, plain stores, a centralized client—each is independently verifiable.

The framework wars are mostly over; in 2026 the differentiator isn't *which* tools you use, it's *how disciplined you are about the seams between them.* Get the boundaries right—server vs client state, validated vs assumed data, reusable vs local components—and the codebase stays navigable no matter how big it gets.
