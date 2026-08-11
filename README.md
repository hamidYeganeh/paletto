# پَلِتو (Paletto)

پلتفرم نمایش، فروش، نمایشگاه مجازی ۳بعدی و کمیسیون اثر هنری.

## Stack

- `apps/web` — Next.js 16 + next-intl + Three.js
- `apps/api` — NestJS + MongoDB + Redis (optional)
- `packages/shared` — enums & DTOs
- `packages/ui` — shadcn UI

## Quick start

```bash
npm install
npm run prepare:shared
npm run build --workspace=@workspace/api
cp apps/api/.env.example apps/api/.env   # MONGO_MEMORY=1 by default
npm run start:api                        # terminal 1
npm run dev:web                          # terminal 2 → http://127.0.0.1:3000
```

Demo OTP: `123456`  
Artist: `09120000001` · Admin: `09000000000`

## Product routes

| Path | Purpose |
|------|---------|
| `/` | Landing (product CTAs) |
| `/artworks` | Marketplace |
| `/artists` | Artist directory |
| `/exhibitions` | 3D exhibition catalog |
| `/gallery/demo?exhibition=opening-hall` | Three.js viewer |
| `/commissions` | Commission requests |
| `/auth/login` | Mobile OTP |
| `/dashboard` | Buyer/artist console |
| `/admin` | Admin metrics |

## Docs

See `prd/` and `docs/` for product and architecture notes.
