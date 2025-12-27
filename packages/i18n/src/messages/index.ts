import faCommon from "./fa/Common.json";
import faAuth from "./fa/Auth.json";
import faErrors from "./fa/Errors.json";

export const messagesByLocale = {
  fa: {
    Common: faCommon,
    Auth: faAuth,
    Errors: faErrors,
  },
} as const;

export const fa = messagesByLocale.fa;
