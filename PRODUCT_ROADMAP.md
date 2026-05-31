# Product Roadmap — Movie Rating (MVP → Production)

## Overview
This document converts the current MVP into a prioritized plan for a production-ready product. It lists goals, milestones, prioritized work, and recommended next actions so you can iterate quickly and safely.

## Goals & Success Metrics
- Target users: casual movie viewers who want to rate and discover films.
- Success metrics: DAU/MAU, average session length, rating submissions/week, retention (7d/30d), conversion to paid (if applicable).

## High-level Milestones (priority order)
1. Product Goals & Analytics
   - Define target personas, core user flows, and KPIs.
2. UX/UI & Accessibility
   - Mobile-first polish, accessibility (WCAG), onboarding flow.
3. API & Data Model Harden
   - Input validation, transactions, Prisma schema review, secrets in env.
4. Authentication & Accounts
   - Implement email/password + social OAuth, session security, email verification.
5. Testing Strategy
   - Unit tests (Vitest/Jest), integration tests, E2E (Playwright/Cypress).
6. CI/CD
   - GitHub Actions: lint → test → build → deploy to staging.
7. Containerization & Local Dev
   - `Dockerfile`s for `client` and `server`, `docker-compose` for local stack.
8. Staging/Production Deploy
   - Provision infra (VPS, cloud provider, or PaaS), secrets manager, DNS/SSL.
9. Observability & Alerts
   - Structured logs, metrics, error tracking (Sentry), uptime alerts.
10. Performance & Cost Optimizations
    - Caching, DB indexes, CDN for assets.
11. Docs, Legal & Billing
    - README, API docs (OpenAPI), privacy policy, payment integration.
12. Beta, Feedback, Iterate
    - Run closed beta, collect analytics, prioritize fixes and feature requests.

## Quick Next Actions (pick one to start)
- Run frontend dev server locally:

```bash
cd client
npm install
npm run dev
```

- Run backend locally:

```bash
cd server
npm install
# then the server's dev command, e.g.:
npm run dev
```

- Create a root orchestrator (runs both client & server):

```bash
npm init -y
npm install -D concurrently
npm set-script dev "concurrently \"npm --prefix client run dev\" \"npm --prefix server run dev\""
npm run dev
```

## Recommended First Engineering Tasks
- Add input validation to server endpoints (`zod` or `joi`).
- Add authentication (start with JWT sessions or NextAuth-like flow).
- Add unit tests for core business logic and an E2E test for the main flow.

## Ownership & Timeline (example small team)
- Week 1: Goals, UX polish, run local dev flows, add analytics.
- Week 2–3: Auth + API hardening, CI pipeline, basic tests.
- Week 4: Containerize, staging deploy, observability.

---
If you want, I can scaffold `Dockerfile`s, add a root `package.json` dev script, or create CI config next — tell me which and I’ll implement it.
