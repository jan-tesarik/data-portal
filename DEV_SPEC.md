# Data Portal — Dev Handoff Spec

**Prototype:** https://jan-tesarik.github.io/data-portal/
**Repo:** https://github.com/jan-tesarik/data-portal
**Date:** 2026-05-17 (updated)

---

## 1. Tech Stack (Current Prototype)

| Layer        | Choice                                  |
| ------------ | --------------------------------------- |
| Framework    | React (via CDN / inline JSX, no bundler)|
| Styling      | CSS custom properties (oklch), inline   |
| Fonts        | Inter, JetBrains Mono (Google Fonts)    |
| Routing      | Custom state-based (`localStorage`)     |
| Build        | Static HTML — deployed to GitHub Pages  |
| Icons        | Inline SVG components                   |

### Production Target Stack

| Layer          | Recommendation                          |
| -------------- | --------------------------------------- |
| Frontend       | React / Next.js                         |
| Router         | React Router or TanStack Router         |
| Auth           | SSO / Identity Provider (Okta, Azure AD)|
| Backend        | Node.js / Python API layer              |
| Database       | PostgreSQL (app data) + Snowflake (analytics) |
| AI             | Claude API (Anthropic)                  |
| BI Embedding   | Apache Superset (guest token embedding) |
| Semantic Layer | dbt + Snowflake                         |
| Hosting        | Vercel / AWS / internal k8s             |

---

## 2. Pages & Components (Current State)

### Global Layout (`shell.jsx`)
- **Left sidebar** — collapsible, icon + label navigation
- **Top header** — search bar, notifications bell, user avatar placeholder
- **Main content area** — renders active page
- **Breadcrumb** — simple path display

### Pages

| Page | File | Route key | Description |
|------|------|-----------|-------------|
| Home | `page_home.jsx` | `home` | Welcome message, KPI cards (mock), recent/favorite dashboards, quick links |
| Dashboards | `page_dashboards.jsx` | `dashboards` | Tabs: BI Dashboards (by domain) + Community dashboards + "New dashboard" button |
| Dashboard Detail | `page_dashboards.jsx` | `dashboard-detail` | Embedded view placeholder (simulated Superset iframe) |
| Community Detail | `page_dashboards.jsx` | `community-detail` | Full view of a user-created dashboard (spec-rendered) |
| **Create Dashboard** | `page_create.jsx` | `create` | **5-step wizard: Source → Data → Describe → Preview → Save** |
| Executive Dashboards | `page_executive.jsx` | `executive` | Visually distinct executive dashboard list |
| Executive Detail | `page_executive.jsx` | `executive-detail` | Fullscreen visualization placeholder |
| Metrics Catalog | `page_metrics.jsx` | `metrics` | Search + domain filters, metric cards (name, domain, status badge, owner) |
| Metric Detail | `page_metrics.jsx` | `metric-detail` | Description, business definition, dimensions, example usage, "Used in Dashboards" |
| AI Assistant | `page_assistant.jsx` | `assistant` | Chat UI with input, bubbles, suggested questions, mock responses |
| App Scout | `page_app_scout.jsx` | `app-scout` | Data app |
| App Reviews | `page_app_reviews.jsx` | `app-reviews` | Data app |
| Scraper Config | `page_app_scraper_config.jsx` | `app-scraper` | Data app |
| Settings | `page_settings.jsx` | `settings` | Preferences UI |

### Shared modules
- `ui.jsx` — reusable card, button, badge, chip, modal, stepper components
- `charts.jsx` — LineChart, BarChart visualization components
- `data.jsx` — mock data (KPIs, dashboards, metrics)
- `data_community.jsx` — community dashboard mock data with specs and statuses
- `data_apps.jsx` — data apps registry
- `icons.jsx` — SVG icon library

---

## 3. User-Created Dashboards (IMPLEMENTED in Prototype)

### 3.1 What's Already Built

The prototype already includes:

- **"New dashboard" button** on Dashboards page → navigates to `create` route
- **5-step wizard** (`page_create.jsx`):
  1. **Source** — choose between spreadsheet upload or Data Assistant chat
  2. **Data** — preview uploaded data (table view) or chat with assistant to pull data
  3. **Describe** — enter dashboard name + prompt describing desired visualizations, with suggestion chips
  4. **Preview** — Claude-generated dashboard (KPIs + charts), team sharing selection
  5. **Save** — confirmation with links to "Back to Dashboards" and "Request verification"
- **Community tab** on Dashboards page with filters (All / Verified / Popular / Created by me)
- **Community dashboard detail page** showing rendered spec, metadata, status badges, upvotes
- **Status system**: Draft, Pending verification, Verified, BI implementing
- **Mock community dashboards** (5 examples with realistic data and specs)
- **Claude integration attempt** with graceful fallback to canned specs

