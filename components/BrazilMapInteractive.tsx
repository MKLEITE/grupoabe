"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- pacote sem tipos
// @ts-expect-error
import brazilMap from "@svg-country-maps/brazil";

type Loc = { id: string; name: string; path: string };

type MapData = { viewBox: string; locations: Loc[] };

function recoveryPercentForUf(uf: string): number {
  let n = 0;
  for (let i = 0; i < uf.length; i++) n += uf.charCodeAt(i);
  return 14 + (n % 22);
}

export function BrazilMapInteractive() {
  const data = brazilMap as MapData;
  const [mounted, setMounted] = useState(false);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [tip, setTip] = useState<{ x: number; y: number; id: string } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const recoveryMap = useMemo(() => {
    const m: Record<string, number> = {};
    for (const loc of data.locations) {
      m[loc.id.toUpperCase()] = recoveryPercentForUf(loc.id);
    }
    return m;
  }, [data.locations]);

  const moveTip = useCallback((e: React.MouseEvent, id: string) => {
    setTip({ x: e.clientX, y: e.clientY, id });
  }, []);

  const tipUf = tip ? tip.id.toUpperCase() : null;
  const tipName = tip ? data.locations.find((l) => l.id === tip.id)?.name : null;
  const tipPct = tipUf ? recoveryMap[tipUf] ?? 0 : 0;

  return (
    <div className="brazilMapWrap">
      <div className="brazilMapStage">
        <svg
          className="brazilMapSvg"
          viewBox={data.viewBox}
          role="img"
          aria-label="Mapa do Brasil — passe o cursor sobre cada estado"
          preserveAspectRatio="xMidYMid meet"
        >
          {data.locations.map((loc) => {
            const uf = loc.id.toUpperCase();
            const hi = hoverId === loc.id ? "brazilMap__path--hover" : "";
            const aria = `${loc.name}, recuperação ilustrativa ${recoveryMap[uf]} por cento.`;
            return (
              <path
                key={loc.id}
                id={`uf-${loc.id}`}
                d={loc.path}
                className={`brazilMap__path ${hi}`}
                aria-label={aria}
                onMouseEnter={(e) => {
                  setHoverId(loc.id);
                  moveTip(e, loc.id);
                }}
                onMouseMove={(e) => moveTip(e, loc.id)}
                onMouseLeave={() => {
                  setHoverId(null);
                  setTip(null);
                }}
              />
            );
          })}
        </svg>
      </div>

      {mounted && tip && tipName
        ? createPortal(
            <div
              className="brazilMapTooltip"
              style={{
                left: tip.x,
                top: tip.y,
              }}
              role="tooltip"
            >
              <span className="brazilMapTooltip__uf">{tipUf}</span>
              <span className="brazilMapTooltip__name">{tipName}</span>
              <span className="brazilMapTooltip__kpi">Recuperação {tipPct}%</span>
              <span className="brazilMapTooltip__hint">Indicador ilustrativo</span>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
