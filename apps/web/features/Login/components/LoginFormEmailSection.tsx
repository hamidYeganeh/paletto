"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ControlledInput, SubmitButton } from "@repo/ui/Form";
import { motion } from "framer-motion";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  LoginTransitionSteps,
  useLoginLayoutStore,
} from "../store/LoginLayoutStore";
import {
  loginEmailSchema,
  type LoginEmailValues,
} from "../validation/loginSchemas";
import { fadeInDown, fadeInUp } from "./loginFormAnimations";

export const LoginFormEmailSection = () => {
  const t = useTranslations();
  const isLayoutTransformed = useLoginLayoutStore(
    (state) => state.isLayoutTransformed
  );
  const goToStep = useLoginLayoutStore((state) => state.goToStep);
  const setLayoutTransformed = useLoginLayoutStore(
    (state) => state.setLayoutTransformed
  );
  const setEmail = useLoginLayoutStore((state) => state.setEmail);
  const setSignedUpBefore = useLoginLayoutStore(
    (state) => state.setSignedUpBefore
  );

  const form = useForm<LoginEmailValues>({
    resolver: zodResolver(loginEmailSchema),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  return (
    <FormProvider {...form}>
      <form
        className="w-full max-w-lg mx-auto flex flex-col gap-4"
        onSubmit={form.handleSubmit((values) => {
          setEmail(values.email);
          setSignedUpBefore(undefined);
          goToStep(LoginTransitionSteps.PASSWORD);
        })}
        noValidate
      >
        {isLayoutTransformed && (
          <motion.div layout {...fadeInUp}>
            <p className="text-white text-lg font-bold select-none">
              {t("Auth.Login.form.login-register-label")}
            </p>
          </motion.div>
        )}

        <ControlledInput
          control={form.control}
          name="email"
          fullWidth
          type="email"
          t={t}
          onFocus={() => setLayoutTransformed(true)}
          label={
            isLayoutTransformed
              ? "\u00A0"
              : t("Auth.Login.form.login-register-label")
          }
          placeholder={t("Auth.Login.form.login-register-placeholder")}
        />

        {isLayoutTransformed && (
          <motion.div layout {...fadeInDown}>
            <SubmitButton size="xs" disabled={!form.formState.isValid}>
              {t("Auth.Login.form.login-submit")}
            </SubmitButton>
          </motion.div>
        )}
      </form>
    </FormProvider>
  );
};
