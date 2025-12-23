"use client";

import { useTranslations } from "@repo/i18n/client";

export default function I18nDemo() {
  const t = useTranslations();

  return (
    <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-black/10 bg-white/80 p-5 shadow-[0_12px_40px_-24px_rgba(0,0,0,0.45)]">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/50">
        Client
      </p>
      <p className="text-lg font-semibold text-black/80">
        {t("Metadata.appName")}
      </p>
      <p className="text-sm text-black/60">
        {t("Login.form.login-register-label")}
      </p>
    </section>
  );
}
