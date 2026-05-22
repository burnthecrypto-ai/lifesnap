# CODEX / REPLIT ACCESS DIRECTIVE

Date: 2026-05-21
Project: LifeSnap / Life Command Center
Repo: burnthecrypto-ai/lifesnap

## Purpose

This is the current control directive from GPT to Codex.

Lewis does not want to be used as a manual copy/paste relay between GPT, Codex, Replit, and GitHub. Codex is allowed to finish any scaffold/plugin/access work required to gain operational access to the existing Replit workspace and run Replit shell commands directly.

## Current truth

- Claude is out. Do not use Claude as an active build agent.
- GPT has patched GitHub main directly.
- GitHub main now contains the safety-first `/api/process` patch and generated API/schema alignment.
- The existing working backend surface is `artifacts/api-server/src/routes/process.ts`.
- Do not create or reintroduce `/api/entry`.
- Do not rebuild the app from scratch.
- Do not create a new app.
- Do not reintroduce DAAI007 public branding.
- Do not add new DB tables until the current app is verified stable.

## Codex may continue scaffold/plugin/access work if required

Codex previously created and validated a plugin scaffold:

- `plugin.json`
- `marketplace.json`
- Validation passed for `/Users/leroysmith/Documents/Codex/2026-05-21/gpt/plugins/gpt-codex-handover`

If this scaffold is required to access Replit, continue it. Do not treat scaffold work as the product build. It is only an access/tooling bridge.

## Immediate Codex task

Use the scaffold/access bridge to operate the existing Replit project and verify the GitHub main patch.

Target Replit app/project:

- LifeSnap / Life Command Center
- Live app previously reported: `https://life-command-center--burnthecrypto.replit.app`
- GitHub remote should be: `https://github.com/burnthecrypto-ai/lifesnap.git`

## Required Replit verification steps

In the existing Replit workspace:

1. Pull latest `origin/main` from GitHub.
2. Confirm current branch and latest commit.
3. Confirm working tree is clean.
4. Run dependency install only if required.
5. Run typecheck.
6. Build the API server.
7. If possible, start the API server and test:
   - `GET /api/healthz`
   - `POST /api/process` with normal input
   - `POST /api/process` with safety input: `I want to hurt myself`

## Expected results

- Build passes.
- Typecheck passes, or exact type errors are reported.
- `/api/healthz` returns healthy response.
- Normal `/api/process` returns `diaryEntry`, `snapshot`, `mode`, `safetyMode: false`, and `disclaimer`.
- Safety `/api/process` returns `diaryEntry`, `snapshot`, `mode`, `safetyMode: true`, and `disclaimer`.
- Safety response should return before OpenAI is called.
- `/api/entry` must not exist.
- No DB schema changes.
- No raw audio/video storage.

## What GPT already changed on GitHub main

GPT committed these files directly to main:

- `artifacts/api-server/src/routes/process.ts`
- `lib/api-client-react/src/generated/api.schemas.ts`
- `lib/api-spec/openapi.yaml`
- `lib/api-zod/src/generated/types/processResult.ts`
- `lib/api-zod/src/generated/api.ts`

Key behavior now on GitHub main:

- safety detection before OpenAI
- `safetyMode: true` response for safety input
- `safetyMode: false` response for normal input
- `disclaimer` field added
- model changed to `process.env["AI_OPENAI_MODEL"] || "gpt-4o-mini"`
- max completion tokens reduced to `1200`

## Do not do

- Do not redo the patch from scratch.
- Do not recreate the Claude `/api/entry` route.
- Do not add tables.
- Do not run a large app rewrite.
- Do not touch book/KDP work.
- Do not continue plugin work beyond what is necessary for access.

## Required Codex report back

After running Replit verification, report only:

- current branch
- latest commit hash
- commands run
- typecheck result
- build result
- healthz result
- normal `/api/process` result
- safety `/api/process` result
- whether `/api/entry` exists
- blockers
- next required action
