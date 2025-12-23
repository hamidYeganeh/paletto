import { Button } from "@repo/ui/Button";
import { getTranslations } from "@repo/i18n/server";
import I18nDemo from "./i18n-demo";
import ApiDemo from "./api-demo";

export default async function Home() {
  const t = await getTranslations();

  return (
    <main className="bg-primary-100 min-h-dvh p-4">
      <div className="size-full flex items-center justify-center bg-secondary-200 p-4">
        <div className="max-w-6xl space-y-8">
          <section className="rounded-2xl border border-black/10 bg-white/80 p-6 shadow-[0_12px_40px_-24px_rgba(0,0,0,0.45)]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/50">
              SSR
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-black/85">
              {t("Metadata.appName")}
            </h1>
            <p className="mt-3 text-sm text-black/60">
              {t("Login.form.online-artworks-market")}
            </p>
            <div className="mt-5">
              <Button>{t("general.or")}</Button>
            </div>
          </section>
          <I18nDemo />
          <ApiDemo />
        </div>
      </div>
    </main>
  );
}
