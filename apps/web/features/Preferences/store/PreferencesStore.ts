import { create } from "zustand";

export type PreferencesAnswers = Record<string, string[]>;

type Direction = 1 | -1;

interface PreferencesState {
  stepIndex: number;
  direction: Direction;
  isIntroView: boolean;
  answers: PreferencesAnswers;
  goToStep: (nextIndex: number) => void;
  setIntroView: (value: boolean) => void;
  setAnswer: (stepId: string, values: string[]) => void;
  reset: () => void;
}

const initialState = {
  stepIndex: 0,
  direction: 1 as Direction,
  isIntroView: true,
  answers: {} as PreferencesAnswers,
};

export const usePreferencesStore = create<PreferencesState>((set) => ({
  ...initialState,

  goToStep: (nextIndex) =>
    set((state) => ({
      stepIndex: nextIndex,
      direction: nextIndex >= state.stepIndex ? 1 : -1,
    })),

  setIntroView: (value) => set({ isIntroView: value }),

  setAnswer: (stepId, values) =>
    set((state) => ({
      answers: { ...state.answers, [stepId]: values },
    })),

  reset: () => set(initialState),
}));
