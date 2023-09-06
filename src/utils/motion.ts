const easing = [0.06, 0.05, 0.01, 0.99];

export const fade = () => ({
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easing,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: easing,
    },
  },
});
