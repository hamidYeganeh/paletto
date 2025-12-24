import faCommon from "./messages/fa/Common.json";
import faAuth from "./messages/fa/Auth.json";

export type Messages = {
  Common: typeof faCommon;
  Auth: typeof faAuth;
};
