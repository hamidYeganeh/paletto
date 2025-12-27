'use client';

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ArtTasteQuestion, artTasteQuestions } from "../data/artTasteQuestions";
import { useArtTasteStore } from "../store/ArtTasteStore";
import { ArtTasteSlide } from "./ArtTasteSlide";

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

const submitArtTasteAnswers = async (payload: Record<string, string[]>) => {
    const response = await fetch("/api/profile/art-taste", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("Profile.ArtTaste.validation.submit-error");
    }
};

export const ArtTasteSlider = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const stepIndex = useArtTasteStore((state) => state.stepIndex);
    const direction = useArtTasteStore((state) => state.direction);
    const answers = useArtTasteStore((state) => state.answers);
    const goToStep = useArtTasteStore((state) => state.goToStep);
    const setAnswer = useArtTasteStore((state) => state.setAnswer);

    if (!artTasteQuestions.length) {
        return null;
    }

    const safeIndex = Math.max(0, Math.min(stepIndex, artTasteQuestions.length - 1));
    const activeQuestion = artTasteQuestions[safeIndex];
    const canGoPrev = safeIndex > 0;
    const canGoNext = safeIndex < artTasteQuestions.length - 1;

    const handleGoToIndex = (nextIndex: number) => {
        if (nextIndex === safeIndex) {
            return;
        }
        goToStep(nextIndex);
    };

    const handleSubmit = async (values: string[]) => {
        setSubmitError(null);
        const nextAnswers = { ...answers, [activeQuestion?.type as string]: values };
        setAnswer(activeQuestion?.type as string, values);

        if (canGoNext) {
            handleGoToIndex(safeIndex + 1);
            return;
        }

        try {
            setIsSubmitting(true);
            await submitArtTasteAnswers(nextAnswers);
        } catch (error) {
            setSubmitError(
                error instanceof Error
                    ? error.message
                    : "Profile.ArtTaste.validation.submit-error"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
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
                    onBack={() => handleGoToIndex(safeIndex - 1)}
                    onSubmit={handleSubmit}
                />
            </motion.div>
        </AnimatePresence>
    );
};
