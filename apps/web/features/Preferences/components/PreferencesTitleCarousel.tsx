"use client";

import { AnimatePresence, motion, stagger, useAnimate } from "framer-motion";
import { useEffect, useMemo } from "react";
import type { PreferencesStep } from "../constants/preferencesSteps";
import { usePreferencesStore } from "../store/PreferencesStore";

type PreferencesTitleCarouselProps = {
  steps: PreferencesStep[];
};

const slideVariants = {
  enter: () => ({
    opacity: 0,
  }),
  center: { y: 0, opacity: 1 },
  exit: () => ({
    opacity: 0,
  }),
};

const AnimatedTitle = ({
  text,
  className,
  filter = true,
  duration = 0.5,
}: {
  text: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}) => {
  const [scope, animate] = useAnimate();
  const words = useMemo(() => text.split(" "), [text]);

  useEffect(() => {
    animate(
      "span",
      { opacity: 1, filter: filter ? "blur(0px)" : "none" },
      { duration, delay: stagger(0.12) }
    );
  }, [animate, duration, filter, text]);

  return (
    <motion.div ref={scope} className={className}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="inline-block text-white opacity-0"
          style={{ filter: filter ? "blur(10px)" : "none" }}
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </motion.div>
  );
};

export const PreferencesTitleCarousel = ({
  steps,
}: PreferencesTitleCarouselProps) => {
  const stepIndex = usePreferencesStore((state) => state.stepIndex);
  const direction = usePreferencesStore((state) => state.direction);
  const safeIndex = Math.max(0, Math.min(stepIndex, steps.length - 1));
  const activeStep = steps[safeIndex];

  if (!activeStep) {
    return null;
  }

  return (
    <motion.div className="relative overflow-hidden_" layout>
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={activeStep.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
          layout
        >
          <AnimatedTitle
            text={activeStep.title}
            className="text-lg font-semibold leading-snug"
          />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
