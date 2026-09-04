# Better Auth Migration – Production Authentication & Ownership Enforcement

Migrate HealVerse from the current stubbed authentication state to a production-grade Better Auth integration, preserving Clean Architecture, repository patterns, the DI container, and the canonical Prisma `User` identity model while enforcing session-derived conversation ownership and removing frontend demo-user dependencies.

## Progress

- [ ] **Slice 1**: Database Schema & Migration (Extend User, add Session, Account, Verification)
- [ ] **Slice 2**: Infrastructure Layer & BetterAuthAdapter (Configure Better Auth with Prisma adapter)
- [ ] **Slice 3**: API Routes (Mount `/api/auth/*` and `/api/me`)
- [ ] **Slice 4**: Protect Conversation APIs (Enforce session-derived ownership across endpoints)
- [ ] **Slice 5**: Frontend Auth Integration & Demo User Removal (Client auth, React Query caching, AppShell)
- [ ] **Slice 6**: Living Handoff Documentation (`docs/AI_HANDOFF.md`)

---

## Execution Strategy

Work sequentially through each implementation slice.

Do NOT skip ahead.

Before modifying any file:
- Inspect existing implementations.
- Understand dependencies.
- Reuse existing abstractions.
- Avoid introducing duplicate logic.

For every slice:
1. Read all affected files.
2. Understand current architecture.
3. Implement the smallest complete change.
4. Run validation.
5. Fix all issues introduced by that slice.
6. Update `docs/AI_HANDOFF.md`.
7. Continue only if validation succeeds.

Never assume APIs, schema fields, imports, or package exports.
Always inspect the repository first.

If repository reality differs from this specification, prefer the repository while preserving the architectural intent.

## Repository Reality Rule

This specification defines the intended architecture, not the exact implementation.

If the repository already contains an equivalent abstraction, route, schema, service, or utility:
- Extend it instead of replacing it
- Reuse it instead of duplicating it
- Preserve existing naming conventions
- Preserve dependency boundaries

Prefer adapting this specification to the repository over adapting the repository to this specification.

### Slice Boundaries & Stability
- Each implementation slice should be independently compilable.
- Do not leave half-finished work spanning multiple slices.
- Every slice must end in a stable repository state.

### Preserve Git History
- Prefer modifying existing files instead of deleting and recreating them.
- Preserve imports, comments, naming conventions, and blame history whenever practical.

### Blocker Protocol
If a blocker is encountered:
- Explain the blocker clearly.
- Identify the exact file or dependency.
- Explain why it blocks progress.
- Propose the smallest safe solution.
- Do not invent APIs or continue based on assumptions.

---

## Out of Scope

Do NOT:
- Redesign UI.
- Rename folders.
- Reorganize packages.
- Rewrite repository interfaces.
- Migrate to a different router.
- Replace Prisma.
- Replace React Query.
- Modify unrelated features.
- Change domain models unrelated to authentication.
- Perform formatting-only commits.

---

## Guardrails & Non-Negotiables

> [!IMPORTANT]
> - **Migration, Not Rewrite**: Replace existing auth stubs incrementally. Do not delete working infrastructure unless it is fully replaced in the same commit.
> - **Preserve Existing Architecture**: Do not bypass repositories, use cases, dependency injection, or domain models. Authentication must enter the system through existing service boundaries.
> - **Single Auth Provider**: Do NOT introduce NextAuth, Clerk, Auth.js, custom JWT auth, or parallel authentication services. Better Auth is the single authentication provider.
> - **Strict Ownership**: The authenticated session is the single source of truth. Ignore any `userId` supplied by the client. Never expose ownership decisions to frontend code.
> - **Data & Migration Safety**: Never modify existing user data destructively. Prisma migrations must preserve existing users, conversations, messages, preferences, and timestamps. Avoid `DROP COLUMN` or `DROP TABLE` unless replacing an unused stub.
> - **Minimal UI Footprint**: Reuse existing UI components. Only introduce the minimal authentication screens required. Preserve layout and navigation.
> - **Stopping Conditions**: After each implementation slice: build, typecheck, and run affected tests. If validation fails, fix immediately before continuing. Never continue with a broken repository.
> - **Living Handoff Document**: Maintain `docs/AI_HANDOFF.md` at the completion of each slice as the canonical handoff across AI sessions.

---

## Proposed Changes

### Slice 1: Database Schema & Migration
*Extend the canonical `User` model and add Better Auth tables.*

#### [MODIFY] `packages/database/prisma/schema.prisma`
- Extend `model User` with Better Auth required fields (`name`, `emailVerified`, `image`, `sessions`, `accounts`) and default value for `preferences` while preserving all existing columns and relations.
- Add `model Session`, `model Account`, and `model Verification`.
- Map Better Auth fields to the existing HealVerse User schema using repository conventions; reuse existing columns where possible.