### 3.2 Dashboard Statuses (as implemented)

| Status | Badge | Meaning |
|--------|-------|---------|
| `draft` | Gray "Draft" | User is still working on it |
| `pending` | Yellow "Pending verification" | Submitted for BI review |
| `verified` | Green "Verified" | BI confirmed data accuracy (shows verifier name + date) |
| `bi-building` | Purple "BI implementing" | BI team is rebuilding as production dashboard (shows BI owner + ETA) |

### 3.3 Sharing Model (as implemented)

- Team-based sharing via chip selection (Marketing, Finance, Product, Operations, People)
- Community dashboards show creator name, team, creation date, upvotes, view count
- "Popular" flag for high-engagement dashboards

### 3.4 What Still Needs Production Implementation

| Area | Prototype (mock) | Production requirement |
|------|-------------------|----------------------|
| File upload | Simulated (uses hardcoded sample data) | Real file parsing (Papa Parse / SheetJS) |
| Claude generation | Attempts API call, falls back to canned spec | Reliable API integration with retry/streaming |
| Data persistence | In-memory only (lost on refresh) | Database storage (dashboard specs, metadata) |
| Authentication | Placeholder user ("Jana Kováčová") | SSO integration |
| BI review queue | No dedicated UI | BI team admin panel with queue, actions |
| Notifications | None | Email/in-app notifications on status changes |
| Permissions | None | Snowflake role-based access (see §7) |

---

## 4. Architecture Overview

### 4.1 User Types

| User type | Access level | Primary use |
|-----------|-------------|-------------|
| CEO / Executives | Executive dashboards, high-level KPIs | Board-level reporting |
| Business Users | Standard dashboards, community dashboards, metrics | Day-to-day analytics |
| Data / BI Team | All dashboards + admin (verify, take over, manage) | Governance, dashboard building |
| Product Team | Product dashboards, metrics, AI assistant | Feature analytics |

### 4.2 System Layers

```
┌─────────────────────────────────────────────────────────────────────────┐
│  USER LAYER                                                              │
│  CEO · Business Users · Data Team · Product Team                         │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   │ HTTPS
┌──────────────────────────────────▼──────────────────────────────────────┐
│  PORTAL APPLICATION LAYER (React / Next.js)                              │
│                                                                          │
│  ┌──────────┐ ┌──────────────┐ ┌────────────┐ ┌──────────┐ ┌────────┐ │
│  │Dashboard │ │Executive     │ │Metrics     │ │AI        │ │Create  │ │
│  │Hub       │ │Dashboards    │ │Catalog     │ │Assistant │ │Wizard  │ │
│  └──────────┘ └──────────────┘ └────────────┘ └──────────┘ └────────┘ │
│                                                                          │
│  Auth/SSO · Navigation · Search · Role-aware rendering                   │
└──────┬──────────────┬─────────────────┬──────────────────┬──────────────┘
       │              │                 │                  │
       │ embed        │ API             │ API              │ API
       ▼              ▼                 ▼                  ▼
┌────────────┐ ┌────────────┐ ┌────────────────┐ ┌─────────────────────┐
│ Superset   │ │ Executive  │ │ Claude API     │ │ Portal Backend      │
│ (embedded) │ │ Dashboard  │ │ (generation +  │ │ (CRUD, auth, roles) │
│            │ │ App        │ │  assistant)    │ │                     │
└─────┬──────┘ └─────┬──────┘ └───────┬────────┘ └──────────┬──────────┘
      │               │                │                     │
      └───────────────┴────────────────┴─────────────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │  SNOWFLAKE                   │
                    │                              │
                    │  Raw Data · dbt Models       │
                    │  Semantic Layer · Metrics    │
                    │  Secure Views · RLS          │
                    │                              │
                    │  ── ONLY permission source ──│
                    └──────────────────────────────┘
```

### 4.3 Authentication & Security Flow

**Critical design principle: Snowflake is the ONLY permission authority.**

```
User login
  → SSO / Identity Provider (Okta, Azure AD, etc.)
  → Portal receives: user identity + group memberships
  → Portal maps user → Snowflake runtime role
  → All downstream queries execute with that runtime role
  → Snowflake enforces: table access, schema access, row-level security, secure views
```

**What this means:**
- Portal does NOT manage business permissions
- Superset does NOT own business permissions
- Superset acts only as visualization + query orchestration layer
- No permission duplication across systems
- Concurrent users with different roles query safely in parallel via runtime role propagation

### 4.4 Superset Embedding Flow

```
User navigates to dashboard in Portal
  → Portal backend generates a guest token (JWT/signed) for the user's role
  → Frontend embeds Superset via iframe with guest token
  → Superset renders dashboard using token-scoped permissions
  → User NEVER logs into Superset directly
```

