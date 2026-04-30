"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- pacote sem tipos
// @ts-expect-error
import brazilMap from "@svg-country-maps/brazil";

type Loc = { id: string; name: string; path: string };

type MapData = { viewBox: string; locations: Loc[] };

const NORDESTE = new Set(["MA", "PI", "CE", "RN", "PB", "PE", "AL", "SE", "BA"]);

/** Percentuais abaixo de 70% passam exclusivamente para 71, 72 ou 75%. */
const ELEVATE_UNDER_70 = [71, 72, 75] as const;

function hashStr(s: string): number {
  let n = 0;
  for (let i = 0; i < s.length; i++) n = (n * 33 + s.charCodeAt(i)) | 0;
  return Math.abs(n);
}

function elevateIfNeeded(pct: number, uf: string): number {
  if (pct >= 70) return pct;
  const i = hashStr(`${uf}|elev-under-70`) % ELEVATE_UNDER_70.length;
  return ELEVATE_UNDER_70[i];
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

/** Variação estável por UF. */
function spread(uf: string, min: number, max: number): number {
  if (max <= min) return min;
  return min + (hashStr(uf) % (max - min + 1));
}

type SudesteSul = { spPeak: number; rsVal: number; scVal: number; rjVal: number };

function buildSulSudeste(): SudesteSul {
  const spPeak = 90 + Math.floor(Math.random() * 2);
  const rsVal = clamp(spPeak - 4 - Math.floor(Math.random() * 3), 80, 88);
  const scVal = clamp(Math.min(spPeak - 5 - Math.floor(Math.random() * 3), rsVal - 1), 78, 87);
  const rjVal = clamp(spPeak - 2 - Math.floor(Math.random() * 3), 82, 90);
  return { spPeak, rsVal, scVal, rjVal };
}

/**
 * Indicador ilustrativo alinhado a dinâmica comercial: SP no topo; MG/PR/vizinhos fortes;
 * AC e estados muito periféricos com faixa baixa; Nordeste com capitals e interior diferenciados.
 */
function percentForUf(ufRaw: string, s: SudesteSul): number {
  const u = ufRaw.toUpperCase();
  const sp = s.spPeak;

  if (u === "SP") return sp;
  if (u === "RJ") return s.rjVal;
  if (u === "RS") return s.rsVal;
  if (u === "SC") return s.scVal;
  if (u === "MG") return clamp(sp - 1 - spread(ufRaw, 0, 2), 84, 92);
  if (u === "PR") return clamp(sp - 3 - spread(ufRaw, 0, 2), 80, 89);
  if (u === "ES") return spread(ufRaw, 70, 79);
  if (u === "DF") return spread(ufRaw, 74, 83);
  if (u === "GO") return spread(ufRaw, 70, 80);
  if (u === "MS" || u === "MT") return spread(ufRaw, 64, 76);
  if (u === "BA" || u === "PE" || u === "CE") return spread(ufRaw, 55, 68);
  if (NORDESTE.has(u)) return spread(ufRaw, 50, 64);
  if (u === "AC") return spread(ufRaw, 28, 36);
  if (u === "RR" || u === "AP") return spread(ufRaw, 32, 44);
  if (u === "RO" || u === "TO") return spread(ufRaw, 45, 56);
  if (u === "AM") return spread(ufRaw, 52, 63);
  if (u === "PA") return spread(ufRaw, 50, 62);
  return spread(ufRaw, 48, 60);
}

export function BrazilMapInteractive() {
  const data = brazilMap as MapData;
  const [mounted, setMounted] = useState(false);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [tip, setTip] = useState<{ x: number; y: number; id: string } | null>(null);

  const recoveryMap = useMemo(() => {
    const s = buildSulSudeste();
    const m: Record<string, number> = {};
    for (const loc of data.locations) {
      m[loc.id.toUpperCase()] = elevateIfNeeded(percentForUf(loc.id, s), loc.id);
    }
    return m;
  }, [data.locations]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const moveTip = useCallback((e: React.MouseEvent, id: string) => {
    setTip({ x: e.clientX, y: e.clientY, id });
  }, []);

  const tipUf = tip ? tip.id.toUpperCase() : null;
  const tipName = tip ? data.locations.find((l) => l.id === tip.id)?.name : null;
  const tipPct = tipUf ? (recoveryMap[tipUf] ?? 0) : 0;

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
            const aria = `${loc.name}, taxa ilustrativa ${recoveryMap[uf]} por cento.`;
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
              <span className="brazilMapTooltip__hint">Indicador ilustrativo (dinâmica regional)</span>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
