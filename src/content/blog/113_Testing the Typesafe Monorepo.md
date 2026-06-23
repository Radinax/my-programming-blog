---
title: "Testing the Typesafe Full-Stack Monorepo: What to Test in Each Layer"
description: "A monorepo + BFF + cross-platform client doesn't just shape how you build—it shapes how you test. Which package gets which kind of test, why the typed contract is both a test target and your single mock boundary, how to set up per-package test environments, and the fixture trick that makes end-to-end runs fast and deterministic—with examples from building the whole thing from scratch."
category: ["test", "typescript", "react", "concept", "system-design", "tanstack", "end-to-end"]
pubDate: "2026-06-23"
published: true
---

## Table of contents

# Introduction

In the [previous article](/blog/112_the-typesafe-fullstack-monorepo) I broke down the shape of a *typesafe full-stack monorepo*: a single React app that ships to web and native, a stateless backend-for-frontend (BFF) it talks to through a typed client, and a set of shared packages, all glued by zod contracts. Building it is one thing. The question I want to answer here is the one that decides whether the thing survives contact with a real team: **how do you test it?**

There's a general testing-strategy article ([110](/blog/110_a-practical-testing-strategy-for-2026)) that covers the toolkit—Vitest, Testing Library, MSW, Playwright—and the pyramid. I'm not going to re-explain those. This article is narrower and more interesting: **the architecture tells you what to test, and where.** Each tier of the shape has a natural kind of test. The typed contract that holds the tiers together turns out to be both a thing you test *and* the single seam you mock. And a monorepo has its own setup quirks—per-package environments, one shared test runner version, a CI gate that spans everything.

I learned this the way you'd hope: by adding a testing foundation to one of these repos from zero, package by package, until every layer had the right kind of coverage. The lessons below are the ones that actually mattered.

> A note on naming, same as last time: the real codebase uses bleeding-edge tooling (a custom build CLI, a prerelease typechecker, an alternate test runner). For a teachable version I'll use the boring, portable stack—**Vitest, happy-dom, Testing Library, MSW, Playwright**—and the generic layout from the template (`apps/web`, `api`, `packages/{ui, core, api-client}`). The *strategy* is identical; only the tool names are tamer.

# The shape, as a test map

Here's the three-tier shape from the last article, but annotated with the kind of test that guards each part:

```
┌───────────────────────────────────────────────────────────────┐
│  apps/web — React SPA                                           │
│  • pure logic (money math, query keys)   → UNIT (node)          │
│  • components, wizards, forms             → COMPONENT (DOM+MSW)  │
└───────────────────────────┬───────────────────────────────────┘
                            │  packages/api-client (zod contracts)
                            │  → SCHEMA tests + the MOCK BOUNDARY
┌───────────────────────────▼───────────────────────────────────┐
│  api — Backend-for-Frontend                                     │
│  • handlers, shaping, auth                → UNIT (node)          │
│  • fixture mode (no real backend)         → powers E2E           │
└───────────────────────────┬───────────────────────────────────┘
                            │
                   ┌─────────▼─────────┐
                   │  E2E (Playwright)  │  the whole thing, in a real
                   │  fixture mode      │  browser, no network
                   └────────────────────┘
```

Read it top to bottom and a strategy falls out:

- **Pure logic** (the calculations, the key factories, the state machines) gets cheap, fast **unit tests** in a node environment—no DOM, no providers.
- **Anything that renders**—components, wizards, forms—gets **component tests** in a DOM environment, with the network mocked at the contract seam.
- **The contract package itself** gets **schema tests**, and doubles as the one place every component test mocks.
- **The BFF** gets node-env handler tests, and its **fixture mode** is what makes end-to-end testing cheap.
- **The whole journey** gets a thin layer of **end-to-end tests** in a real browser, driven entirely off fixtures.

The rest of the article is just that map, filled in.

# The contract is the spine

Before the layers, the thing that makes testing this shape *pleasant*: the typed contract in `packages/api-client`. In the build article it was the glue. In testing it does double duty.

**It's a test target.** The schemas are runtime validators, so they have behavior worth pinning: defaults, optional fields, lenient parsing for messy backends, discriminated unions. These are pure and node-testable, no setup at all:

```ts
// packages/api-client/src/schemas.test.ts
import { UserSchema, SessionSchema } from "./schemas";

it("applies its nullable defaults and validates the email", () => {
  const u = UserSchema.parse({ id: "u1", email: "a@b.com", role: "member" });
  expect(u).toMatchObject({ name: null, avatarUrl: null, isAgilityUser: false });
  expect(() => UserSchema.parse({ id: "u1", email: "nope", role: "member" })).toThrow();
});

it("distinguishes a web session (cookie, no tokens) from native (tokens present)", () => {
  expect(SessionSchema.parse({ user }).tokens).toBeUndefined();
  expect(SessionSchema.parse({ user, tokens }).tokens?.accessToken).toBe("…");
});
```

