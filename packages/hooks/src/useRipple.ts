import { MouseEvent, useCallback } from "react";

export function useRipple() {
  const createRipple = useCallback((event: MouseEvent<HTMLElement>) => {
    const element = event.currentTarget;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const ripple = document.createElement("span");
    ripple.style.position = "absolute";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.borderRadius = "50%";
    ripple.style.transform = "translate(-50%, -50%) scale(0)";
    ripple.style.opacity = "0.25";
    ripple.style.backgroundColor =
      getComputedStyle(element).getPropertyValue("--color") || "currentColor";
    ripple.style.pointerEvents = "none";
    ripple.style.transition =
      "transform 600ms ease-out, opacity 600ms ease-out";

    element.appendChild(ripple);

    ripple.getBoundingClientRect();
    ripple.style.transform = "translate(-50%, -50%) scale(1)";
    ripple.style.opacity = "0";

    ripple.addEventListener("transitionend", () => {
      ripple.remove();
    });
  }, []);

  return {
    createRipple,
  };
}
