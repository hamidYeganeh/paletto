import { getRequestConfig } from "next-intl/server";
import { getLocale, getMessages } from "@repo/i18n/server";

export default getRequestConfig(async () => {
  const locale = await getLocale();

  return {
    locale,
    messages: await getMessages(locale),
  };
});
