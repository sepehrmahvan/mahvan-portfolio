# Project Structure Guide

> Source of truth for this project's architecture.
> When creating or editing code, follow the structure and rules below.
> Priority: **simple and readable**. Any developer should find any file in seconds.
> The project uses a **flat root-level layout (no `src/` folder)**. Path alias: `@/*` -> `./*`.

## Stack

| Concern | Library |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Client state | Zustand |
| Server state / cache | TanStack React Query |
| HTTP | Axios |
| Forms / UI | Material UI (MUI) |
| Tables | MUI X Data Grid |
| Charts | Chart.js + react-chartjs-2 |
| Styling | Tailwind CSS |
| i18n | i18next + react-i18next |

## Languages

- **Primary: English (`en`), LTR.** Default language and default direction.
- **Persian (`fa`), RTL.** Also supported.
- **Arabic (`ar`), RTL.** Same direction helpers as Persian (`isRtlLocale`).
- **Russian (`ru`), LTR.**
- **Chinese Simplified (`zh`), LTR.**
- **Japanese (`ja`), LTR.**
- **German (`de`), LTR.**
- Locale lives in the URL: `/en/...`, `/fa/...`, `/ar/...`, `/ru/...`, `/zh/...`, `/ja/...`, `/de/...`. Visiting `/` redirects to `/en`.

---

## Folder Structure

```
.
├── .cursor/                  # Cursor rules (rules/*.mdc)
├── app/                      # Routing only. Pages stay thin.
│   └── [lang]/               # fa | en
│       ├── layout.tsx        # sets <html lang dir>, mounts providers
│       ├── page.tsx
│       ├── (auth)/           # login, register, forgot-password
│       └── (dashboard)/      # protected pages
│           ├── layout.tsx
│           └── users/page.tsx
│
├── auth/                     # Auth logic: token helpers, session, route guards
│   ├── token.ts              # get/set/remove token
│   ├── session.ts            # read current user/session
│   └── guards.tsx            # <AuthGuard>, <GuestGuard>
│
├── components/               # All UI components
│   ├── ui/                   # Base pieces (Button, Modal, Loading, EmptyState)
│   ├── layout/               # Header, Sidebar, PageContainer, LanguageSwitcher
│   ├── form/                 # Reusable MUI form fields
│   ├── data-grid/            # Shared DataGrid wrapper
│   ├── charts/               # Chart.js wrappers (LineChart, BarChart)
│   └── users/                # Feature components: UsersTable.tsx, UserForm.tsx
│
├── constants/                # routes.ts, env.ts, query-keys.ts
├── deploy/                   # Deployment configs (nginx, k8s, compose, ...)
│
├── hooks/                    # All hooks
│   ├── queries/              # React Query hooks: useUsers.ts, useCreateUser.ts
│   ├── useDirection.ts       # 'rtl' | 'ltr' from locale
│   └── useDebounce.ts
│
├── lib/                      # Third-party setup, one file/folder per library
│   ├── axios.ts              # instance + interceptors
│   ├── react-query.ts        # QueryClient defaults
│   ├── chartjs.ts            # register Chart.js modules once
│   ├── i18n/                 # settings.ts, client.ts, server.ts
│   └── mui/                  # theme.ts, rtl-cache.tsx
│
├── locales/                  # Translation files
│   ├── fa/                   # common.json, users.json, ...
│   └── en/                   # same file names and keys as fa
│
├── providers/                # QueryProvider, ThemeProvider (MUI + direction), I18nProvider, AppProviders.tsx
├── public/                   # Static files (images, fonts, icons)
├── scripts/                  # Utility scripts (e.g. check-translations.ts)
│
├── services/                 # API calls, one file per domain
│   ├── users.service.ts
│   └── auth.service.ts
│
├── store/                    # Zustand stores: auth.store.ts, ui.store.ts
├── types/                    # Shared types: api.ts (ApiResponse, Pagination), user.ts
├── utils/                    # Pure helpers: format.ts, cn.ts
│
├── proxy.ts                  # Locale redirect + auth redirect (Next.js 16; formerly middleware.ts)
├── next.config.ts
├── tsconfig.json
├── AGENTS.md / CLAUDE.md     # AI assistant instructions (point to this document)
├── Dockerfile                # Local / dev image
├── DockerfileStage           # Staging image
├── DockerfilePro             # Production image
├── .dockerignore
├── .gitlab-ci.yml            # CI/CD pipeline
├── .gitignore
└── .env / .env.local / .env.staging / .env.production
```

