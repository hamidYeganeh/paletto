# Service App User Stories

User stories based on the current NestJS service modules and controllers.

## Cross-cutting considerations
- Authentication uses JWT guards; role checks gate admin and artist endpoints.
- Validation uses DTOs for required fields, enum values, ObjectId formats, and length limits.
- List endpoints support pagination and sorting; responses include a total count plus items.
- Public list endpoints force `active` status; admin lists can query all statuses.
- Update operations require the resource id and trim string ids before validation.

## Authentication
- As a user, I want to sign in so that I can access protected endpoints.
- Details & considerations: `POST /auth/sign-in` returns a sign-in response using the configured JWT expiry; invalid credentials should return a generic auth error.

## Users
- As a signed-in user, I want to view my profile so that I can see my current account data.
- As a signed-in user, I want to update my profile so that I can keep my information current.
- As an admin, I want to list users so that I can manage the user base.
- As an admin, I want to update a user's status so that I can activate or deactivate access.
- Details & considerations: profile update supports optional `name` and `bio`; admin list supports `page`, `limit`, `search`, `status`, `sortBy`, and `sortOrder`, and returns `{ count, users }`.

## Artists
- As an artist, I want to create my artist profile so that I can publish artworks.
- As an artist, I want to update my artist profile so that my public info stays current.
- Details & considerations: artist endpoints require the `ARTIST` role and accept optional `displayName`, `techniques`, and `styles` arrays of ObjectIds.

## Artworks
- As a visitor, I want to browse active artworks so that I can discover available pieces.
- As a visitor, I want to view a specific artwork so that I can see details.
- As an artist, I want to create an artwork so that I can publish my work.
- As an artist, I want to update my artwork so that I can correct details.
- As an admin, I want to list all artworks so that I can review submissions.
- As an admin, I want to update artwork status so that I can approve or hide items.
- Details & considerations: list supports `page`, `limit`, `search`, `status`, `sortBy`, `sortOrder`, tags, and filters for `techniques`, `styles`, and `categories`; create/update accepts `title`, `description`, `images`, tags, and technique/style/category ids; update requires `artworkId`; new artworks default to `draft`; public list/get is filtered to active artworks.

## Categories
- As a visitor, I want to browse active categories so that I can filter artworks.
- As a visitor, I want to view a category so that I can see its details.
- As an admin, I want to create categories so that I can organize artworks.
- As an admin, I want to update categories so that labels stay accurate.
- As an admin, I want to update category status so that I can control visibility.
- Details & considerations: create requires `title`, `slug`, and `status` with optional `description`; update is partial and requires `categoryId`; list supports `page`, `limit`, `search`, `status`, `sortBy`, `sortOrder`.

## Styles
- As a visitor, I want to browse active styles so that I can explore different aesthetics.
- As a visitor, I want to view a style so that I can see its details.
- As an admin, I want to create styles so that I can classify artworks.
- As an admin, I want to update styles so that names and descriptions stay accurate.
- As an admin, I want to update style status so that I can control visibility.
- Details & considerations: create requires `title`, `slug`, and `status` with optional `description`; update is partial and requires `styleId`; list supports `page`, `limit`, `search`, `status`, `sortBy`, `sortOrder`.

## Techniques
- As a visitor, I want to browse active techniques so that I can filter artworks by medium.
- As a visitor, I want to view a technique so that I can see details.
- As an admin, I want to create techniques so that I can classify artworks.
- As an admin, I want to update techniques so that labels stay accurate.
- As an admin, I want to update technique status so that I can control visibility.
- Details & considerations: create requires `title`, `slug`, and `status` with optional `description`; update is partial and requires `techniqueId`; list supports `page`, `limit`, `search`, `status`, `sortBy`, `sortOrder`.

## Media
- As a client app, I want to upload a media file so that it can be stored and referenced by hash.
- As a client app, I want to fetch media by hash so that I can render uploaded assets.
- Details & considerations: upload expects multipart field `file`, stores content under `storage/media`, returns `{ hash, fileName, url }`, and sanitizes extensions; get validates hash format, resolves by hash prefix, and streams with a detected MIME type.
