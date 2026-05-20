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

const TEXT_SELECTOR = [
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "li",
  "blockquote",
  ".section-intro",
  ".hero-sub",
  ".journey-description",
  ".company-card-description",
  ".contact-v2-desc",
].join(", ");

const CURSOR_LOGOS = [
  "/logos/ponteiro-mouse/ABE.svg",
  "/logos/ponteiro-mouse/Avantpay.svg",
  "/logos/ponteiro-mouse/Grejoadv.svg",
  "/logos/ponteiro-mouse/Acordoseguro.svg",
] as const;

const IDLE_DELAY_MS = 850;
const LOGO_ROTATE_MS = 1100;

function isUnderCursorInteractive(clientX: number, clientY: number): boolean {
  const el = document.elementFromPoint(clientX, clientY);
  if (!el) return false;
  return !!(el as Element).closest(HOVER_SELECTOR);
}

function isUnderCursorText(clientX: number, clientY: number): boolean {
  const el = document.elementFromPoint(clientX, clientY);
  if (!el) return false;
  const node = el as Element;

  if (node.closest(HOVER_SELECTOR)) return false;
  if (node.closest('input, textarea, [contenteditable="true"]')) return false;

  return !!node.closest(TEXT_SELECTOR);
}

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [useCustom, setUseCustom] = useState(false);
  const [idle, setIdle] = useState(false);
  const [logoIndex, setLogoIndex] = useState(0);
  const idleTimerRef = useRef<number | null>(null);
  const rotateTimerRef = useRef<number | null>(null);

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

    const clearIdleTimer = () => {
      if (idleTimerRef.current !== null) {
        window.clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
    };

    const clearRotateTimer = () => {
      if (rotateTimerRef.current !== null) {
        window.clearInterval(rotateTimerRef.current);
        rotateTimerRef.current = null;
      }
    };

    const stopIdle = () => {
      setIdle(false);
      document.body.classList.remove("custom-cursor--idle");
      clearRotateTimer();
    };

    const startIdle = () => {
      setIdle(true);
      document.body.classList.add("custom-cursor--idle");
      if (rotateTimerRef.current === null) {
        rotateTimerRef.current = window.setInterval(() => {
          setLogoIndex((prev) => (prev + 1) % CURSOR_LOGOS.length);
        }, LOGO_ROTATE_MS);
      }
    };

    const scheduleIdle = () => {
      clearIdleTimer();
      idleTimerRef.current = window.setTimeout(() => {
        startIdle();
      }, IDLE_DELAY_MS);
    };

    const move = (e: MouseEvent) => {
      ring.style.left = `${e.clientX}px`;
      ring.style.top = `${e.clientY}px`;

      document.body.classList.add("custom-cursor--visible");
      stopIdle();
      scheduleIdle();

      const hover = isUnderCursorInteractive(e.clientX, e.clientY);
      const text = isUnderCursorText(e.clientX, e.clientY);
      document.body.classList.toggle("custom-cursor--hover", hover);
      document.body.classList.toggle("custom-cursor--text", text && !hover);
    };

    const leaveWindow = () => {
      document.body.classList.remove("custom-cursor--visible", "custom-cursor--hover", "custom-cursor--text");
      stopIdle();
      clearIdleTimer();
    };

    const down = () => {
      document.body.classList.add("custom-cursor--press");
      stopIdle();
      clearIdleTimer();
    };
    const up = () => {
      document.body.classList.remove("custom-cursor--press");
      scheduleIdle();
    };

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
      clearIdleTimer();
      clearRotateTimer();
      document.body.classList.remove(
        "custom-cursor--enabled",
        "custom-cursor--visible",
        "custom-cursor--hover",
        "custom-cursor--press",
        "custom-cursor--idle",
        "custom-cursor--text",
      );
    };
  }, [useCustom]);

  if (!useCustom) {
    return null;
  }

  return (
    <div id="custom-cursor" aria-hidden>
      <div id="custom-cursor-ring" ref={ringRef}>
        <div className={`custom-cursor-logo${idle ? " is-active" : ""}`}>
          <img
            key={`cursor-logo-${logoIndex}`}
            src={CURSOR_LOGOS[logoIndex]}
            alt=""
            width={20}
            height={20}
            className={`custom-cursor-logo-image${logoIndex === 0 ? " is-abe" : ""}`}
          />
        </div>
      </div>
    </div>
  );
}
