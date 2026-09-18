# HealVerse AI Handoff Document

This document serves as the canonical handoff across AI sessions. It tracks the current architecture, implementation status, design decisions, validation results, known issues, and how to verify and run the system.

---

## Current Architecture & State

- **Monorepo Structure**: `pnpm` workspaces with `apps/web`, `packages/application`, `packages/database`, `packages/domain`, `packages/infrastructure`, `packages/shared`, `packages/ui`, `services/*`.
- **Architecture**: Clean Architecture / Ports & Adapters with dependency injection container (`createInfrastructureContainer`).
- **Data & Identity**: PostgreSQL + Prisma ORM. Canonical user identity model is `model User`.
- **Chat State**: Live chat backend integrated, TanStack Query configured, mock chat data removed, conversation CRUD works against backend.
- **Auth Provider**: Better Auth (fully integrated). Single auth provider extending the canonical `User` identity model.
- **Demo User Status**: Fully removed (`NEXT_PUBLIC_DEMO_USER_ID` eliminated from all runtime code, configs, hooks, and components).

---

## Slice Status Checklist

- [x] **Slice 1**: Database Schema & Migration (Extend User, add Session, Account, Verification)
- [x] **Slice 2**: Infrastructure Layer & BetterAuthAdapter (Configure Better Auth with Prisma adapter)
- [x] **Slice 3**: API Routes (Mount `/api/auth/*` and `/api/me`)
- [x] **Slice 4**: Protect Conversation APIs (Enforce session-derived ownership across endpoints)
- [x] **Slice 5**: Frontend Auth Integration & Demo User Removal (Client auth, React Query caching, AppShell)
- [x] **Slice 6**: Living Handoff Documentation & Final Validation

---

## Implemented Features

### Slice 1: Database Schema & Migration
- Pinned Prisma packages in `packages/database/package.json` to stable Prisma 6 (`^6.19.3`) to resolve CLI incompatibility.
- Extended canonical `model User` in `packages/database/prisma/schema.prisma` with `name`, `emailVerified`, `image`, `sessions`, `accounts`, and default JSON preferences.
- Added `model Session`, `model Account`, and `model Verification` matching PostgreSQL UUID schema constraints.
- Added opposite relation `memories Memory[]` to `model Conversation`.
- Created non-destructive migration `packages/database/prisma/migrations/20260904000000_better_auth/migration.sql`.
- Updated `PrismaDatabaseClient` and type records in `packages/database/src/client/types.ts`.
- Validated: `prisma generate` succeeded; `packages/database` typecheck passed.

### Slice 2: Infrastructure Layer & BetterAuthAdapter
- Added `better-auth` and `@better-auth/prisma-adapter` dependencies to `packages/infrastructure/package.json`.
- Implemented real `BetterAuthAdapter` in `packages/infrastructure/src/auth/better-auth.adapter.ts` using Prisma adapter, email/password auth, UUID ID generation, and field mappings (`name: 'displayName'`, `image: 'avatarUrl'`).
- Exposed `getAuth()`, `getSession(headers)`, and `signOut(headers)`.
- Wired real database connection (`db`) into `BetterAuthAdapter` in `createInfrastructureContainer` (`packages/infrastructure/src/dependency-injection/container.ts`).
- Added `@types/node` and `"types": ["node"]` to infrastructure config; zero TypeScript errors.

### Slice 3: API Routes (`/api/auth/*` & `/api/me`)
- Added `better-auth` dependency to `apps/web/package.json`.
- Created `apps/web/lib/server/auth.ts` providing DI container access to `BetterAuthAdapter` and Better Auth instance.
- Created `apps/web/app/api/auth/[...all]/route.ts` handling all Better Auth HTTP methods (`GET`, `POST`).
- Created `apps/web/app/api/me/route.ts` returning authenticated `{ user, session }` or 401 Unauthorized.

### Slice 4: Protect Conversation APIs
- Added `UnauthorizedError` (HTTP 401) and `ForbiddenError` (HTTP 403) to `apps/web/lib/server/api/errors.ts`.
- Updated schemas in `apps/web/lib/server/api/schemas.ts` making client-supplied `userId` optional and non-binding.
- Updated `apps/web/lib/server/api/handlers.ts` to derive user identity strictly from `runtime.container.authAdapter.getSession(request.headers)`:
  - `GET /api/conversations`: Returns conversations strictly belonging to the authenticated user.
  - `POST /api/conversations`: Associates owner `userId` strictly from session.
  - `GET / PATCH / DELETE /api/conversations/:id`: Verifies participant authorization (403 Forbidden if not participant).
  - `GET / POST /api/conversations/:id/messages`: Verifies conversation access before retrieving or sending messages.
