# GrowWise (Next.js)

Live: https://growwise-next.netlify.app

Next.js 16 (App Router) + React 19 + Tailwind 4 port of the Laravel/Inertia GrowWise in `../grow-wise`. Same pages, components, effects, and math. No database.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # loan / capacity math (node:test)
npm run build && npm start
```

Deploy: push to GitHub; Netlify builds it via `netlify.toml` (no env vars or database needed).

## How it's put together

| What | Where |
|---|---|
| Routes (server components: read cookie, compute, render) | `app/**/page.jsx` |
| Form submits (validate, save inputs, redirect) | `app/actions.js` (server actions) |
| Visitor state (business name + each tool's inputs) | one httpOnly cookie, `lib/session.js` |
| Money math + capacity assumptions | `lib/loanMath.js` |
| Quiz questions/answers + 26 debt terms | `lib/content.js` (server-only; answers never reach the browser) |
| Page UIs, ported from Inertia | `components/pages/**` |
| Shared UI, charts, try-it widgets, CTA presets | `components/**` |
| Theme tokens | `app/globals.css` (`@theme`) |
| Fonts | Satoshi (`app/fonts`, next/font/local) + Poppins (next/font/google) |

Differences from the Laravel version: businesses and quiz results aren't saved to a database; the business name and inputs live in the visitor's cookie for 30 days.
# grow-wise-next