#### [NEW] `packages/database/prisma/migrations/20260904000000_better_auth/migration.sql`
- Safe, non-destructive migration adding new tables and columns without altering existing data.

#### [MODIFY] `packages/database/src/client/types.ts`
- Update `PrismaDatabaseClient` and delegate types for `session`, `account`, and `verification`.

*Validation: Verify Prisma schema validity and generate client types.*

---

### Slice 2: Infrastructure Layer & BetterAuthAdapter
*Replace the stub adapter with the real Better Auth instance using Prisma adapter.*

#### [MODIFY] `packages/infrastructure/src/auth/better-auth.adapter.ts`
- Configure `betterAuth` with `prismaAdapter`, `emailAndPassword`, session management, and UUID ID generation.
- Implement `BetterAuthAdapter` methods (`getSession`, `signOut`, etc.) adhering to the existing port interface.

#### [MODIFY] `packages/infrastructure/src/dependency-injection/container.ts`
- Initialize `BetterAuthAdapter` with the configured Better Auth instance and Prisma client in the DI container.

*Validation: `pnpm --dir packages/infrastructure typecheck`.*

---

### Slice 3: API Routes (`/api/auth/*` & `/api/me`)
*Mount authentication routes and current user endpoint.*

#### [NEW] `apps/web/app/api/auth/[...all]/route.ts`
- Better Auth handler for Next.js App Router routing all `/api/auth/*` requests.

#### [NEW] `apps/web/app/api/me/route.ts`
- Endpoint resolving session from cookies/headers and returning current authenticated user or 401.

*Validation: Verify route execution and error boundaries.*

---

### Slice 4: Protect Conversation APIs
*Enforce session-derived ownership across all conversation endpoints.*

#### [MODIFY] `apps/web/lib/server/api/schemas.ts`
- Remove `userId` from client request schemas (`conversationListQuerySchema`, `conversationCreateBodySchema`).

#### [MODIFY] `apps/web/lib/server/api/handlers.ts`
- Resolve user identity strictly from the authenticated session.
- Guarantee that `GET /api/conversations` only returns conversations owned by or participating the authenticated user.
- Guarantee that `POST /api/conversations` associates the conversation with the authenticated user.
- Verify user authorization for item routes (`GET`, `PATCH`, `DELETE`) and message creation.

#### [MODIFY] `apps/web/tests/api/conversations.handlers.test.ts`
- Update tests to assert authentication enforcement and session-based ownership.

*Validation: Run test suite and typechecks.*

---

### Slice 5: Frontend Auth Integration & Demo User Removal
*Connect client auth, cache session in React Query, and remove demo user dependencies.*

#### [NEW] `apps/web/lib/auth/client.ts`
- Client-side Better Auth instance exporting `authClient`, `signIn`, `signUp`, `signOut`, `useSession`.

#### [NEW] `apps/web/hooks/auth.ts`
- React Query hooks (`useCurrentUser`) caching session state under query keys.

#### [MODIFY] `apps/web/lib/api/contracts.ts`, `apps/web/lib/api/conversations.ts`, `apps/web/hooks/chat.ts`
- Remove `userId` from client-side API calls and React Query hooks.

#### [MODIFY] `apps/web/components/layout/app-shell.tsx`, `apps/web/components/layout/sidebar.tsx`, `apps/web/app/page.tsx`
- Remove `NEXT_PUBLIC_DEMO_USER_ID`.
- Reuse existing UI components (Modal, Input, Button, Card) to present minimal sign-in / sign-up state when unauthenticated.
- Present authenticated profile in sidebar with a Sign Out option.

*Validation: End-to-end typecheck, build, and test run.*

---

### Slice 6: Living Handoff Documentation

#### [NEW] / [MODIFY] `docs/AI_HANDOFF.md`
- Complete handoff document with current architecture, implemented features, design decisions, validation status, and next slice recommendations.

---

## Validation Criteria

Validation is successful only if:
- [ ] TypeScript has zero newly introduced errors.
- [ ] Build succeeds.
- [ ] Tests affected by this slice pass.
- [ ] Existing functionality continues to work.
- [ ] No temporary code remains.

*Note: If repository-wide pre-existing failures exist, clearly distinguish them from newly introduced issues.*

---

## Completion Report Structure

Upon completion, provide:

### Files Modified
- ...

### New Files
- ...

### Database Changes
- ...

### API Changes
- ...

### Frontend Changes
- ...

### Validation Results
- ...

### Remaining Repository Issues
- ...

### Recommended Next Slice
- ...

---

## AI Context Recovery

Before implementing any slice:
1. Read `docs/AI_HANDOFF.md`.
2. Read the last modified files related to authentication.
3. Determine the current completion state.
4. Continue from the first incomplete slice.
5. Do not repeat already completed work.
6. Do not overwrite validated implementations.

If `docs/AI_HANDOFF.md` conflicts with the repository, treat the repository as the source of truth and update the handoff document accordingly.
