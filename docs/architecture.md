# Architecture

```
Browser → apps/web → REST /api/v1 → apps/api → MongoDB
                                 ├→ Redis (optional OTP/cache)
                                 └→ MongoMemoryServer when MONGO_MEMORY=1
```

Shared types: `@workspace/shared`. Auth: JWT + OTP (dev code `123456`).
