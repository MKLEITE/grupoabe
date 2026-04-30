"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Img = { src: string; alt: string };

export function ImageComparisonSlider({
  leftImage,
  rightImage,
  leftCaption,
  rightCaption,
  className,
}: {
  leftImage: Img;
  rightImage: Img;
  leftCaption?: string;
  rightCaption?: string;
  className?: string;
}) {
  const [pct, setPct] = useState(50);
  const draggingRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  const safePct = Math.min(96, Math.max(4, pct));
  const clipInnerWidthPct = `${100 / (safePct / 100)}%`;

  const pointerToPct = useCallback((clientX: number) => {
    const el = rootRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = rect.width <= 1 ? 0.5 : (clientX - rect.left) / rect.width;
    setPct(Math.round(Math.min(1, Math.max(0, ratio)) * 1000) / 10);
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      if (pointerIdRef.current !== null && e.pointerId !== pointerIdRef.current) return;
      pointerToPct(e.clientX);
    };

    const onEnd = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      if (pointerIdRef.current !== null && e.pointerId !== pointerIdRef.current) return;

      const captured = pointerIdRef.current;
      draggingRef.current = false;
      pointerIdRef.current = null;

      try {
        const rail = railRef.current;
        if (rail != null && captured != null) {
          rail.releasePointerCapture(captured);
        }
      } catch {
        /* ignore */
      }
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onEnd);
    window.addEventListener("pointercancel", onEnd);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onEnd);
      window.removeEventListener("pointercancel", onEnd);
    };
  }, [pointerToPct]);

  const grabPointer = (e: React.PointerEvent) => {
    e.preventDefault();
    draggingRef.current = true;
    pointerIdRef.current = e.pointerId;
    pointerToPct(e.clientX);

    try {
      railRef.current?.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className={`compareSliderOuter ${className ?? ""}`.trim()}>
      <div className="compareSliderRibbon">
        <span className="compareSliderRibbon__pill compareSliderRibbon__pill--left">{leftCaption ?? "\u00A0"}</span>
        <span className="compareSliderRibbon__pill compareSliderRibbon__pill--right">{rightCaption ?? "\u00A0"}</span>
      </div>

      <div
        ref={rootRef}
        className="compareSlider"
        role="group"
        aria-label={`Comparativo lado a lado. Esquerda: ${leftImage.alt}. Direita: ${rightImage.alt}. Arraste sobre a foto ou use as teclas ← e →.`}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            setPct((prev) => Math.max(5, prev - 4));
          } else if (event.key === "ArrowRight") {
            event.preventDefault();
            setPct((prev) => Math.min(95, prev + 4));
          }
        }}
      >
        <Image
          src={rightImage.src}
          alt=""
          priority
          fill
          aria-hidden
          className="compareSlider__img compareSlider__img--right"
          sizes="min(1180px, 96vw)"
          draggable={false}
        />

        <div className="compareSlider__clip" style={{ width: `${safePct}%` }}>
          <div className="compareSlider__clipInner" style={{ width: clipInnerWidthPct }}>
            <Image
              src={leftImage.src}
              alt=""
              priority
              fill
              aria-hidden
              className="compareSlider__img compareSlider__img--left"
              sizes="min(1180px, 96vw)"
              draggable={false}
            />
          </div>
        </div>

        <div ref={railRef} className="compareSlider__rail" onPointerDown={grabPointer}>
          <div className="compareSlider__divider" style={{ left: `${safePct}%` }} />
          <div
            role="slider"
            tabIndex={-1}
            aria-valuenow={Math.round(pct)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Arrastar para comparar as duas imagens"
            aria-orientation="horizontal"
            className="compareSlider__handle"
            style={{ left: `${safePct}%` }}
          >
            <span className="compareSlider__handleGrip" aria-hidden>
              ‹ ›
            </span>
          </div>
        </div>
      </div>

      <span className="srOnly">{leftImage.alt}</span>
      <span className="srOnly">{rightImage.alt}</span>
    </div>
  );
}