### "Where does my code go?"

| I want to... | Put it in |
|---|---|
| Add a page | `app/[lang]/.../page.tsx` (compose components only, no logic) |
| Call a backend endpoint | `services/<domain>.service.ts` |
| Fetch/cache that data in a component | `hooks/queries/use<Thing>.ts` |
| Build a component for one feature | `components/<feature>/` |
| Build a component used in many places | `components/ui/` or `components/form/` |
| Keep client state (sidebar, filters) | `store/<name>.store.ts` |
| Handle login token / route protection | `auth/` |
| Add a translation | `locales/fa/<ns>.json` **and** `locales/en/<ns>.json` |
| Configure a library | `lib/` |
| Add a type used in many places | `types/` |
| Add a constant / route / query key | `constants/` |

### Data flow (keep it this simple)

```
Component -> hooks/queries/useX.ts -> services/x.service.ts -> lib/axios.ts -> Backend
```

- `app` -> `components` -> `hooks` -> `services` -> `lib`. Never import in the reverse direction.
- Components never call `services/` directly and never import `axios`.

---

## Core Rules

### Data (Axios + React Query)
- One Axios instance in `lib/axios.ts`. Interceptors: attach token (from `auth/token.ts`), send `Accept-Language` from current locale, normalize errors, handle 401.
- Services return typed data only; no UI code in services.
- Query keys come from `constants/query-keys.ts`.
- After a mutation succeeds, invalidate related queries.

### State (Zustand)
- Server data belongs to React Query, **not** Zustand.
- Zustand is for client state only (auth user, sidebar, theme mode, filters).
- Use selectors: `useUiStore(s => s.sidebarOpen)`.

### Auth
- Token helpers and guards live in `auth/`; the current user lives in `store/auth.store.ts`.
- `proxy.ts` redirects unauthenticated users to `/{lang}/login` for protected routes.

### Styling (Tailwind + MUI)
- Tailwind for layout and spacing; MUI for form controls and DataGrid.
- Avoid style conflicts: use MUI `CssBaseline` and make sure Tailwind utilities can override MUI (CSS layers via `enableCssLayer`, or disable Tailwind preflight). Pick one approach and keep it.
- Use a `cn()` helper (clsx + tailwind-merge) for conditional classes.

### Forms
- MUI inputs + `react-hook-form` + `zod`. Validation messages go through i18n.

### Tables
- Always use the wrapper in `components/data-grid/` (pagination, locale text, empty state, loading).
- Define columns inside the feature component. Prefer server-side pagination/sorting.

### Charts
- Register Chart.js modules once in `lib/chartjs.ts`.
- Chart wrappers are `'use client'` and take data/options via props.

### Next.js
- Server Components by default. Use `'use client'` only for hooks, MUI interactivity, charts, stores.
- MUI + App Router needs `@mui/material-nextjs` (`AppRouterCacheProvider`) for SSR styles.
- Env variables are read only through `constants/env.ts`. Never commit secrets; keep `.env.example` updated if used.

---

## RTL / LTR Guide (important)

Persian is the default, so **design RTL first, then verify LTR**.

### 1. Direction and language
- `app/[lang]/layout.tsx` sets `<html lang={lang} dir={lang === 'fa' ? 'rtl' : 'ltr'}>`.
- `hooks/useDirection.ts` returns `'rtl' | 'ltr'` from the locale. Use it everywhere; never hardcode direction.

### 2. MUI
- `lib/mui/theme.ts` creates the theme with `direction` based on locale.
- `lib/mui/rtl-cache.tsx` provides two emotion caches: RTL (with `stylis-plugin-rtl`) and LTR. Pick by locale.
- `providers/ThemeProvider.tsx` wires cache + theme + `CssBaseline` and switches when the locale changes.
- Use `faIR` locale text for MUI and DataGrid when `fa`, `enUS` when `en`.

### 3. Tailwind
Use **logical** utilities so layouts flip automatically:

| Avoid | Use |
|---|---|
| `ml-4` / `mr-4` | `ms-4` / `me-4` |
| `pl-4` / `pr-4` | `ps-4` / `pe-4` |
| `left-0` / `right-0` | `start-0` / `end-0` |
| `text-left` / `text-right` | `text-start` / `text-end` |
| `border-l` / `rounded-r` | `border-s` / `rounded-e` |

