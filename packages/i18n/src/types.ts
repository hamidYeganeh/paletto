import type { messagesByLocale } from "./messages";

export type Messages = (typeof messagesByLocale)["en"];
