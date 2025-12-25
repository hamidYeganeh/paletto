"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ControlledInput, SubmitButton } from "@repo/ui/Form";
import { AnimatePresence, motion } from "framer-motion";
import { FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  LoginTransitionSteps,
  useLoginLayoutStore,
} from "../store/LoginLayoutStore";
import {
  loginEmailSchema,
  type LoginEmailValues,
  loginPasswordSchema,
  type LoginPasswordValues,
  registerUsernameSchema,
  type RegisterUsernameValues,
} from "../validation/loginSchemas";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0,
  }),
};

const springyFade = {
  stiffness: 240,
  damping: 26,
};

const fadeInUp = {
  transition: { ...springyFade, delay: 0.2 },
  initial: { y: -16, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 16, opacity: 0 },
};

const fadeInDown = {
  transition: { ...springyFade, delay: 0.2 },
  initial: { y: 16, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -16, opacity: 0 },
};

interface LoginFormProps {}

export const LoginForm: FC<LoginFormProps> = () => {
  const step = useLoginLayoutStore((state) => state.step);
  const direction = useLoginLayoutStore((state) => state.direction);

  return (
    <AnimatePresence custom={direction} mode="wait">
      <motion.div
        key={step}
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="w-full"
      >
        {step === LoginTransitionSteps.EMAIL && <LoginFormEmailSection />}
        {step === LoginTransitionSteps.PASSWORD && <LoginFormPasswordSection />}
        {step === LoginTransitionSteps.REGISTER && <LoginFormRegisterSection />}
      </motion.div>
    </AnimatePresence>
  );
};

const LoginFormEmailSection = () => {
  const t = useTranslations();
  const isLayoutTransformed = useLoginLayoutStore(
    (state) => state.isLayoutTransformed
  );
  const goToStep = useLoginLayoutStore((state) => state.goToStep);
  const setLayoutTransformed = useLoginLayoutStore(
    (state) => state.setLayoutTransformed
  );

  const form = useForm<LoginEmailValues>({
    resolver: zodResolver(loginEmailSchema),
    defaultValues: { email: "" },
    mode: "onSubmit",
  });

  return (
    <FormProvider {...form}>
      <form
        className="w-full max-w-lg mx-auto flex flex-col gap-4"
        onSubmit={form.handleSubmit(() => goToStep(LoginTransitionSteps.PASSWORD))}
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
            <SubmitButton>{t("Auth.Login.form.login-submit")}</SubmitButton>
          </motion.div>
        )}
      </form>
    </FormProvider>
  );
};

const LoginFormPasswordSection = () => {
  const t = useTranslations();
  const goToStep = useLoginLayoutStore((state) => state.goToStep);

  const form = useForm<LoginPasswordValues>({
    resolver: zodResolver(loginPasswordSchema),
    defaultValues: { password: "" },
    mode: "onSubmit",
  });

  return (
    <FormProvider {...form}>
      <form
        className="w-full max-w-lg mx-auto flex flex-col gap-4"
        onSubmit={form.handleSubmit(() => goToStep(LoginTransitionSteps.REGISTER))}
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
          description={t("Auth.Login.form.password-description")}
          endContent={<>EYE</>}
        />

        <motion.div layout {...fadeInDown}>
          <SubmitButton>{t("Common.general.continue")}</SubmitButton>
        </motion.div>
      </form>
    </FormProvider>
  );
};

const LoginFormRegisterSection = () => {
  const t = useTranslations();
  const goToStep = useLoginLayoutStore((state) => state.goToStep);

  const form = useForm<RegisterUsernameValues>({
    resolver: zodResolver(registerUsernameSchema),
    defaultValues: { username: "" },
    mode: "onSubmit",
  });

  return (
    <FormProvider {...form}>
      <form
        className="w-full max-w-lg mx-auto flex flex-col gap-4"
        onSubmit={form.handleSubmit(() => goToStep(LoginTransitionSteps.PASSWORD))}
        noValidate
      >
        <motion.div layout {...fadeInUp}>
          <p className="text-white text-lg font-bold select-none">
            {t("Auth.Login.form.app-welcome")}
          </p>
        </motion.div>

        <ControlledInput
          control={form.control}
          name="username"
          fullWidth
          t={t}
          label={t("Auth.Login.form.username-label")}
          placeholder={t("Auth.Login.form.username-placeholder")}
        />

        <motion.div layout {...fadeInDown}>
          <SubmitButton>{t("Common.general.continue")}</SubmitButton>
        </motion.div>
      </form>
    </FormProvider>
  );
};
