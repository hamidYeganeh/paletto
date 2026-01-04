"use client";

import { Button } from '@repo/ui/Button';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const TITLE_HEIGHT = 40;
const STEPS = [
  {
    title: 'Discover',
    items: [
      'Follow the trail of your favorite artists.',
      'Collect visual references that match your mood.',
      'Save three pieces that feel unmistakably yours.',
    ],
  },
  {
    title: 'Curate',
    items: [
      'Group pieces by palette and texture.',
      'Name the feeling you want each group to evoke.',
      'Trim the collection to a focused set.',
    ],
  },
  {
    title: 'Refine',
    items: [
      'Compare each piece against your core palette.',
      'Highlight the motifs that keep reappearing.',
      'Decide the story you want the collection to tell.',
    ],
  },
] as const;

export default function Home() {
  const [activeStep, setActiveStep] = useState(0);
  const activeStepData = STEPS[activeStep] ?? STEPS[0];
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.06 },
    },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
  };

  return (
    <main className="min-h-dvh p-4 md:p-8">
      <section className="mx-auto w-full max-w-4xl rounded-theme-md bg-primary-100 p-6 md:p-10">
        <div className="grid gap-10 md:grid-cols-[minmax(200px,260px)_1fr]">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
              Process
            </p>
            {STEPS.map((step, index) => {
              const isActive = index === activeStep;
              return (
                <button
                  key={step.title}
                  type="button"
                  onClick={() => setActiveStep(index)}
                  className={`flex items-center gap-3 rounded-theme-sm border px-4 py-3 text-left transition ${isActive ? 'border-primary-600 bg-primary-200 text-primary-900' : 'border-transparent bg-white/60 text-primary-700 hover:border-primary-400/40'}`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  <span
                    className={`text-xs font-semibold ${isActive ? 'text-primary-700' : 'text-primary-500'}`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm font-medium">{step.title}</span>
                </button>
              );
            })}
            <div className="mt-2 flex gap-2">
              <Button
                onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
                disabled={activeStep === 0}
              >
                Prev
              </Button>
              <Button
                onClick={() =>
                  setActiveStep((prev) => Math.min(prev + 1, STEPS.length - 1))
                }
                disabled={activeStep === STEPS.length - 1}
              >
                Next
              </Button>
            </div>
          </div>

          <div className="rounded-theme-md bg-white/70 p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">
              Step {String(activeStep + 1).padStart(2, '0')}
            </p>
            <div className="mt-2 h-10 overflow-hidden">
              <motion.div
                className="flex flex-col"
                animate={{ y: -activeStep * TITLE_HEIGHT }}
                transition={{ type: 'spring', stiffness: 160, damping: 20 }}
              >
                {STEPS.map((step) => (
                  <div
                    key={step.title}
                    className="flex h-10 items-center text-2xl font-semibold text-primary-900"
                  >
                    {step.title}
                  </div>
                ))}
              </motion.div>
            </div>

            <AnimatePresence mode="wait">
              <motion.ul
                key={activeStep}
                className="mt-6 space-y-3"
                variants={listVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {activeStepData.items.map((item) => (
                  <motion.li
                    key={item}
                    className="flex items-start gap-3 text-sm text-primary-700"
                    variants={itemVariants}
                  >
                    <span className="mt-1 inline-flex size-2 rounded-full bg-primary-500" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </main>
  );
}
