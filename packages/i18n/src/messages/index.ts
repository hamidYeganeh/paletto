import faCommon from "./fa/Common.json";
import faAuth from "./fa/Auth.json";

export const messagesByLocale = {
  fa: {
    Common: faCommon,
    Auth: faAuth,
  },
} as const;

export const fa = messagesByLocale.fa;
