import faCommon from "./messages/fa/Common.json";
import faAuth from "./messages/fa/Auth.json";
import faErrors from "./messages/fa/Errors.json";

export type Messages = {
  Common: typeof faCommon;
  Auth: typeof faAuth;
  Errors: typeof faErrors;
};
