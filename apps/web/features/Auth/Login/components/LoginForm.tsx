"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ControlledInput, SubmitButton } from "@repo/ui/Form";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ApiError, useSignIn, useUpdateUserProfile } from "@repo/api";
import {
  LoginTransitionSteps,
  useLoginLayoutStore,
} from "../store/LoginLayoutStore";
import {
  loginEmailSchema,
  type LoginEmailValues,
  loginPasswordSchema,
  type LoginPasswordValues,
  registerProfileSchema,
  type RegisterProfileValues,
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

export const LoginForm = () => {
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
            <SubmitButton size={'xs'} disabled={!form.formState.isValid}>{t("Auth.Login.form.login-submit")}</SubmitButton>
          </motion.div>
        )}
      </form>
    </FormProvider>
  );
};

const LoginFormPasswordSection = () => {
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
          ? "Invalid credentials"
          : "Something went wrong";
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
            size={"xs"}
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

const LoginFormRegisterSection = () => {
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
      const message =
        error instanceof ApiError
          ? "Something went wrong"
          : "Something went wrong";
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
            size={"xs"}
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
