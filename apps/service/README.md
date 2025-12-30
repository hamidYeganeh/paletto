# Paletto Service

NestJS API service for Paletto. Provides authentication, users, artworks, media, styles, categories, and techniques endpoints backed by MongoDB.

## Tech Stack
- NestJS 10 with Express 5
- MongoDB + Mongoose
- Passport (local + JWT)
- Joi for env validation, class-validator for DTOs
- TypeScript

## Key Features
- Centralized config with validation (`src/config` + Joi schema)
- JWT authentication, guards, and strategies under `src/auth`
- Global validation pipe (whitelist + transform)
- CORS enabled for all origins
- Static media served from `storage/media` at `/medias`

## Scripts
- `dev`: `nest start --watch`
- `build`: `nest build`
- `start`: `node dist/main.js`
- `lint`: `eslint --max-warnings 0 --config eslint.config.mjs`
- `check-types`: `tsc --noEmit -p tsconfig.build.json`

## Configuration
Environment variables (validated in `src/config/env.validation.ts`):
- `NODE_ENV` (development|production|test, default: development)
- `PORT` (default: 5000)
- `APP_NAME` (default: Nest Application)
- `MONGO_URI` (required)
- `JWT_SECRET` (required, min 32 chars)
- `JWT_EXPIRES` (default: 7d)

Additional optional values used by runtime config:
- `JWT_ISSUER` (default: nest-app)
- `JWT_AUDIENCE` (default: empty string)

Example `.env`:

```env
NODE_ENV=development
PORT=5000
APP_NAME=Paletto service
MONGO_URI=mongodb://localhost:27017/paletto
JWT_SECRET=replace-with-32-chars-minimum
JWT_EXPIRES=7d
```

## Local Development
From repo root:

```sh
pnpm --filter service dev
```

Or via Turbo:

```sh
pnpm turbo run dev --filter service
```

## Structure
- `src/app.module.ts`: root module, config + mongoose wiring
- `src/main.ts`: bootstrap, CORS, validation pipe, static media
- `src/config`: app/database/jwt config + Joi schema
- `src/auth`: auth controller/service, guards, strategies, DTOs
- `src/users`: user module
- `src/artworks`, `src/media`, `src/styles`, `src/categories`, `src/techniques`: domain modules
- `src/common`: shared helpers and utilities
- `storage/media`: media files served at `/medias`
- `public`: static assets
