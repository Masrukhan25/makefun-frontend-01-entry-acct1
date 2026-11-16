# makefun-frontend-01-entry-acct1
A small, read-only make.fun bounty desk with live rewards, filters, leaderboards, public profiles, and dark/light themes.

[![make.fun · makefun-frontend-01](https://make.fun/badge/makefun-frontend-01.svg)](https://make.fun/bounty/makefun-frontend-01?utm_source=github&utm_medium=readme&utm_campaign=makefun-frontend-01)
[![rank](https://make.fun/badge/makefun-frontend-01/Masrukhan25/makefun-frontend-01-entry-acct1/rank.svg)](https://make.fun/bounty/makefun-frontend-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=makefun-frontend-01)
[![reward](https://make.fun/badge/makefun-frontend-01/Masrukhan25/makefun-frontend-01-entry-acct1/reward.svg)](https://make.fun/bounty/makefun-frontend-01?utm_source=github&utm_medium=readme&utm_campaign=makefun-frontend-01)

Entered on make.fun · referral code `p31a94kt`

Run locally with Node 22.18+: `node serve.ts`, then open http://localhost:8080.
Build the hand-in with `MAKEFUN_OUTPUT_DIR=out node main.ts`. The kit's unchanged dossier builder requires screenshots; add three real live-data screenshots before the final hand-in.

All runtime API calls are public GETs to make.fun, with in-memory ETag revalidation. No build step, dependencies, authentication, or writes. The profile endpoint is discovered from the public OpenAPI document. Routes: `#/`, `#/bounty/<slug>`, `#/bounty/<slug>/leaderboard`, `#/profile/<handle>`.
