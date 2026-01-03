"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  LoginTransitionSteps,
  useLoginLayoutStore,
} from "../store/LoginLayoutStore";
import { slideVariants } from "./loginFormAnimations";
import { LoginFormEmailSection } from "./LoginFormEmailSection";
import { LoginFormPasswordSection } from "./LoginFormPasswordSection";
import { LoginFormRegisterSection } from "./LoginFormRegisterSection";

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