### 4.5 Metrics Catalog Data Flow

```
Snowflake Semantic Layer (dbt metrics definitions)
  → Metadata extraction job (scheduled)
  → Portal database (metrics index: name, domain, description, owner, status, lineage)
  → Metrics Catalog UI displays:
      - Metric definitions
      - Owners
      - Certification status (Certified / Draft / Deprecated)
      - Lineage (upstream models)
      - Dashboard usage (which dashboards use this metric)
```

### 4.6 AI Assistant Data Flow

```
User asks question
  → AI Assistant UI
  → Portal backend retrieves semantic layer context (available metrics, dimensions, definitions)
  → Claude API generates SQL using semantic model (prevents hallucinated metrics)
  → SQL executes against Snowflake (using user's runtime role)
  → Results returned
  → Claude generates natural language answer + optional visualization spec
  → Response displayed to user
```

### 4.7 Dashboard Creation Data Flow

```
A) Spreadsheet path:
   User uploads file → parse client-side → preview → user describes → 
   Claude API generates dashboard spec (JSON) → render preview → 
   user iterates / accepts → save to DB → appears in Community tab

B) AI Assistant path:
   User asks question → Claude generates answer + viz → user clicks "Save as Dashboard" →
   viz spec becomes dashboard → user adds metadata → save to DB → Community tab

C) BI takeover path:
   Popular community dashboard → BI opens review queue →
   BI verifies (badge) OR takes over → clones spec → rebuilds in Superset →
   production dashboard linked back to original → creator notified
```

---

## 5. Permission Model (Detailed)

### 5.1 Core Principle

**Snowflake roles = single source of truth for data access.**

No business permissions live in:
- ❌ The portal application
- ❌ Superset
- ❌ Any middleware layer

### 5.2 Runtime Role Propagation

```
┌─────────┐     ┌──────────┐     ┌───────────────┐     ┌───────────┐
│  User   │────▶│  Portal  │────▶│ Role Mapping  │────▶│ Snowflake │
│ (SSO)   │     │ (identity)│    │ (user→role)   │     │ (enforces)│
└─────────┘     └──────────┘     └───────────────┘     └───────────┘
                                                              │
                                                   ┌──────────┴──────────┐
                                                   │                     │
                                              Table access         Row-level
                                              Schema access        security
                                              Column masking       Secure views
```

### 5.3 What Each System Does

| System | Responsibility | Does NOT do |
|--------|---------------|-------------|
| Portal | Auth, routing, UI, role context propagation | Permission enforcement |
| Superset | Visualization, query orchestration | Permission ownership |
| Snowflake | All data access control, RLS, secure views | UI rendering |

### 5.4 Concurrent User Safety

Multiple users with different Snowflake roles can query in parallel. Each query session carries the user's runtime role. Snowflake handles isolation natively — no application-level locking or permission checks needed.

---

## 6. Observability & Governance

| Capability | Purpose |
|------------|---------|
| Query logging | Track what queries run, by whom, cost, duration |
| Usage tracking | Dashboard views, metric page visits, popular searches |
| Dashboard analytics | Which dashboards are used, by whom, how often |
| Metric usage monitoring | Which metrics are queried, trending, underused |
| AI Assistant audit | Questions asked, SQL generated, accuracy tracking |

---

## 7. Implementation Priority (Updated)

### Phase 1 — Production Foundation (already prototyped)
1. ✅ Dashboard creation wizard (spreadsheet + chat paths)
2. ✅ Community dashboards tab with status system
3. ✅ Claude-generated dashboard spec rendering
4. ✅ Team-based sharing UX
5. Migrate prototype to Next.js + proper build system
6. Set up SSO authentication
7. Set up Snowflake connection + role mapping

### Phase 2 — Real Data & AI
8. Real file upload/parsing (Papa Parse, SheetJS)
9. Wire Claude API reliably (streaming, retry, error handling)
10. Connect AI Assistant to Snowflake semantic layer
11. Superset embedding (guest token flow)
12. Metrics catalog populated from dbt metadata

### Phase 3 — BI Workflow & Governance
13. BI review queue (admin panel)
14. Verify / request changes / take over actions
15. Notifications system (in-app + email)
16. Observability layer (query logging, usage tracking)
17. Dashboard analytics

### Phase 4 — Polish & Scale
18. Executive dashboard app (pixel-perfect, board-ready)
19. Metric lineage visualization
20. Dashboard version history
21. Export capabilities (PDF, PNG, scheduled reports)
22. Row-level security testing across all embedding paths

---

## 8. Out of Scope (for now)

- Real-time collaboration on dashboards
- Multi-tenant deployment
- Custom alerting rules
- Mobile-native app
- Data write-back capabilities
