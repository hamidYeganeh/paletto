# QA / PO review notes (2026-08-11)

## Fixed this pass

| Severity | Issue | Fix |
|----------|--------|-----|
| P0 | Product positioned as museum, not marketplace | Landing Meta/Hero/Intro + nav CTAs to marketplace/3D |
| P0 | No marketplace routes | `/artworks`, `/artists`, `/exhibitions`, `/commissions`, `/auth`, `/dashboard`, `/admin` |
| P0 | Gallery WebGL fail → infinite loader | try/catch + fallback UI |
| P0 | Mobile `touch-action: none` blocked scroll | `pan-y` |
| P0 | Missing API / shared package | NestJS API + `@workspace/shared` |
| P1 | Artist slug missing from DTO | Added `slug` to DTO + toDto |
| P1 | Only admin could create exhibitions | Artists allowed |
| P1 | English seed for IR market | Persian seed content |
| P1 | Artist could buy own work | Blocked + mark sold after pay |
| P1 | Dead landing nav (anchors only) | Marketplace links + Escape/scroll-lock menu |
| P2 | No not-found / global-error | Added |
| P2 | README still template | Rewritten |

## Verified live

- API health, seed, OTP login, order create/pay, own-work rejection, sold status
- Web pages `/`, `/artworks`, `/artists`, `/auth/login` → 200 with Persian marketplace copy

## Remaining (next iteration)

- Full i18n ar/en route segments
- Real payment gateway + Kavenegar SMS
- Exhibition layout editor (drag & place)
- Commission proposals/milestones UI
- Content moderation queue UI
- Replace remaining landing placeholder images
