import { createQueryKeys } from "../../core/queryKeys";

const factory = createQueryKeys("auth");

export const authKeys = {
  root: factory.base,
  session: () => factory.detail("session"),
  signIn: () => factory.detail("sign-in"),
};
