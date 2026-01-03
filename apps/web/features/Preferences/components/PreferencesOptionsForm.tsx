"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Button } from "@repo/ui/Button";
import Checkbox from "@repo/ui/Checkbox";
import { useTranslations } from "@repo/i18n/client";
import type { PreferencesStep } from "../data/preferencesSteps";
import { PreferencesAnswers, usePreferencesStore } from "../store/PreferencesStore";

type PreferencesOptionsFormProps = {
  step: PreferencesStep;
  totalSteps: number;
  onComplete?: (answers: PreferencesAnswers) => void;
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export const PreferencesOptionsForm = ({
  step,
  totalSteps,
  onComplete,
}: PreferencesOptionsFormProps) => {
  const t = useTranslations();
  const [error, setError] = useState<string | null>(null);

  const store = usePreferencesStore(state => state)
  const stepIndex = usePreferencesStore((state) => state.stepIndex);
  const direction = usePreferencesStore((state) => state.direction);
  const answers = usePreferencesStore((state) => state.answers);
  const setAnswer = usePreferencesStore((state) => state.setAnswer);
  const goToStep = usePreferencesStore((state) => state.goToStep);

  const selectedValues = answers[step.id] ?? [];
  const selectedSet = useMemo(
    () => new Set(selectedValues),
    [selectedValues]
  );

  const canGoPrev = stepIndex > 0;
  const canGoNext = stepIndex < totalSteps - 1;
  const isValidSelection = step.multiple
    ? selectedValues.length > 0
    : selectedValues.length === 1;

  useEffect(() => {
    setError(null);
  }, [step.id]);

  useEffect(() => {
    if (error && isValidSelection) {
      setError(null);
    }
  }, [error, isValidSelection]);

  const handleOptionChange = (
    optionId: string,
    checked: boolean | "indeterminate"
  ) => {
    const isChecked = checked === true;

    if (step.multiple) {
      const nextValues = isChecked
        ? [...selectedValues, optionId]
        : selectedValues.filter((value) => value !== optionId);
      setAnswer(step.id, nextValues);
      return;
    }

    setAnswer(step.id, isChecked ? [optionId] : []);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (step.options.length && !isValidSelection) {
      setError(
        step.multiple
          ? "Select at least one option to continue."
          : "Select one option to continue."
      );
      return;
    }

    if (canGoNext) {
      goToStep(stepIndex + 1);
      return;
    }
    onComplete?.(answers);
  };

  return (
    <AnimatePresence custom={direction} mode="wait">
      <motion.form
        key={step.id}
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="flex flex-col gap-8 h-full"
        onSubmit={handleSubmit}
        noValidate
      >
        <motion.ul
          variants={listVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex flex-col gap-3 list-none"
        >
          {step.options.map((option) => (
            <motion.li key={option.id} variants={itemVariants}>
              <Checkbox
                label={option.label}
                bgTransparent
                color="black"
                checked={selectedSet.has(option.id)}
                onCheckedChange={(checked) =>
                  handleOptionChange(option.id, checked)
                }
              />
            </motion.li>
          ))}
        </motion.ul>

        {error ? <p className="text-xs text-red-200">{error}</p> : null}

        <div className="flex items-center justify-between gap-4 mt-auto mb-2">
          {canGoPrev ? (
            <Button type="button" onClick={() => goToStep(stepIndex - 1)}>
              {t("Common.general.previous")}
            </Button>
          ) : (
            <span />
          )}
          <div className="text-xs text-white/70">
            {stepIndex + 1} / {totalSteps}
          </div>
          <Button type="submit">
            {t(canGoNext ? "Common.general.next" : "Common.general.finish")}
          </Button>
        </div>
      </motion.form>
    </AnimatePresence>
  );
};