- Updated `packages/shared/src/domain/chat/schemas.ts` `messageCount` to allow `0` via `nonNegativeIntegerSchema`.
- Re-exported domain entity types in `packages/application/src/index.ts`.
- Automated test suite in `apps/web/tests/api/conversations.handlers.test.ts` passed (5/5 tests passing).

### Slice 5: Frontend Auth Integration & Demo User Removal
- Created Better Auth client in `apps/web/lib/auth/client.ts` using `createAuthClient` from `better-auth/react`.
- Created React Query auth hooks in `apps/web/hooks/auth.ts`:
  - `useCurrentUser()`: Queries `/api/me`, caches under `['auth', 'me']`, gracefully returns `null` on 401.
  - `useSignInMutation()`: Calls `authClient.signIn.email`, invalidates auth and conversation queries.
  - `useSignUpMutation()`: Calls `authClient.signUp.email`, invalidates auth and conversation queries.
  - `useSignOutMutation()`: Calls `authClient.signOut`, clears cache and invalidates queries.
- Completely removed `NEXT_PUBLIC_DEMO_USER_ID`:
  - Removed from `.env.example`, `apps/web/app/page.tsx`, `apps/web/components/layout/app-shell.tsx`, `apps/web/lib/api/contracts.ts`, `apps/web/lib/api/conversations.ts`, `apps/web/lib/api/query-keys.ts`, and `apps/web/hooks/chat.ts`.
- Updated `apps/web/components/layout/app-shell.tsx`:
  - Dynamically renders authenticated care workspace or unauthenticated landing state.
  - Provides a calm, accessible Sign In / Create Account modal using native HealVerse UI components (`Modal`, `Input`, `Button`, `Card`).
  - Guards chat creation and message sending to prompt login if unauthenticated.
- Updated `apps/web/components/layout/sidebar.tsx`:
  - Displays authenticated user profile with initials, name, email, and working Sign Out action.
  - Displays "Sign in / Register" button when unauthenticated.

### Slice 6: Living Handoff Documentation & Final Validation
- All workspace typechecks succeed with zero errors.
- Automated API test suite passes 100%.
- Next.js production build (`next build`) compiles and outputs static and dynamic routes cleanly.

---

## Design Decisions

1. **Canonical Identity Model**: Better Auth directly extends `model User` in `packages/database/prisma/schema.prisma` rather than introducing a parallel user table. Existing columns (`displayName`, `avatarUrl`, `preferences`) are preserved, and Better Auth standard columns (`name`, `emailVerified`, `image`, `sessions`, `accounts`) are linked.
2. **Session-Driven Ownership**: Conversation and message endpoints strictly derive authorization and ownership from the authenticated session cookies/headers. Any client-sent `userId` is strictly ignored.
3. **Single Auth Provider**: Better Auth is the exclusive authentication provider; no third-party auth bridges or duplicate services.
4. **UI Component Consistency**: Auth interactions reuse existing UI design tokens and components (`Modal`, `Input`, `Button`, `Card`, `Dropdown`).

---

## Validation Commands & Verification Results

### 1. Prisma Client Generation
```bash
npx prisma generate --schema packages/database/prisma/schema.prisma
```
*Result*: Generated `@prisma/client` with User, Session, Account, Verification models.

### 2. Unit & Integration Tests
```bash
npx tsx --tsconfig apps/web/tsconfig.json --test apps/web/tests/api/conversations.handlers.test.ts
```
*Result*: 5/5 passing tests:
- `creates and lists conversations deriving userId strictly from session` (PASS)
- `retrieves updates and deletes a conversation for authenticated participant` (PASS)
- `rejects unauthenticated requests with 401 Unauthorized` (PASS)
- `rejects access from non-participant with 403 Forbidden` (PASS)
- `creates a message and returns a mock assistant reply` (PASS)

