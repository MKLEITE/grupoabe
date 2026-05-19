"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cursor decorativo em todo o site: segue o rato sem RAF/lerp (evita “drift”),
 * usa elementFromPoint para hover em qualquer elemento (incl. conteúdo dinâmico),
 * desliga em touch e em prefers-reduced-motion.
 */

const HOVER_SELECTOR = [
  "a[href]",
  "button",
  '[role="button"]',
  "input",
  "textarea",
  "select",
  "summary",
  "label[for]",
  '[tabindex]:not([tabindex="-1"])',
  ".chip",
  ".jornada-card",
  ".commitment",
  ".empresa-card",
  ".contato-item",
  ".modal-close",
  ".modalClose",
  ".buttonPrimary",
  ".buttonSecondary",
  ".menuButton",
].join(", ");

function isUnderCursorInteractive(clientX: number, clientY: number): boolean {
  const el = document.elementFromPoint(clientX, clientY);
  if (!el) return false;
  return !!(el as Element).closest(HOVER_SELECTOR);
}

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [useCustom, setUseCustom] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => {
      const ok = fine.matches && !reduce.matches;
      setUseCustom(ok);
      if (!ok) {
        document.body.classList.remove(
          "custom-cursor--enabled",
          "custom-cursor--visible",
          "custom-cursor--hover",
          "custom-cursor--press",
        );
      }
    };

    sync();
    fine.addEventListener("change", sync);
    reduce.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      reduce.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!useCustom) return;

    const ring = ringRef.current;
    if (!ring) return;

    document.body.classList.add("custom-cursor--enabled");

    const move = (e: MouseEvent) => {
      ring.style.left = `${e.clientX}px`;
      ring.style.top = `${e.clientY}px`;

      document.body.classList.add("custom-cursor--visible");

      const hover = isUnderCursorInteractive(e.clientX, e.clientY);
      document.body.classList.toggle("custom-cursor--hover", hover);
    };

    const leaveWindow = () => {
      document.body.classList.remove("custom-cursor--visible", "custom-cursor--hover");
    };

    const down = () => document.body.classList.add("custom-cursor--press");
    const up = () => document.body.classList.remove("custom-cursor--press");

    document.addEventListener("mousemove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", leaveWindow);
    document.addEventListener("mousedown", down, true);
    document.addEventListener("mouseup", up, true);
    window.addEventListener("blur", leaveWindow);

    return () => {
      document.removeEventListener("mousemove", move);
      document.documentElement.removeEventListener("mouseleave", leaveWindow);
      document.removeEventListener("mousedown", down, true);
      document.removeEventListener("mouseup", up, true);
      window.removeEventListener("blur", leaveWindow);
      document.body.classList.remove(
        "custom-cursor--enabled",
        "custom-cursor--visible",
        "custom-cursor--hover",
        "custom-cursor--press",
      );
    };
  }, [useCustom]);

  if (!useCustom) {
    return null;
  }

  return (
    <div id="custom-cursor" aria-hidden>
      <div id="custom-cursor-ring" ref={ringRef} />
    </div>
  );
}
