# @repo/i18n

Internationalization utilities and message bundles for Paletto using `next-intl`.

## Exports
From the root entry (`@repo/i18n`):
- `defaultLocale`, `locales`, and `Locale` type
- `messagesByLocale`
- `resolveLocale`
- `Messages` type

Additional entry points:
- `@repo/i18n/client`: `NextIntlClientProvider`, `useTranslations`
- `@repo/i18n/server`: `getMessages`
- `@repo/i18n/messages`: typed message bundles
- `@repo/i18n/utils`: `resolveLocale`
- `@repo/i18n/config`: locale config

## Locale Setup
- Supported locales: `fa`
- Default locale: `fa`

## Server Usage

```ts
import { getMessages } from "@repo/i18n/server";

const messages = await getMessages();
```

`getMessages` resolves locale via cookies (`NEXT_LOCALE` or `locale`) and the
`accept-language` header, then falls back to the default locale.

## Client Usage

```tsx
import { NextIntlClientProvider } from "@repo/i18n/client";
import { messagesByLocale } from "@repo/i18n";

<NextIntlClientProvider locale="fa" messages={messagesByLocale.fa}>
  {children}
</NextIntlClientProvider>;
```

## Messages
Messages live under `packages/i18n/src/messages/fa` and are organized by namespace:
- `Common.json`
- `Auth.json`
- `Errors.json`

## Notes
- `next-intl.d.ts` provides type augmentation for message keys.
