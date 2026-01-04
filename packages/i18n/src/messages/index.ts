import faCommon from "./fa/Common.json";
import faAuth from "./fa/Auth.json";
import faErrors from "./fa/Errors.json";
import faPanel from "./fa/Panel.json";

export const messagesByLocale = {
  fa: {
    Common: faCommon,
    Auth: faAuth,
    Errors: faErrors,
    Panel: faPanel,
  },
} as const;

export const fa = messagesByLocale.fa;
