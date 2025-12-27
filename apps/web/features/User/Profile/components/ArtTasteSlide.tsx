"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/Button";
import { ControlledCheckbox, SubmitButton } from "@repo/ui/Form";
import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import type { MouseEvent } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  buildArtTasteSchema,
  type ArtTasteFormValues,
} from "../validation/artTasteSchemas";
import type { ArtTasteQuestion } from "../data/artTasteQuestions";

const springyFade = {
  stiffness: 240,
  damping: 26,
};

const fadeInUp = {
  transition: { ...springyFade, delay: 0.1 },
  initial: { y: -16, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 16, opacity: 0 },
};

type ArtTasteSlideProps = {
  question: ArtTasteQuestion;
  totalSteps: number;
  defaultValues: string[];
  canGoPrev: boolean;
  canGoNext: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  onBack: () => void;
  onSubmit: (values: string[]) => void | Promise<void>;
};

const resolveMessage = (translate: (key: any) => string, message?: string) => {
  if (!message) return undefined;
  try {
    return translate(message as any);
  } catch {
    return message;
  }
};

export const ArtTasteSlide = ({
  question,
  totalSteps,
  defaultValues,
  canGoPrev,
  canGoNext,
  isSubmitting,
  submitError,
  onBack,
  onSubmit,
}: ArtTasteSlideProps) => {
  const t = useTranslations();

  const schema = useMemo(
    () => buildArtTasteSchema(Boolean(question.multiple)),
    [question.multiple]
  );

  const defaultChoices = useMemo(() => {
    const selected = new Set(defaultValues);
    return question.items.reduce<Record<string, boolean>>((acc, item) => {
      acc[item.value] = selected.has(item.value);
      return acc;
    }, {});
  }, [defaultValues, question.items]);

  const form = useForm<ArtTasteFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { choices: defaultChoices },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    void form.trigger();
  }, [form]);

  const handleSingleSelect = (
    value: string,
    event: MouseEvent<HTMLButtonElement>
  ) => {
    const isChecked = form.getValues(`choices.${value}` as const);
    if (isChecked) {
      event.preventDefault();
      return;
    }

    question.items.forEach((item) => {
      form.setValue(`choices.${item.value}` as const, item.value === value, {
        shouldDirty: true,
        shouldValidate: false,
      });
    });

    void form.trigger("choices");
  };

  const handleSubmit = (data: ArtTasteFormValues) => {
    const selectedValues = Object.entries(data.choices)
      .filter(([, selected]) => selected)
      .map(([value]) => value);
    return onSubmit(selectedValues);
  };

  const choicesError = resolveMessage(
    t,
    form.formState.errors.choices?.message as string | undefined
  );
  const submitErrorMessage = resolveMessage(t, submitError ?? undefined);

  return (
    <FormProvider {...form}>
      <form
        className="flex flex-col gap-8 h-full"
        onSubmit={form.handleSubmit(handleSubmit)}
        noValidate
      >
        <motion.h2
          className="text-white text-lg font-semibold select-none"
          {...fadeInUp}
        >
          {question.question}
        </motion.h2>

        <div className="flex flex-col gap-4">
          {question.items.map((item) => (
            <div key={`${question.index}-${item.label}`}>
              <ControlledCheckbox
                control={form.control}
                name={`choices.${item.value}` as const}
                label={item.label}
                color="black"
                bgTransparent
                onClick={(event: MouseEvent<HTMLButtonElement>) => {
                  if (!question.multiple) {
                    handleSingleSelect(item.value, event);
                  }
                }}
              />
            </div>
          ))}
          {choicesError ? (
            <p className="text-xs text-red-400">{choicesError}</p>
          ) : null}
          {submitErrorMessage ? (
            <p className="text-xs text-red-400">{submitErrorMessage}</p>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-4 mt-auto mb-4">
          {canGoPrev ? (
            <Button
              size="xs"
              color="default"
              variant="contained"
              onClick={onBack}
              type="button"
              disabled={isSubmitting}
            >
              {t("Common.general.previous")}
            </Button>
          ) : (
            <span />
          )}
          <div className="text-xs text-white/60">
            {question.index} / {totalSteps}
          </div>
          <SubmitButton
            size="xs"
            color="default"
            variant="contained"
            disabled={!form.formState.isValid || isSubmitting}
            isLoading={isSubmitting}
            loadingText={`${t(canGoNext ? "Common.general.continue" : "Common.general.finish")}...`}
          >
            {t(canGoNext ? "Common.general.continue" : "Common.general.finish")}
          </SubmitButton>
        </div>
      </form>
    </FormProvider>
  );
};
