import { create } from "zustand";

export enum LoginTransitionSteps {
  EMAIL = "email",
  PASSWORD = "password",
}

type Direction = 1 | -1;
const stepsOrder: LoginTransitionSteps[] = [
  LoginTransitionSteps.EMAIL,
  LoginTransitionSteps.PASSWORD,
];

interface LoginTransitionState {
  step: LoginTransitionSteps;
  direction: Direction;
  isLayoutTransformed: boolean;

  goToStep: (step: LoginTransitionSteps) => void;
  setLayoutTransformed: (value: boolean) => void;
  reset: () => void;
}

const initialState = {
  step: LoginTransitionSteps.EMAIL,
  direction: 1 as Direction,
  isLayoutTransformed: false,
};

export const useLoginLayoutStore = create<LoginTransitionState>((set) => ({
  ...initialState,

  goToStep: (nextStep) =>
    set((state) => {
      const currentIndex = stepsOrder.indexOf(state.step);
      const nextIndex = stepsOrder.indexOf(nextStep);
      const direction: Direction = nextIndex >= currentIndex ? 1 : -1;

      return { step: nextStep, direction };
    }),

  setLayoutTransformed: (value) => set({ isLayoutTransformed: value }),

  reset: () => set(initialState),
}));
