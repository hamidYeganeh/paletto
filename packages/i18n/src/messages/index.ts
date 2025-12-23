import enCommon from "./en/Common.json";
import enAuth from "./en/Auth.json";
import faCommon from "./fa/Common.json";
import faAuth from "./fa/Auth.json";

const en = {
  ...enCommon,
  ...enAuth,
} as const;

const fa = {
  ...faCommon,
  ...faAuth,
} as const;

export const messagesByLocale = {
  en,
  fa,
} as const;

export { en, fa };