For rare cases that must differ, use `rtl:` and `ltr:` variants (e.g. `rtl:rotate-180`).

### 4. Icons
- Directional icons (arrows, chevrons, back/next) must mirror in RTL: `rtl:rotate-180` or `rtl:-scale-x-100`.
- Non-directional icons (search, close, user) are never mirrored.

### 5. Fonts
- Persian: Vazirmatn (or the project's chosen font), loaded with `next/font`.
- English: Inter (or similar). Apply the font per locale on `<html>`/`<body>`.

### 6. Numbers and dates
- All formatting goes through `utils/format.ts` using `Intl` with the active locale.
- `fa`: Persian digits and Jalali calendar (`fa-IR-u-ca-persian`). `en`: Latin digits and Gregorian.
- Never format dates/numbers inline in components.

### 7. Charts (Chart.js)
- Pass `rtl` to chart options based on locale (legend, tooltip, text alignment) and set the chart font to the locale font.
- Mirror the x-axis (`reverse: true`) for time-series only if the design requires right-to-left reading.

### 8. DataGrid
- The shared wrapper sets `localeText` and inherits direction from the MUI theme. Pinned columns and pagination flip automatically.

### 9. Mixed content
- Wrap English text/numbers inside Persian paragraphs (emails, URLs, codes) in `<bdi>` or use `dir="auto"` / `dir="ltr"`.
- Inputs for email, phone, URL, and code use `dir="ltr"` even on the Persian page.

### 10. Testing checklist
- Check every new screen in both `/fa` and `/en`.
- Look at: alignment, icon direction, spacing, table layout, chart legend, form errors, long text wrapping.

---

## i18n Rules (i18next)

- Config in `lib/i18n/settings.ts` / `types/locale.ts`: `defaultLocale = 'en'`, list of namespaces.
- Translation files: `locales/<lang>/<namespace>.json`. Both languages must have the **same keys** (`scripts/` can include a check for this).
- Namespaces: `common` plus one per feature (e.g. `users`).
- No hardcoded user-facing text. Always `t('namespace:key')`.
- Keys are English, lowercase, dot-separated: `table.empty`.
- Server components use `getTranslation()` from `lib/i18n/server.ts`; client components use `useTranslation()`.
- `proxy.ts` redirects a missing/unknown locale to `fa`.

---

## Naming Conventions

- Components: `PascalCase.tsx`. Hooks: `useThing.ts`. Services: `name.service.ts`. Stores: `name.store.ts`. Folders: `kebab-case`.
- Named exports everywhere; default export only for Next.js special files (`page`, `layout`, `error`...).
- One component per file. Props interface named `<Component>Props`.
- TypeScript strict, no `any`. Absolute imports with `@/`.

---

## Install

```bash
npm i zustand @tanstack/react-query axios
npm i @mui/material @mui/icons-material @mui/x-data-grid @emotion/react @emotion/styled @emotion/cache @mui/material-nextjs stylis stylis-plugin-rtl
npm i chart.js react-chartjs-2
npm i i18next react-i18next i18next-resources-to-backend accept-language
npm i react-hook-form zod @hookform/resolvers clsx tailwind-merge
npm i -D tailwindcss postcss autoprefixer prettier-plugin-tailwindcss
```

---

## Initial Tasks (in order)

1. Create the folder structure above with placeholder files.
2. Set up `lib/axios.ts`, `lib/react-query.ts`, and `constants/query-keys.ts`.
3. Set up i18n (`fa` default, `en` second), the `[lang]` segment, and `proxy.ts`.
4. Set up the MUI theme + RTL/LTR emotion caches + Tailwind/MUI style-order fix.
5. Create `providers/AppProviders.tsx` and mount it in `app/[lang]/layout.tsx`.
6. Set up `auth/` (token, session, guards) and `store/auth.store.ts`.
7. Add a language switcher in the header (changes the URL locale; direction flips).
8. Create shared wrappers: DataGrid, charts, form fields.
9. Build one example feature (`users`): `services/users.service.ts` -> `hooks/queries/useUsers.ts` -> `components/users/UsersTable.tsx` + `UserForm.tsx`, with `fa` and `en` translations.
