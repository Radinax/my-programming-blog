---
title: "Using AI in 2026: In Your Repos, and In Your Product"
description: "Two different jobs that both say 'AI': using a coding agent to build and maintain a repo, and building AI into the product itself. How to drive Claude efficiently, what agents and MCPs actually are (with Figma/Linear/GitHub examples and the gh-vs-MCP call), and—when you want a feature that talks to a model—how to structure an AI service and wire it into the frontend and backend templates from the last few articles. The condensed version of everything I've learned shipping both."
category: ["ai", "concept", "typescript", "react", "backend", "system-design"]
pubDate: "2026-06-23"
published: true
---

## Table of contents

# Introduction

"Using AI" in a 2026 codebase means two completely different things, and conflating them is the source of a lot of confused architecture conversations.

1. **AI as the tool you build *with*** — a coding agent (Claude Code, in my case) that reads your repo, writes code, runs your tests, opens PRs. This changes your *workflow*.
2. **AI as a feature *in* the product** — a chat panel, an assistant, a "generate this for me" button that calls a model at runtime on behalf of your users. This changes your *architecture*.

The first is about making yourself faster. The second is about shipping a capability. They share a vocabulary (agents, tools, prompts) and almost nothing else. This article is the condensed version of both, built on the same scaffolding as the last few posts: the [frontend template](/blog/111_structuring-a-frontend-repo-in-2026), the [full-stack monorepo](/blog/112_the-typesafe-fullstack-monorepo), and a pair of standalone **dashboard-frontend** / **dashboard-backend** templates I'll wire an assistant into at the end.

