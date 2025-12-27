import { create } from "zustand";

export type ArtTasteAnswers = Record<string, string[]>;

type Direction = 1 | -1;

interface ArtTasteState {
    stepIndex: number;
    direction: Direction;
    answers: ArtTasteAnswers;
    goToStep: (nextIndex: number) => void;
    setAnswer: (key: string, values: string[]) => void;
    setAnswers: (answers: ArtTasteAnswers) => void;
    reset: () => void;
}

const initialState = {
    stepIndex: 0,
    direction: 1 as Direction,
    answers: {},
};

export const useArtTasteStore = create<ArtTasteState>((set) => ({
    ...initialState,

    goToStep: (nextIndex) =>
        set((state) => ({
            stepIndex: nextIndex,
            direction: nextIndex >= state.stepIndex ? 1 : -1,
        })),

    setAnswer: (key, values) =>
        set((state) => ({
            answers: { ...state.answers, [key]: values },
        })),

    setAnswers: (answers) => set({ answers }),

    reset: () => set(initialState),
}));
