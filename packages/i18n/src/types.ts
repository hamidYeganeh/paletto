import faCommon from "./messages/fa/Common.json";
import faAuth from "./messages/fa/Auth.json";
import faErrors from "./messages/fa/Errors.json";
import faPanel from "./messages/fa/Panel.json";

export type Messages = {
  Common: typeof faCommon;
  Auth: typeof faAuth;
  Errors: typeof faErrors;
  Panel: typeof faPanel;
};
