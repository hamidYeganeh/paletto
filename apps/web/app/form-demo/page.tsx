"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ControlledInput } from "./_components/ControlledInput";
import { SubmitButton } from "./_components/SubmitButton";
import { useState } from "react";
import { Button } from "@repo/ui/Button";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  portfolio: z.string().url("Provide a valid URL").optional().or(z.literal("")),
  note: z.string().min(10, "Tell us a bit more (min 10 chars)"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function FormDemoPage() {
  const methods = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      portfolio: "",
      note: "",
    },
  });
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const onSubmit = async (values: ContactFormValues) => {
    setServerMessage(null);
    await new Promise((resolve) => setTimeout(resolve, 800)); // simulate network
    setServerMessage(`Saved. We’ll reach out to ${values.email} soon.`);
  };

  return (
    <div className="min-h-dvh bg-primary-100 px-6 py-12">
      <div className="mx-auto max-w-3xl space-y-8 rounded-3xl border border-black/10 bg-white/85 p-8 shadow-[0_12px_40px_-24px_rgba(0,0,0,0.45)]">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/50">
            Form demo
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-black/85">
            Controlled inputs with React Hook Form + Zod
          </h1>
          <p className="text-sm text-black/60">
            Reusable controlled Input/Button wrappers that stay type-safe and easy to extend.
          </p>
        </header>

        <FormProvider {...methods}>
          <form className="space-y-4" onSubmit={methods.handleSubmit(onSubmit)} noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <ControlledInput name="name" label="Full name" placeholder="Ava Serrano" />
              <ControlledInput
                name="email"
                label="Email"
                placeholder="ava@paletto.com"
                autoComplete="email"
              />
            </div>
            <ControlledInput
              name="portfolio"
              label="Portfolio URL"
              placeholder="https://"
              description="Optional — helps us learn your style."
            />
            <div className="space-y-2">
              <label className="text-sm font-semibold text-black/80" htmlFor="note">
                What are you looking for?
              </label>
              <textarea
                id="note"
                className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-black/80 shadow-inner outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                rows={4}
                placeholder="Commission, curation help, or general questions..."
                {...methods.register("note")}
                disabled={methods.formState.isSubmitting}
              />
              {methods.formState.errors.note?.message && (
                <p className="text-xs text-red-600">{methods.formState.errors.note.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <SubmitButton label="Send request" loadingLabel="Sending..." />
              <Button type="button" onClick={() => methods.reset()} disabled={methods.formState.isSubmitting}>
                Reset
              </Button>
            </div>
            {serverMessage && (
              <p className="text-sm font-semibold text-emerald-700">{serverMessage}</p>
            )}
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
