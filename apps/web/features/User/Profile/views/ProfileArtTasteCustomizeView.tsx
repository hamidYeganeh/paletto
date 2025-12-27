'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/Button";
import { ControlledCheckbox, SubmitButton } from "@repo/ui/Form";
import { AnimatePresence, motion, stagger } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { MouseEvent } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const slideVariants = {
    enter: (direction: number) => {
        const dir = direction === 0 ? 1 : direction;
        return { x: dir > 0 ? 80 : -80, opacity: 0 };
    },
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => {
        const dir = direction === 0 ? 1 : direction;
        return { x: dir > 0 ? -80 : 80, opacity: 0 };
    },
};

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

type ArtTasteItem = {
    label: string;
    value: string;
};

type ArtTasteQuestion = {
    index: number;
    type: string;
    question: string;
    items: ArtTasteItem[];
    multiple?: boolean;
};

type SlideFormValues = {
    choices: Record<string, boolean>;
};

export const ProfileArtTasteCustomizeView = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string[]>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    if (!artTasteQuestions.length) {
        return null;
    }

    const activeQuestion = artTasteQuestions[activeIndex];
    const canGoPrev = activeIndex > 0;
    const canGoNext = activeIndex < artTasteQuestions.length - 1;

    const goToIndex = (nextIndex: number) => {
        if (nextIndex === activeIndex) {
            return;
        }
        setDirection(nextIndex > activeIndex ? 1 : -1);
        setActiveIndex(nextIndex);
    };

    const submitArtTasteAnswers = async (payload: Record<string, string[]>) => {
        const response = await fetch("/api/profile/art-taste", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error("Failed to save art taste selections.");
        }
    };

    return (
        <div className="relative h-dvh flex items-center justify-center flex-col px-4">
            <div className="h-auth-header-height-mobile w-full"></div>
            <div className="w-full flex-col flex h-full gap-8 max-w-sm mx-auto">
                <AnimatePresence custom={direction} mode="wait">
                    <motion.div
                        key={activeQuestion?.index}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="flex flex-col gap-8 h-full"
                    >
                        <ArtTasteSlide
                            key={activeQuestion?.type}
                            question={activeQuestion as ArtTasteQuestion}
                            totalSteps={artTasteQuestions.length}
                            defaultValues={answers[activeQuestion?.type as string] ?? []}
                            canGoPrev={canGoPrev}
                            canGoNext={canGoNext}
                            isSubmitting={isSubmitting}
                            submitError={submitError}
                            onBack={() => goToIndex(activeIndex - 1)}
                            onSubmit={async (values) => {
                                setSubmitError(null);
                                const nextAnswers = { ...answers, [activeQuestion?.type as string]: values };
                                setAnswers(nextAnswers);
                                if (canGoNext) {
                                    goToIndex(activeIndex + 1);
                                    return;
                                }

                                try {
                                    setIsSubmitting(true);
                                    await submitArtTasteAnswers(nextAnswers);
                                } catch (error) {
                                    setSubmitError(
                                        error instanceof Error
                                            ? error.message
                                            : "Failed to save art taste selections."
                                    );
                                } finally {
                                    setIsSubmitting(false);
                                }
                            }}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
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

const ArtTasteSlide = ({
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
    const schema = useMemo(() => {
        return z
            .object({
                choices: z.record(z.boolean()),
            })
            .superRefine((data, ctx) => {
                const selectedCount = Object.values(data.choices).filter(Boolean).length;
                if (selectedCount < 1) {
                    ctx.addIssue({
                        code: "custom",
                        message: "Select at least one option",
                        path: ["choices"],
                    });
                }
                if (!question.multiple && selectedCount > 1) {
                    ctx.addIssue({
                        code: "custom",
                        message: "Select one option",
                        path: ["choices"],
                    });
                }
            });
    }, [question.multiple]);

    const defaultChoices = useMemo(() => {
        const selected = new Set(defaultValues);
        return question.items.reduce<Record<string, boolean>>((acc, item) => {
            acc[item.value] = selected.has(item.value);
            return acc;
        }, {});
    }, [defaultValues, question.items]);

    const form = useForm<SlideFormValues>({
        resolver: zodResolver(schema),
        defaultValues: { choices: defaultChoices },
        mode: "onChange",
        reValidateMode: "onChange",
    });

    useEffect(() => {
        void form.trigger();
    }, [form]);

    const progressPercentage = `${Math.round((question.index / totalSteps) * 100)}%`;

    const handleSingleSelect = (value: string, event: MouseEvent<HTMLButtonElement>) => {
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

    const handleSubmit = (data: SlideFormValues) => {
        const selectedValues = Object.entries(data.choices)
            .filter(([, selected]) => selected)
            .map(([value]) => value);
        return onSubmit(selectedValues);
    };

    return (
        <FormProvider {...form}>
            <form
                className="flex flex-col gap-8 h-full"
                onSubmit={form.handleSubmit(handleSubmit)}
                noValidate
            >
                <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                        className="h-full bg-white"
                        style={{ width: progressPercentage }}
                        initial={false}
                        animate={{ width: progressPercentage }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                </div>
                <motion.h2 className="text-white text-lg font-semibold" {...fadeInUp}>
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
                                onClick={(event) => {
                                    if (!question.multiple) {
                                        handleSingleSelect(item.value, event);
                                    }
                                }}
                            />
                        </div>
                    ))}
                    {/* {form?.formState?.errors?.choices?.message ? (
                        <p className="text-xs text-red-400">
                            {form?.formState?.errors?.choices?.message ?? ''}
                        </p>
                    ) : null} */}
                    {submitError ? (
                        <p className="text-xs text-red-400">{submitError}</p>
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
                            قبلی
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
                        loadingText={canGoNext ? "O\"O1O_UO" : "Finish"}
                    >
                        {canGoNext ? "بعدی" : "اتمام"}
                    </SubmitButton>
                </div>
            </form>
        </FormProvider>
    );
};

const artTasteQuestions: ArtTasteQuestion[] = [
    {
        index: 1,
        multiple: false,
        type: 'hasBoughtBefore',
        question: 'آیا قبلاً آثار هنری خریداری کرده‌اید؟',
        items: [
            {
                label: 'بله، من عاشق جمع‌آوری آثار هنری هستم.',
                value: 'true',
            },
            {
                label: 'نه، من تازه شروع کردم',
                value: 'false',
            },
        ]
    },
    {
        index: 2,
        multiple: true,
        type: 'categories',
        question: 'چه چیزی را در هنر بیشتر دوست دارید؟',
        items: [
            {
                label: 'پرورش ذوق هنری ام',
                value: 'cat-1',
            },
            {
                label: 'پیگیری هنری که به آن علاقه دارم',
                value: 'cat-2',
            },
            {
                label: 'پیدا کردن سرمایه‌گذاری عالی بعدی‌ام',
                value: 'cat-3',
            },
            {
                label: 'جمع‌آوری آثار هنری که مرا تحت تأثیر قرار می‌دهند',
                value: 'cat-4',
            },
            {
                label: 'دنبال آثار هنری متناسب با بودجه‌ام هستم',
                value: 'cat-5',
            },
        ]
    },
    {
        index: 3,
        multiple: true,
        type: 'styles',
        question: 'چیزی نمونده… حالا چند اثر انتخاب کن تا گالری تو را دقیق‌تر بسازیم.',
        items: [
            {
                label: 'کشف سلیقهٔ هنری تو',
                value: 'style-1',
            },
            {
                label: 'آثار برترِ حراج‌ها',
                value: 'style-2',
            },
            {
                label: 'هنرمندان رو‌به‌رشد',
                value: 'style-3',
            },
            {
                label: 'منتخب بهترین کارها',
                value: 'style-4',
            },
        ]
    },
];