That looks trivial until a backend you don't control quietly renames a field or starts sending a status string nobody documented. A **lenient** schema (`z.looseObject`, or a plain `z.string()` for a drift-prone enum) is a *decision*, and a test is where you record that decision so a future "tighten everything" refactor can't silently break the round-trip.

**It's also the mock boundary.** This is the part people miss. Because the app only ever talks to the BFF through this typed client, there is exactly **one** place to intercept the network in tests: the HTTP boundary the client hits. You don't stub the client (that tests your stub); you let the real client run and mock the wire underneath it with MSW.

```
component  →  apiClient (REAL)  →  fetch  ──╳── MSW handler  (mocked here)
                                            the ONE seam
```

One seam means your component tests exercise the real serialization, the real error mapping, the real retry logic—everything except the actual server. And it pays a second dividend: run MSW with `onUnhandledRequest: "error"` and any *accidental* network call—a component that fetches something you didn't expect—fails the test loudly instead of hanging or hitting a real service.

The deeper payoff is the one from the build article made testable. A contract change red-builds the types on both sides *and* the tests catch the behavior change. Rename a field in one commit; the app and the BFF stop type-checking until they agree, and the tests tell you what broke. That's the atomic cross-cutting change the monorepo promised—now with a safety net.

# Per-package setup (the monorepo part)

A monorepo doesn't get one test config; it gets one *per package*, because the packages run in different worlds. The BFF and the pure-logic packages are **node** code. The UI package and the app render the **DOM**. So:

```
api/             → vitest, environment: "node"
packages/core/   → vitest, environment: "node"   (framework-light logic)
packages/api-client/ → vitest, environment: "node"   (zod, no DOM)
packages/ui/     → vitest, environment: "happy-dom" + Testing Library
apps/web/        → vitest, environment: "happy-dom" + Testing Library + a setup file
```

Three things make this sane in a workspace:

**One runner version, via the catalog.** Same trick as every other shared dep: `"vitest": "catalog:"` in each package. The whole repo runs *one* version of the test runner. You never debug a "passes in `ui`, fails in `web`" that turns out to be two Vitest minors.

**Co-locate tests, run them per-package and repo-wide.** A test sits next to the file it covers (`button.tsx` ↔ `button.test.tsx`). Each package has a `"test"` script; the root runs them all (`pnpm -r test`). When you're working in one package you run just that one—fast.

**The DOM environment is a deliberate setup, not a default.** This bit me, so I'll save you the hour: a bare workspace package has *no* DOM. Standing one up means picking `happy-dom`, wiring a `setupFiles` that registers jest-dom matchers and cleans up between tests, and—if your package runs with `globals: false`—importing `test`/`expect` explicitly. It's a one-time cost per DOM package, but it's a real one. Don't assume `render()` just works because it works in the app.

```ts
// apps/web/src/test/setup.ts — loaded via vite/vitest's setupFiles
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(cleanup); // explicit, because we run with globals: false
```

# Layer by layer

## `packages/core` — pure logic, no React

The framework-light package holds the logic that's reused everywhere: domain helpers, and the session lifecycle. It's the highest-leverage place to test because it's pure—and because a regression here ripples through every screen.

The session manager is the poster child. In the build article it was "a plain class, no React, so it's testable." Here's what "so it's testable" buys you. The class takes its dependencies by injection—the API client, the token store, and crucially a **scheduler**—so a test can drive time deterministically without real timers:

```ts
// a captured-timer scheduler → proactive refresh is deterministic, no fake timers
function makeScheduler() {
  const timers: Array<() => void> = [];
  return { set: (fn) => timers.push(fn), clear: () => {}, runLast: () => timers.at(-1)?.() };
}

it("schedules a proactive refresh and runs it when the timer fires", async () => {
  const { manager, client, scheduler } = makeManager({ mode: "native" });
  await manager.login({ email: "a@b.com", password: "secret123" });
  scheduler.runLast();                              // simulate the timer firing
  expect(client.auth.refresh).toHaveBeenCalledOnce();
});
```

No DOM, no React, no `vi.useFakeTimers`. You stub the client and store, inject a fake scheduler, and assert the lifecycle: login persists and schedules a refresh, a 401 dedupes concurrent refreshes into one, a dead refresh clears the session. That a class is *designed* for this—dependencies in, no hidden globals—is the thing to copy, not the specific tests.

## `packages/api-client` — the contract (covered above)

