"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ControlledInput, SubmitButton } from "@repo/ui/Form";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useUpdateUserProfile } from "@repo/api";
import {
  LoginTransitionSteps,
  useLoginLayoutStore,
} from "../store/LoginLayoutStore";
import {
  registerProfileSchema,
  type RegisterProfileValues,
} from "../validation/loginSchemas";
import { fadeInDown, fadeInUp } from "./loginFormAnimations";

export const LoginFormRegisterSection = () => {
  const t = useTranslations();
  const goToStep = useLoginLayoutStore((state) => state.goToStep);
  const signedUpBefore = useLoginLayoutStore(
    (state) => state.signedUpBefore
  );
  const setSignedUpBefore = useLoginLayoutStore(
    (state) => state.setSignedUpBefore
  );
  const router = useRouter();

  const { mutateAsync: updateProfile, isPending } = useUpdateUserProfile();

  useEffect(() => {
    if (signedUpBefore === false) return;
    if (signedUpBefore === true) {
      router.replace("/");
      return;
    }
    goToStep(LoginTransitionSteps.EMAIL);
  }, [goToStep, router, signedUpBefore]);

  const form = useForm<RegisterProfileValues>({
    resolver: zodResolver(registerProfileSchema),
    defaultValues: { name: "" },
    mode: "onChange",
  });

  const handleSubmit = async (values: RegisterProfileValues) => {
    try {
      await updateProfile({ name: values.name });
      setSignedUpBefore(true);
      router.replace("/");
    } catch (error) {
      const message = t("Errors.Common.generic");
      form.setError("name", { message });
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
            {t("Auth.Login.form.app-welcome")}
          </p>
        </motion.div>

        <ControlledInput
          control={form.control}
          name="name"
          fullWidth
          t={t}
          label={t("Auth.Login.form.username-label")}
          placeholder={t("Auth.Login.form.username-placeholder")}
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