I'll keep it portable, same as the testing article: the *patterns* are what matter, so I'll use the boring stack everyone can run — Claude Code for the agent half, the [Vercel AI SDK](https://sdk.vercel.ai) for the product half — and point at a production gRPC AI service for the "this is what it looks like at scale" notes.

---

# Part 1 — AI working *in* your repo

## The CLAUDE.md is the highest-leverage file you own

A coding agent is only as good as the context it starts with. The single best investment is a `CLAUDE.md` at the repo root: the operating contract for anyone — human or agent — touching the code. The rule that keeps it useful: **write down the decisions and the gotchas, not what the code already says.**

- ✅ Locked architectural decisions ("services are the only layer that touches the DB"), the gotchas that cost you an hour (`hono/jwt` needs the algorithm as the third arg), the commands that *are* the gates, and the anti-patterns with teeth.
- ❌ A restated file tree, a prose description of what each function does, anything `grep` answers in a second. That's noise the agent re-derives anyway, and it goes stale the moment you refactor.

The test for a good line: would a competent new contributor get it *wrong* without this sentence? If yes, it earns its place. If the code makes it obvious, cut it.

## Give the agent the gate, then let it close its own loop

The biggest behavioral upgrade is mechanical: make sure the agent can *run your checks itself*. Typecheck, tests, lint, build — one command each, documented in the `CLAUDE.md`. An agent that can run `pnpm typecheck && pnpm test` after it edits will catch its own mistakes before you ever see them. An agent that can't is guessing, and you become its compiler.

This is also the honesty mechanism. "I added the feature" means nothing; "I added the feature and the 31 tests pass, here's the output" is a claim you can trust. Insist on the second.

## What to do, what not to do

A short list earned the hard way:

- **Do work in small, reviewable diffs.** A 600-line change you didn't read is a 600-line change you now own and don't understand. Scope the task; review the diff like it was a colleague's.
- **Do plan before big changes.** For anything cross-cutting, have the agent lay out the plan first. Cheap to redirect a plan; expensive to redirect 12 files.
- **Don't let it reformat the whole repo.** Scope formatters to touched files — a "fix lint" that rewrites 200 unrelated files buries your actual change and poisons the diff.
- **Don't accept generated code you can't explain.** If you can't say why it works, you can't maintain it, and neither can the next person.
- **Don't paste secrets into the context,** and assume anything you send to a third-party tool may be retained. Keys live in env/secret managers, not in chat.
- **Commit on your terms.** Let the agent write and verify; you decide when it commits and pushes. (Every template in this series says exactly this in its `CLAUDE.md`.)

# What an agent actually is

Past the buzzword: an **agent (subagent)** is a *fresh context window with its own system prompt and its own tool allowlist*, spawned to do one scoped job, that returns a result without polluting your main conversation. That's the whole idea. Three properties make it worth using:

- **Isolation.** It burns its own context on the task — reading twenty files, running searches — and hands you back just the conclusion. Your main thread stays clean.
- **A focused system prompt.** It only knows how to do the one thing, described precisely, so it does that thing consistently.
- **Least privilege.** A *reviewer* agent gets `Read`/`Grep`/`Bash` and **no** `Write` — it physically can't edit while reviewing. A *scaffolder* gets `Write`/`Edit`. You grant the minimum.

## Where agents live: in the repo, not in your home dir

Claude Code resolves agents from both your global `~/.claude/agents/` and the project's `.claude/agents/`. For anything that encodes a repo's conventions, **put it in the repo.** It gets versioned, shared with the team, travels with a clone, and — crucially — it can reference the actual structure ("copy `src/modules/projects/` as the reference"). A global agent can only be generic, which defeats the point. Reserve global for personal, cross-project helpers.

The dashboard templates ship convention-aware agents in their `.claude/agents/`:

```
dashboard-frontend/.claude/agents/
  scaffold-domain.md     # create a new api/<domain>/ (Zod types + raw fns + SWR hooks)
  scaffold-route.md      # add a file-based route + route-local components + nav
  frontend-reviewer.md   # review a diff against the architecture rules, run the gates
  api-contract-sync.md   # reconcile the frontend Zod schemas with the backend contract

dashboard-backend/.claude/agents/
  scaffold-module.md     # create a new modules/<domain>/ (schemas → service → routes)
  backend-reviewer.md    # review with security/owner-scoping first, run the gates
```

Each is the same shape as the production agents in our other services: YAML frontmatter (`name`, `description`, `tools`), the reference files to read, a step-by-step process, a verify step, and hard rules. The format matters less than the discipline: **a recurring multi-step task becomes an agent so it's done the same way every time.**

## What not to do with agents

- **Don't build a mega-agent** that does everything. One agent, one job. A "do all the frontend work" agent is just an unfocused chat.
- **Don't over-grant tools.** A reviewer with `Write` will start fixing things mid-review and you lose the independent read.
- **Don't paste your whole CLAUDE.md into every agent.** Point at it; the agent reads the repo.

# What an MCP actually is

**MCP — Model Context Protocol — is a standard way to hand a model tools and data from an external system.** A provider (Figma, Linear, GitHub, your own database) runs an *MCP server* that exposes a set of typed tools and resources; the agent connects to it and calls those tools exactly like its built-in ones. The win is decoupling: the tool provider and the agent evolve independently, and any MCP-speaking agent can use any MCP server.

Connecting one is a line:

```bash
claude mcp add --transport http figma https://…/mcp
# then, in a session, the agent can call the Figma tools directly
```

## The three you'll actually use

- **Figma** — pull a frame's structure, layout, and design tokens into the model so "build this component" starts from the real spec instead of a screenshot guess. The closest thing to design→code that isn't a toy.
- **Linear** — read and write issues from inside the coding session: open a ticket for the bug you just found, move it to *In Review* when the PR lands. The `fix-security` agent in our Dionysus service does exactly this — file a Linear issue per alert, branch, fix, report.
- **GitHub** — issues, PRs, checks, releases, as structured tools.

## gh CLI vs. GitHub MCP — when to use which

This is the question people actually have, and the answer is a rule of thumb, not a religion:

```
Can you write the exact command?           →  use `gh` via Bash.
Does the model need to navigate/decide      →  use the GitHub MCP.
  across many operations or read-heavy
  structured queries?
```

- **`gh` (the CLI, called through Bash)** is deterministic, scriptable, and free of extra infrastructure. `gh pr create`, `gh run view --log`, `gh api …` — when you know the operation, this is simpler, cheaper (no extra tool definitions eating context), and reproducible. Most of the GitHub work in these repos is `gh` one-liners in the `CLAUDE.md`.
- **The GitHub MCP** shines when you *don't* want to spell out commands — when the model should explore the API surface itself, do read-heavy structured queries, or operate in an environment where shelling out to `gh` isn't available. It's more capable and more expensive (every tool it exposes is context the model carries).

My default: **`gh` for the known path, MCP when I want the model to figure out the path.** Don't add an MCP server for something a single `gh` command does — you're paying context for capability you didn't need.

## What not to do with MCPs

- **Don't connect servers you don't need.** Every MCP adds tools = context + surface area + risk. Connect deliberately.
- **Be careful with write-capable servers.** A Linear or GitHub MCP that can mutate state should run behind confirmation. Read-only is a safe default.
- **Mind the auth.** MCP servers carry credentials. Treat them like any other secret-bearing integration.

---

# Part 2 — AI built *into* your product

Now flip it. You want a feature: an assistant in the dashboard that can answer "how many active projects do I have?" and "create a project called Q3 Launch." That model call happens **at runtime, for your users**, and it needs a home in your architecture.

## Start as a module; graduate to a service

The honest answer for most apps: **start as a module in the backend you already have.** Our **dashboard-backend** groups one folder per domain (`schemas` → `service` → `routes`); an assistant is just another domain, `modules/ai/`. Don't stand up a separate microservice on day one.

You graduate to a **dedicated AI service** when the pressures show up: provider keys and prompt logic you want isolated, **per-tenant cost/usage tracking**, heavy streaming, multiple consumers, or a model-ops surface (evals, prompt versioning) that doesn't belong in your CRUD backend. Our production `ai-service` is exactly that — a stateless gateway in front of every AI feature. The structure is the same either way; only the deployment boundary moves.

```
small:   [ dashboard-backend ]──modules/ai/──▶ model provider
                 │ projects/ dashboard/ auth/

at scale: [ backend ] ──HTTP──▶ [ ai-service ] ──▶ model provider(s)
                                   stateless gateway: prompts, tools,
                                   streaming, usage tracking, evals
```

## The five layers of an AI feature

Whether it's a module or a service, the anatomy is the same — and it rhymes with the BFF layering from the rest of this series:

```
transport     route/handler: validate input, open a stream                (routes.ts)
orchestration the "Logic": build the system prompt, run the model loop     (ai.service.ts)
tools         the bridge to your domain — each tool calls your services    (tools)
provider      one abstraction over the model(s), injected, never imported  (AI SDK)
persistence   usage/cost records, optional history                         (db)
```

A few principles carry almost all the weight:

**Stateless, like the BFF.** The client sends the *full message history* each request; the server holds no session. This is the same statelessness decision from [article 112](/blog/112_the-typesafe-fullstack-monorepo), and it's why the AI tier scales horizontally and tests cleanly.

**One provider abstraction, injected.** Business logic never imports `@ai-sdk/anthropic` directly. A registry creates models; the Logic receives a `LanguageModel`. Swapping Claude for another model, or routing different features to different models, becomes config — not a refactor. (Our service does `createProviderRegistry({ openai, anthropic })` and injects `registry.languageModel("anthropic:…")` into every Logic class.)

**Tools are the entire bridge to your app.** This is the part people underestimate. The model doesn't touch your database — it calls *tools*, and each tool's `execute` calls a function you already have. The assistant's power is exactly the set of tools you give it, no more.

## Wiring it into the templates

Here's the assistant, concretely, as a module in `dashboard-backend`. The orchestration:

```ts
// src/modules/ai/ai.service.ts
import { anthropic } from "@ai-sdk/anthropic";
import { stepCountIs, streamText, tool } from "ai";
import { z } from "zod";
import * as projects from "../projects/projects.service.js";

export function streamAssistant(opts: { ownerId: string; messages: ModelMessage[] }) {
  return streamText({
    model: anthropic("claude-..."),       // inject via a registry in real code
    system: buildSystemPrompt(),           // inline, template-literal (see below)
    messages: opts.messages,               // full history — stateless
    stopWhen: stepCountIs(8),              // bound the tool loop
    tools: {
      list_projects: tool({
        description: "List the signed-in user's projects, optionally by status.",
        inputSchema: z.object({
          status: z.enum(["active", "paused", "archived"]).optional(),
        }),
        // ownerId comes from the SESSION, never from the model. This is the line.
        execute: ({ status }) =>
          projects.listProjects(opts.ownerId, { status, page: 1, pageSize: 20 }),
      }),
      create_project: tool({
        description: "Create a new project for the signed-in user.",
        inputSchema: z.object({ name: z.string(), status: z.enum(["active", "paused"]).optional() }),
        needsApproval: true,               // destructive-ish → confirm before running
        execute: (input) => projects.createProject(opts.ownerId, input),
      }),
    },
  });
}
```

The route is a thin handler that streams, exactly like every other route in the template:

```ts
// src/modules/ai/ai.routes.ts
export const aiRoutes = new Hono<{ Variables: AuthVariables }>()
  .use(requireAuth)
  .post("/chat", zValidator("json", chatInput), (c) => {
    const result = streamAssistant({
      ownerId: c.get("user").id,           // the verified token, not the body
      messages: c.req.valid("json").messages,
    });
    return result.toUIMessageStreamResponse();   // Server-Sent Events
  });
```

And the frontend is a new `api/ai/` domain plus a chat panel. Because the AI SDK ships a React binding, the streaming plumbing is one hook:

```tsx
// a chat route in dashboard-frontend
const { messages, sendMessage, status } = useChat({ api: "/api/ai/chat" });
// render messages + tool calls; on a create_project tool result, revalidate the
// projects SWR cache so the table updates live — server state still has one owner.
```

Notice what *didn't* change: auth still rides the same cookie, the request still goes through the proxy to one origin, and tool results that mutate data flow back into the **same SWR cache** that owns server state. The AI feature slots into the architecture instead of fighting it.

## The security line you cannot cross

Re-read the `execute` closures above. The tools take an `ownerId` **from the verified session**, captured in the closure — the model supplies a `status`, never an owner. This is the single most important rule in product AI, and it's easy to get wrong because the model is *so* helpful it'll happily pass you an `advertiserId` it inferred from the conversation.

We shipped a fix for exactly this class of bug: *"use the server-trusted advertiser for read tools, not the model's guess."* The model's job is to choose the *action*; your server's job is to choose *whose data*. The backend is still the security boundary — an AI tool is just another caller, and owner-scoping applies to it the same as to a REST handler. Let the model pick the tenant and you've built a confused-deputy data leak with a friendly chat UI.

## Lessons from a production AI service

Things that aren't obvious until they bite, condensed from running one for real:

**Know what a wire schema can actually enforce.** Tool `inputSchema` constraints are enforced by the provider's structured-output decoder — but providers accept *different subsets*, and overstepping fails the **whole call** closed. Enums and number bounds (`z.enum`, `.min/.max/.int`) are hard-enforced and free — use them. **String length and array size are not** — one provider silently tolerates them, another rejects the entire request. Ask for "3–5 items" / "≤160 chars" *in the prompt*, then clamp in JS after the model returns. We took a production outage learning this.

**Stream typed chunks, not a blob.** A real assistant stream isn't just text deltas. It's a discriminated union: text, tool-call, tool-result, **canvas operations** (structured "create/update node" events the UI applies live), **approval requests** (for destructive tools), and a **finish** chunk carrying token usage. Design the chunk types up front; the UI subscribes to the kinds it cares about.

**Approval flow for destructive tools.** Mark a tool `needsApproval: true`; the server emits an approval-request chunk instead of executing; the client shows a confirm UI and replies; the server then runs it. "Delete all archived projects" should never fire on a model's say-so alone.

**Track usage at the boundary or you'll fly blind on cost.** Wrap the model so every call records tokens against the tenant/feature. Retrofitting this after you have a bill is miserable; bake it in.

**Prompts live inline in code, on purpose.** Build system prompts with template literals in the Logic, versioned with the code — editing a prompt is a code change + deploy + the same review as any other logic. We piloted a DB-backed prompt registry and tore it out; "edit prod prompts live" sounds great until an untested prompt change silently degrades every response with no diff to point at.

## What not to do (product AI)

- ❌ **Don't let the model choose the tenant/owner.** Derive it from the session. (Worth saying twice.)
- ❌ **Don't put provider keys in the frontend.** The model is called from your server; the browser never sees a key.
- ❌ **Don't trust tool inputs for authorization** any more than you'd trust a request body.
- ❌ **Don't make it stateful.** Full history per request; no server-side session to corrupt or scale around.
- ❌ **Don't block on the full generation.** Stream — first token fast beats a perfect paragraph after eight seconds of spinner.
- ❌ **Don't validate length/array-size in the wire schema.** Prompt for it, post-validate it.
- ❌ **Don't skip a Zod parse on what comes back.** A model's structured output is still untrusted input crossing a boundary — validate it like any wire data ([article 111's rule](/blog/111_structuring-a-frontend-repo-in-2026), applied to the model).

# Takeaways

- **Two jobs, one word.** AI-as-tool changes your *workflow*; AI-as-feature changes your *architecture*. Decide which conversation you're in before you design anything.
- **For the agent half, the `CLAUDE.md` and the gate do the heavy lifting.** Write decisions and gotchas, not a code restatement; make sure the agent can run your checks and self-verify.
- **An agent is a fresh context + a focused prompt + least-privilege tools.** Put convention-aware ones *in the repo* (`.claude/agents/`) so they travel and stay specific. One agent, one job.
- **An MCP is a standard tool/data bridge to an external system.** Use `gh` for the known command, an MCP when the model should navigate the surface itself. Connect servers deliberately — each one costs context and adds risk.
- **For the product half, an AI feature is five layers** (transport → orchestration → tools → provider → persistence) and it rhymes with the BFF: stateless, one injected provider abstraction, and **tools as the only bridge to your domain.**
- **The cardinal security rule: the model picks the action, your server picks whose data.** Owner-scope every tool from the session; never from the model's guess.
- **The scars worth inheriting:** enums/number-bounds in the schema, length/array limits in the prompt; stream typed chunks; approval-gate destructive tools; track usage at the boundary; keep prompts in code; and parse the model's output like the untrusted wire data it is.