Schema tests, node env. The one extra monorepo note: keep the schemas split by domain as they grow (`schemas/billing.ts`, `schemas/auth.ts`) so the test files split with them. One 2,000-line schema file is a merge-conflict factory, and so is its test.

## `packages/ui` — components, but only the ones that *do* something

The design system is reused on every route, so a break here is maximally expensive. But most of a shadcn-style system is presentational passthrough—wrapping a primitive with classes. Testing that a `<Badge>` renders its children is theater.

So the rule I landed on: **test the behavior-bearing primitives, skip the passthroughs.** The button that composes via a `Slot` and forwards clicks unless disabled. The form-error component with real logic (de-dupe messages, render one bare vs. many as a list, render nothing when empty). The native select that has to wire `value`/`onChange`/`disabled` through. Those have logic that hurts when it breaks:

```tsx
it("de-duplicates repeated messages down to a single bare message", () => {
  render(<FieldError errors={[{ message: "Required" }, { message: "Required" }]} />);
  expect(screen.getByRole("alert")).toHaveTextContent("Required");
  expect(screen.queryAllByRole("listitem")).toHaveLength(0); // not a list
});
```

What I *didn't* test: anything built on a portal + positioner (popovers, comboboxes, dropdowns from a headless library). They don't render meaningfully in happy-dom, and asserting on them tests the library, not your usage. Those get covered by the E2E layer, in a real browser, or not at all. Knowing what to skip is half of "confidence, not friction."

## `apps/web` — the app, where the layers meet

Three kinds of test live here, in rough order of value-per-effort.

