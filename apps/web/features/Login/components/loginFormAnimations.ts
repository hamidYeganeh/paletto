type FadeMotion = {
  transition: {
    stiffness: number;
    damping: number;
    delay?: number;
  };
  initial: {
    y: number;
    opacity: number;
  };
  animate: {
    y: number;
    opacity: number;
  };
  exit: {
    y: number;
    opacity: number;
  };
};

const springyFade: FadeMotion["transition"] = {
  stiffness: 240,
  damping: 26,
};

export const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0,
  }),
};

export const fadeInUp: FadeMotion = {
  transition: { ...springyFade, delay: 0.2 },
  initial: { y: -16, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 16, opacity: 0 },
};

export const fadeInDown: FadeMotion = {
  transition: { ...springyFade, delay: 0.2 },
  initial: { y: 16, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -16, opacity: 0 },
};
