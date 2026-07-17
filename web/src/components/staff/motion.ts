/** Shared easing tokens for staff portal micro-motion (transform/opacity only). */
export const staffEase = "cubic-bezier(0.32, 0.72, 0, 1)";

export const staffTransition = {
  fast: `opacity 180ms ${staffEase}, transform 180ms ${staffEase}`,
  medium: `opacity 280ms ${staffEase}, transform 280ms ${staffEase}`,
  drawer: `transform 320ms ${staffEase}, opacity 280ms ${staffEase}`,
  sidebar: `width 320ms ${staffEase}, opacity 280ms ${staffEase}`,
} as const;

export const staffMotionClass = {
  fadeIn: "animate-[staff-fade-in_280ms_cubic-bezier(0.32,0.72,0,1)_both]",
  press: "active:scale-[0.98] transition-transform duration-150",
} as const;