### 3. Type Checking
```bash
./apps/web/node_modules/.bin/tsc -p apps/web/tsconfig.json --noEmit
./apps/web/node_modules/.bin/tsc -p packages/infrastructure/tsconfig.json --noEmit
./apps/web/node_modules/.bin/tsc -p packages/application/tsconfig.json --noEmit
./apps/web/node_modules/.bin/tsc -p packages/shared/tsconfig.json --noEmit
```
*Result*: 0 errors across all packages.

### 4. Next.js Production Build
```bash
npx pnpm --dir apps/web build
```
*Result*: Successful production build (Exit code 0):
- Route `/` (Static)
- Route `/_not-found` (Static)
- Route `/api/auth/[...all]` (Dynamic)
- Route `/api/conversations` (Dynamic)
- Route `/api/conversations/[id]` (Dynamic)
- Route `/api/conversations/[id]/messages` (Dynamic)
- Route `/api/me` (Dynamic)

---

## Frontend State & Rendering Regression Fix (Post Better-Auth Migration)

### Problem Addressed
Immediately following the Better Auth migration, the browser UI exhibited two critical issues:
1. **Broken Layout & Unstyled Components**: Legacy Tailwind v3 directives (`@tailwind base; @tailwind components; @tailwind utilities;`) in `apps/web/app/globals.css` were ignored by `@tailwindcss/postcss` (Tailwind v4), preventing generation of responsive breakpoints (`md:block`, `md:hidden`, `lg:flex`, `xl:block`) and theme tokens. This caused the desktop sidebar to hide, the mobile drawer header to permanently collide with the top navigation, and UI components to render unstyled.
2. **Inconsistent Unauthenticated Workspace State**:
   - `TypingIndicator` ("Thinking...") was unconditionally mounted, rendering a perpetual AI loading indicator for unauthenticated visitors.
   - The Sidebar rendered empty `TODAY`, `YESTERDAY`, and `OLDER` categories with zero chats.
   - The ChatHeader showed an active conversation search input without an active conversation.
   - The ContextPanel showed conversation summary notes for non-existent chats.
   - `apps/web/app/page.tsx` synchronously read `searchParams.conversationId`, triggering Next.js 15+ async dynamic API runtime console errors.

### Solution Applied
- **Tailwind v4 Setup**: Migrated `apps/web/app/globals.css` to `@import "tailwindcss"; @config "../../../tailwind.config.ts";`, restoring all responsive breakpoints, dark mode behavior, and theme variables.
- **Page Routing**: Awaited `searchParams` in `apps/web/app/page.tsx` (`await searchParams`).
- **AppShell**:
  - Guarded `TypingIndicator` to render strictly when `currentUser != null && sendMessageMutation.isPending`.
  - Pass `hasActiveConversation` to `ChatHeader` and `isAuthenticated` to `ContextPanel`.
  - Wire `onRequireAuth` into `ChatInput` to direct visitors toward authentication.
- **Sidebar**: Replaced empty chronological headings with a clean prompt ("Sign in to save and access your care conversations") when unauthenticated, and "No conversations yet" when authenticated with zero chats.
- **ChatHeader**: Hidden conversation search input when no active conversation is selected.
- **ContextPanel**: Added `isAuthenticated` prop to render a calm PHI security and clinical trust overview when unauthenticated.
- **ChatInput**: Supported `onRequireAuth` to safely open sign-in modal on click without firing mutations.
- **Auth Synchronization**: Optimistically populated `queryClient.setQueryData(authQueryKeys.me(), result.data)` in `useSignInMutation` and `useSignUpMutation` to prevent auth-state flicker.

### Validation Results
- **Unit & Integration Tests**: `npx tsx --tsconfig apps/web/tsconfig.json --test apps/web/tests/api/conversations.handlers.test.ts` (5/5 PASS)
- **TypeScript Typecheck**: `npx -y pnpm@9.12.2 --dir apps/web typecheck` (0 errors)
- **Production Build**: `npx -y pnpm@9.12.2 --dir apps/web build` (Exit code 0, all routes compiled)
- **Browser Verification**: Desktop (1280x800) and mobile (390x844) viewports verified via browser subagent with screenshot capture; confirmed correct layout, no overlapping drawer, no rogue typing indicator, and responsive drawer functionality.
- **Security Boundary**: Zero changes to Better Auth security architecture, Prisma schemas, or API authorization.
