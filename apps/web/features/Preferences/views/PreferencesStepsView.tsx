"use client";

import { PREFERENCES_STEPS } from "../data/preferencesSteps";
import { PreferencesOptionsForm } from "../components/PreferencesOptionsForm";
import { PreferencesProgress } from "../components/PreferencesProgress";
import { PreferencesTitleCarousel } from "../components/PreferencesTitleCarousel";
import { usePreferencesStore } from "../store/PreferencesStore";

export const PreferencesStepsView = () => {
    const stepIndex = usePreferencesStore((state) => state.stepIndex);
    const steps = PREFERENCES_STEPS;

    if (!steps.length) {
        return null;
    }

    const safeIndex = Math.max(0, Math.min(stepIndex, steps.length - 1));
    const activeStep = steps[safeIndex];

    if (!activeStep) {
        return null;
    }

    return (
        <section className="w-full h-full p-4 relative">
            <div className="flex flex-col gap-6 h-full">
                <PreferencesProgress steps={steps} />
                <PreferencesTitleCarousel steps={steps} />
                <PreferencesOptionsForm step={activeStep} totalSteps={steps.length} onComplete={(answers) => {
                    console.log('SUBMIT', answers);
                }} />
            </div>
        </section>
    );
};
