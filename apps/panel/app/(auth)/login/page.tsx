"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/Button";
import { getAuthToken, useSignIn } from "@repo/api";
import { useTranslations } from "@repo/i18n/client";
import { getApiErrorMessage } from "../../lib/apiErrors";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("Panel");
  const { mutateAsync: signIn, isPending } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      router.replace("/techniques");
    }
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      await signIn({ email, password });
      router.replace("/techniques");
    } catch (err) {
      setError(
        getApiErrorMessage(err, t("errors.login"))
      );
    }
  };

  return (
    <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="glass-surface relative overflow-hidden rounded-[32px] border border-black/10 px-8 py-10 md:px-12 md:py-12">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-panel-warm/60 blur-2xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-10 translate-y-10 rounded-full bg-panel-accent/20 blur-2xl" />
        <p className="text-xs uppercase tracking-[0.3em] text-panel-muted">
          {t("auth.login.brand")}
        </p>
        <h1 className="mt-5 font-serif text-4xl text-panel-ink md:text-5xl">
          {t("auth.login.heroTitle")}
        </h1>
        <p className="mt-4 max-w-md text-sm text-panel-muted">
          {t("auth.login.heroDescription")}
        </p>
        <div className="mt-10 grid gap-4 text-sm text-panel-muted">
          <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-panel-muted">
              {t("auth.login.workflowLabel")}
            </p>
            <p className="mt-2 text-sm text-panel-ink">
              {t("auth.login.workflowDescription")}
            </p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-panel-muted">
              {t("auth.login.guardrailsLabel")}
            </p>
            <p className="mt-2 text-sm text-panel-ink">
              {t("auth.login.guardrailsDescription")}
            </p>
          </div>
        </div>
      </section>

      <section className="glass-surface rounded-[32px] border border-black/10 px-8 py-10 md:px-12 md:py-12">
        <div className="animate-fade-up">
          <p className="text-xs uppercase tracking-[0.3em] text-panel-muted">
            {t("auth.login.accessLabel")}
          </p>
          <h2 className="mt-4 font-serif text-3xl text-panel-ink">
            {t("auth.login.title")}
          </h2>
          <p className="mt-3 text-sm text-panel-muted">
            {t("auth.login.description")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
          <label className="grid gap-2 text-sm font-semibold text-panel-ink">
            {t("auth.login.emailLabel")}
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t("auth.login.emailPlaceholder")}
              className="h-12 rounded-2xl border border-black/10 bg-white/80 px-4 text-sm text-panel-ink shadow-sm transition focus:border-panel-accent focus:outline-none"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-panel-ink">
            {t("auth.login.passwordLabel")}
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={t("auth.login.passwordPlaceholder")}
              className="h-12 rounded-2xl border border-black/10 bg-white/80 px-4 text-sm text-panel-ink shadow-sm transition focus:border-panel-accent focus:outline-none"
            />
          </label>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <Button
            type="submit"
            size="lg"
            color="primary"
            disabled={isPending}
            className="w-full"
          >
            {isPending ? t("auth.login.submitting") : t("auth.login.submit")}
          </Button>
        </form>
      </section>
    </div>
  );
}