**Pure app logic** that happens to live in the app: the money math, the query-key factory. The key factory is worth a special mention—if you keep your TanStack Query layer pure (the `queryOptions()` factories don't import your auth module), it stays node-testable, and you can pin the thing that silently breaks: the exact key tuples (so a loader and a component dedupe), and that prefix-invalidation actually matches.

```ts
it("the *All prefix is a genuine prefix of the scoped key", () => {
  const all = keys.campaignsAll;                 // ["campaigns"]
  const scoped = keys.campaigns("advertiser-1"); // ["campaigns", "advertiser-1"]
  expect(scoped.slice(0, all.length)).toEqual([...all]); // invalidation can't miss
});
```

**Component and wizard tests** with a shared render helper. The single most important piece of app-test infrastructure is a `renderWithProviders` that wraps your component in the *real* provider stack the app mounts—Query client, auth, tooltip, an in-memory router—so the component behaves like it does in production. Build it once; every test imports it. (Article 110 has the full helper; the point here is that in a monorepo it lives in the app package and is the app's public test surface.) With that plus MSW at the contract seam, you can drive a whole wizard:

```tsx
it("creates the audience and navigates to the library", async () => {
  const user = userEvent.setup();
  const { router } = renderWithProviders(<AudienceWizard />);
  await user.type(screen.getByPlaceholderText(/describe/i), "people searching for trail running shoes");
  await user.click(screen.getByRole("button", { name: /draft/i }));
  // …name it, submit, assert it landed in the store and the route changed.
  await waitFor(() => expect(router.state.location.pathname).toBe("/audiences"));
});
```

**The form-submit-through-MSW test** is where the contract seam earns its keep in the app. A form that writes optimistically *and* fires a real mutation through the client crosses the wire; mock that one `PUT`/`POST` with MSW and assert it fired:

```tsx
server.use(http.put("*/api/v1/campaigns/:id", ({ params }) => { put(params.id); return HttpResponse.json(campaign); }));
// …fill the (pre-hydrated) edit form, submit…
await waitFor(() => expect(put).toHaveBeenCalledWith("cmp-1")); // the wiring is real
```

That test is the regression net for the day the mock store gets swapped for the real backend: the wiring is already asserted.

## `api` — the BFF, and the anti-drift loop

The BFF is node code, so its tests are ordinary node tests: a handler shapes a messy upstream response into a clean client type; auth mints and validates a token; an error maps to the canonical envelope. Nothing exotic.

The interesting part is **fixture mode**. The BFF can run against an in-memory fixture store instead of the real backend (a flag flips it). That one capability does two jobs:

```
            ┌── contract test ──┐         the SAME fixtures feed both,
  fixtures ─┤                   ├─ so a fixture that drifts from the
            └── E2E (browser) ──┘         schema breaks the contract test,
                                          and the E2E that relies on it.
```

The same curated fixtures that the BFF's contract test validates are the ones the browser sees in E2E. If a fixture drifts out of shape, the contract test goes red *before* the E2E mysteriously fails. It's a cheap anti-drift loop that you get for free once the BFF can serve fixtures.

## End-to-end — the whole thing, on fixtures

The top of the pyramid is thin on purpose: a handful of critical journeys, in a real browser, driven entirely off fixtures so there's no network, no real backend, no flake from someone else's staging environment. The harness boots the BFF in fixture mode and the SPA dev server, and Playwright clicks through the real UI.

```
Playwright ─▶ SPA (dev) ─▶ /api proxy ─▶ BFF (fixture mode) ─▶ in-memory fixtures
   real browser            same-origin              no kahe / no cloud / no AI
```

A journey reads like a user story: sign in (a backend-free demo sign-in), land on the dashboard, navigate to a feature, complete it, assert the result rendered. Three things I learned running these for real, none of which a component test can teach you:

- **Reset state between tests.** The fixture store has a reset endpoint; hit it in `beforeEach` so every run starts from the same seeded slate. (Article 110's "every test self-cleans" rule, applied to the fixture store.)
- **The real browser surfaces real overlaps.** A dev-only debug panel mounted at max z-index *intercepted a click* on a primary button—something happy-dom would never catch, because happy-dom has no z-index. Removing the dev overlay before the click is a one-liner, but you only find the problem in a browser.
- **`getByText` is a substring, case-insensitive match.** A label and a footnote that both contain "Effective CPM" resolve to two nodes and fail Playwright's strict mode. Scope to the region and match exactly. (And: a click on a submit button inside a portal-mounted sheet sometimes doesn't submit the form under the headless engine—submit the form directly instead.)

The division of labor with the unit layer matters here: the **unit tests pin the arithmetic** (the budget math, to the dollar), and the **E2E proves it renders through the real path**. The E2E intentionally checks *presence*, not the exact computed number—a wrong-but-nonzero number is the unit test's job to catch. Each layer does the thing it's good at, and you don't pay for the same assertion twice.

# Why the shape makes testing *easier*

It's worth saying plainly, because it's the reason the overhead of the architecture pays off:

1. **One mock boundary.** Every component test in the entire app mocks the same place—the contract seam. You write the MSW setup once and reuse it everywhere; there's no per-feature decision about "how do we fake the network here."
2. **Atomic changes stay safe.** The contract change that red-builds both tiers is *also* the change your tests cover. You refactor across the front and back in one commit and the safety net spans both.
3. **Fixtures make E2E cheap and honest.** No backend to stand up, no flaky shared environment, deterministic data. The same fixtures guard the contract. E2E goes from "the suite we're scared to run" to "3 seconds, green."
4. **Per-package isolation = fast feedback.** Working in `core`? Run `core`'s node tests in a second. The DOM env only spins up for the packages that need it. You're never waiting on the whole repo to check one pure function.

# Wiring it into CI (and the one rule that keeps it alive)

The gate is the same one the build article ended on, with tests slotted in: lint/format, typecheck across every package, the test suites, and the web build. One pipeline, the whole tree.

```
on PR:  format+lint  →  typecheck (-r)  →  test (-r)  →  build web  →  E2E (fixtures)
        (one linter)    (the real gate)   (per pkg)                     (critical journeys)
```

At scale you make it *affected-only*—compute what changed since the base branch and test just that slice, with a remote cache so an untouched package restores instantly (the task-runner story from the build article). A 30-package monorepo's CI stays under a few minutes.

But the rule that actually keeps coverage from rotting isn't a tool—it's a standing expectation written into the repo's guide: **every PR ships with tests for the important behavior it touches.** Not a coverage percentage (those measure lines, not confidence, and they turn into a number people game). Just: if you added logic, a component, or a flow, the parts that would hurt if they broke have a test. "Important" means *blast radius*—money math, auth, the wizards users actually complete, the shared primitives reused on every route—not line count. That sentence, plus a CI job that's honest (no `--passWithNoTests` quietly going green on a thousand untested lines), does more than any gate.

# Takeaways

- The architecture *is* the test plan. **Pure logic → node units; anything that renders → DOM component tests; the contract → schema tests; the whole journey → fixture-mode E2E.** You don't decide test types feature by feature; the layer decides.
- The typed contract is the spine: a **test target** (defaults, lenient parsing, unions) and the **single mock boundary** (MSW at the BFF seam, with `onUnhandledRequest: "error"` to catch stray calls). One seam to mock, everywhere.
- A monorepo needs **per-package test environments** (node vs. happy-dom), **one runner version via the catalog**, and a deliberately-stood-up DOM env—it isn't free.
- Design for testability at the source: a **plain class with injected dependencies** (client, store, a fake scheduler) beats a hook you can only test through a render.
- **Fixture mode** is the quiet hero: it powers fast, deterministic E2E *and* an anti-drift loop where the same fixtures guard the contract.
- Let each layer do its job: **units pin the math, E2E proves it renders.** Don't assert the same thing twice, and don't chase a coverage number—chase confidence on the paths with real blast radius.
