# HealVerse

HealVerse is a production-grade monorepo foundation for a healthcare AI platform.

## Architecture

- `apps/web`: Next.js App Router application
- `packages/ai`: AI provider abstraction layer and orchestration surface
- `packages/database`: Prisma setup and database access foundation
- `packages/shared`: shared constants, helpers, logging, and response utilities
- `packages/ui`: reusable UI primitives for shared design system work
- `services`: future service boundaries and worker processes

## Principles

- Provider-agnostic AI architecture
- Feature-first app organization
- Clean Architecture and dependency inversion
- Strict TypeScript typing
- Docker-ready deployment

## Getting Started

1. Install dependencies with `pnpm install`.
2. Copy `.env.example` to `.env` and fill in environment values.
3. Run `pnpm dev` to start the web application.

## Notes

- AI providers are intentionally abstracted and not implemented yet.
- Authentication is not wired yet.
- Database models are intentionally not defined yet.