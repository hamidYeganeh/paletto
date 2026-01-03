"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ControlledInput, SubmitButton } from "@repo/ui/Form";
import { motion } from "framer-motion";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ApiError, useSignIn } from "@repo/api";
import {
  LoginTransitionSteps,
  useLoginLayoutStore,
} from "../store/LoginLayoutStore";
import {
  loginPasswordSchema,
  type LoginPasswordValues,
} from "../validation/loginSchemas";
import { fadeInDown, fadeInUp } from "./loginFormAnimations";

export const LoginFormPasswordSection = () => {
  const t = useTranslations();
  const goToStep = useLoginLayoutStore((state) => state.goToStep);
  const email = useLoginLayoutStore((state) => state.email);
  const setSignedUpBefore = useLoginLayoutStore(
    (state) => state.setSignedUpBefore
  );
  const router = useRouter();

  const { mutateAsync: signIn, isPending } = useSignIn();

  const form = useForm<LoginPasswordValues>({
    resolver: zodResolver(loginPasswordSchema),
    defaultValues: { password: "" },
    mode: "onChange",
  });

  const handleSubmit = async (values: LoginPasswordValues) => {
    if (!email) {
      form.setError("password", {
        message: t("Auth.Login.validation.email-required"),
      });
      goToStep(LoginTransitionSteps.EMAIL);
      return;
    }

    try {
      const session = await signIn({ email, password: values.password });
      setSignedUpBefore(session.signedUpBefore);

      if (session.signedUpBefore) {
        router.replace("/");
        return;
      }

      goToStep(LoginTransitionSteps.REGISTER);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? t("Errors.Auth.invalidCredentials")
          : t("Errors.Common.generic");
      form.setError("password", { message });
    }
  };

  return (
    <FormProvider {...form}>
      <form
        className="w-full max-w-lg mx-auto flex flex-col gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
        noValidate
      >
        <motion.div layout {...fadeInUp}>
          <p className="text-white text-lg font-bold select-none">
            {t("Auth.Login.form.password-label")}
          </p>
        </motion.div>

        <ControlledInput
          control={form.control}
          name="password"
          fullWidth
          type="password"
          t={t}
          label={"\u00A0"}
          placeholder={t("Auth.Login.form.password-placeholder")}
          description={
            email ? t("Auth.Login.form.password-description") : undefined
          }
        />

        <motion.div layout {...fadeInDown}>
          <SubmitButton
            size="xs"
            disabled={!form.formState.isValid || isPending}
            isLoading={isPending}
          >
            {t("Common.general.continue")}
          </SubmitButton>
        </motion.div>
      </form>
    </FormProvider>
  );
};
