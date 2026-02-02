export const easeOutExpo = [0.16, 1, 0.3, 1]; // premium, snappy, not bouncy

export const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 14, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.55, ease: easeOutExpo, delay },
});

export const containerStagger = (delayChildren = 0.06, stagger = 0.06) => ({
  initial: {},
  animate: {
    transition: { delayChildren, staggerChildren: stagger },
  },
});

export const item = {
  initial: { opacity: 0, y: 12, filter: "blur(6px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: easeOutExpo },
  },
};
