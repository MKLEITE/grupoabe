"use client";

import Image from "next/image";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { StructureIcon } from "@/components/StructureIcons";
import { BrazilMapInteractive } from "@/components/BrazilMapInteractive";
import { ChannelIcon } from "@/components/ChannelIcons";

type SegmentName = "Industrial" | "Varejo" | "Serviços" | "Saúde" | "Distribuição";

type DataPoint = { channel: string; value: number };

type NavItem = { id: string; label: string };

type Channel = { key: string; label: string; description: string; icon: string };

type StructurePillar = "Operação" | "Dados" | "Jurídico" | "Relacionamento";

const navItems: NavItem[] = [
  { id: "estrutura", label: "Estrutura" },
  { id: "ecossistema", label: "Ecossistema" },
  { id: "cobranca-presencial", label: "Cobrança Presencial" },
  { id: "online", label: "ABE Online" },
  { id: "clientes", label: "Clientes" },
  { id: "diferenciais", label: "Diferenciais" },
  { id: "contratos", label: "Contratos" },
];

const channels: Channel[] = [
  { key: "whatsapp", label: "WhatsApp", icon: "whatsapp", description: "Alto índice de resposta para lembretes, renegociação e conversão rápida." },
  { key: "sms", label: "SMS", icon: "sms", description: "Reforço tático para jornadas de cobrança com ampla capilaridade." },
  { key: "email", label: "E-mail", icon: "email", description: "Formalização, registro de proposta e comunicação documentada." },
  { key: "ligacao", label: "Ligação", icon: "ligacao", description: "Canal consultivo para objeções, negociação estruturada e alinhamento mais próximo." },
  { key: "presencial", label: "Visita Presencial", icon: "presencial", description: "Grande diferencial para carteiras complexas e negociações de maior impacto." },
];

/** Mix ilustrativo por segmento (soma 100%). Sem Chatbot nem Fases internas no comparativo. */
const recoveryData: Record<SegmentName, DataPoint[]> = {
  Industrial: [
    { channel: "WhatsApp", value: 40 },
    { channel: "SMS", value: 3 },
    { channel: "E-mail", value: 3 },
    { channel: "Ligação", value: 15 },
    { channel: "Presencial", value: 39 },
  ],
  Varejo: [
    { channel: "WhatsApp", value: 38 },
    { channel: "SMS", value: 4 },
    { channel: "E-mail", value: 5 },
    { channel: "Ligação", value: 18 },
    { channel: "Presencial", value: 35 },
  ],
  Serviços: [
    { channel: "WhatsApp", value: 32 },
    { channel: "SMS", value: 5 },
    { channel: "E-mail", value: 6 },
    { channel: "Ligação", value: 24 },
    { channel: "Presencial", value: 33 },
  ],
  Saúde: [
    { channel: "WhatsApp", value: 28 },
    { channel: "SMS", value: 4 },
    { channel: "E-mail", value: 7 },
    { channel: "Ligação", value: 22 },
    { channel: "Presencial", value: 39 },
  ],
  Distribuição: [
    { channel: "WhatsApp", value: 35 },
    { channel: "SMS", value: 4 },
    { channel: "E-mail", value: 4 },
    { channel: "Ligação", value: 20 },
    { channel: "Presencial", value: 37 },
  ],
};

type EcosystemId = "avantpay" | "acordo" | "grejo";

const ecosystemCompanies: {
  id: EcosystemId;
  logo: string;
  alt: string;
  text: string;
  channelKeys: Channel["key"][];
  /** Imagem de destaque no painel; substitua o ficheiro em `public/images/`. */
  panelImage: { src: string; alt: string };
}[] = [
  {
    id: "avantpay",
    logo: "/logos/avantpay.png",
    alt: "AvantPay",
    text: "Plataforma de cobrança preventiva e gestão de recebíveis para agir antes do vencimento e reduzir inadimplência.",
    channelKeys: ["whatsapp", "email", "sms"],
    panelImage: {
      src: "/images/ecossistema-avantpay-dashboard.png",
      alt: "Dashboard e meios AvantPay (IA)",
    },
  },
  {
    id: "acordo",
    logo: "/logos/acordo-seguro.png",
    alt: "Acordo Seguro",
    text: "Solução 100% digital para negociação online com autonomia, rapidez e experiência moderna.",
    channelKeys: ["email", "sms", "whatsapp"],
    panelImage: {
      src: "/images/ecossistema-acordo-seguro.png",
      alt: "Plataforma e experiência digital Acordo Seguro",
    },
  },
  {
    id: "grejo",
    logo: "/logos/grejo.png",
    alt: "Grejo Advogados",
    text: "Suporte jurídico empresarial especializado para reforçar segurança e robustez da operação.",
    channelKeys: ["whatsapp", "sms", "email", "ligacao", "presencial"],
    panelImage: {
      src: "/images/ecossistema-grejo.png",
      alt: "Atuação e integração Grejo Advogados",
    },
  },
];

const stories: Record<SegmentName, string> = {
  Industrial:
    "No segmento industrial, ligação e visita presencial costumam se destacar porque as negociações envolvem valores maiores, múltiplos decisores e mais profundidade consultiva. Os canais digitais seguem acelerando a jornada e reforçando contato.",
  Varejo:
    "No varejo, velocidade faz diferença. Por isso, WhatsApp lidera com frequência, enquanto SMS, e-mail e ligação sustentam reforço, formalização e reengajamento.",
  Serviços:
    "Em serviços, proximidade e personalização tendem a elevar resultado. Ligação e WhatsApp ganham força, enquanto e-mail ajuda a consolidar o acordo com mais clareza.",
  Saúde:
    "No segmento de saúde, previsibilidade e documentação elevam a importância de e-mail e ligação, compondo uma régua mais respeitosa, segura e eficiente.",
  Distribuição:
    "Em distribuição, contato direto e velocidade operacional costumam favorecer ligação e visita presencial, especialmente em carteiras mais sensíveis e com maior complexidade comercial.",
};

/** Quantidade de logos em `public/images/clientes/cliente-01.png` … `cliente-NN.png` (dois dígitos). */
const CLIENT_LOGO_COUNT: number = 24;

const differentials = [
  "Tradição e eficiência na recuperação de créditos desde 1979",
  "Liderança no segmento B2B",
  "AvantPay para cobrança preventiva e gestão de recebíveis",
  "Grejo Advogados para suporte jurídico especializado",
  "Acordo Seguro para negociação digital 100% online",
  "Aceitamos cartões de crédito",
  "Portal do cliente com acompanhamento em tempo real",
  "Dashboard com inteligência executiva e leitura estratégica",
  "Executivo de negócios com atendimento personalizado",
  "Filiais e cobertura nacional",
  "Estrutura de cobrança presencial em todo o território nacional",
];

const ABE_PLATFORM_EMBED_DEFAULT =
  "https://app.powerbi.com/view?r=eyJrIjoiMjE2OGJiNDAtMzU5Ni00YjRlLWE4ZDctMTE1MDhmMGRmMGIwIiwidCI6ImJiNmFlZmY5LTczYWItNGNmNS1iZDVlLTkyYmM2M2E3NTI2YyJ9";

const ABE_PLATFORM_IFRAME_TITLE = "14395 - NEODENTE";

/** Painel Power BI (ou outro embed). Sobrescreva com NEXT_PUBLIC_ABE_ONLINE_IFRAME_URL se precisar. */
const ABE_ONLINE_EMBED_URL = process.env.NEXT_PUBLIC_ABE_ONLINE_IFRAME_URL ?? ABE_PLATFORM_EMBED_DEFAULT;

const contractCards = [
  {
    title: "Contrato Padrão – Success Fee",
    tag: "Modelo orientado à performance",
    points: [
      "Valor do débito: R$ 10.000,00",
      "Aging: 60 dias",
      "Juros negociados: 1,5% a.m.",
      "Valor atualizado: R$ 10.302,25",
      "Honorários contratuais (10%): R$ 1.030,23",
      "Repasse ao cliente: R$ 9.272,03",
      "Déficit percebido: R$ 727,97",
    ],
  },
  {
    title: "Contrato Honorário Zero",
    tag: "Modelo com preservação do principal",
    points: [
      "Valor do débito: R$ 10.000,00",
      "Aging: 60 dias",
      "Juros negociados: 1,5% a.m.",
      "Valor atualizado: R$ 10.302,25",
      "Repasse ao cliente: R$ 10.000,00 + custas de protesto, se houver",
      "Juros ABE negociados com o devedor: R$ 302,25",
      "Preserva integralmente o valor principal ao cliente",
    ],
  },
];

const ESTRUTURA_PILARES_BG = "/images/estrutura-pilares-bg.png";

const structurePillars: { title: StructurePillar; text: string }[] = [
  {
    title: "Operação",
    text: "Equipes de negociação interna e de campo, com conhecimento aprofundado do seu segmento e da carteira, em toda a jornada de cobrança.",
  },
  {
    title: "Dados",
    text: "Indicadores executivos reforçados por IA, para leitura clara da operação, do desempenho e de onde investir a próxima decisão.",
  },
  { title: "Jurídico", text: "Suporte técnico e segurança para casos que exigem maior robustez." },
  { title: "Relacionamento", text: "Atendimento próximo, consultivo e alinhado à realidade do cliente." },
];

/** Layout alinhado ao infográfico: esquerda (azul) Operação + Jurídico; eixo; direita (dourado) Dados + Relacionamento. */
const methodologyPillars: {
  title: StructurePillar;
  gridArea: "op" | "jur" | "dados" | "rela";
  side: "blue" | "gold";
}[] = [
  { title: "Operação", gridArea: "op", side: "blue" },
  { title: "Dados", gridArea: "dados", side: "gold" },
  { title: "Jurídico", gridArea: "jur", side: "blue" },
  { title: "Relacionamento", gridArea: "rela", side: "gold" },
];

const methodologyTrust: { label: string; id: "shield" | "target" | "lock" | "value" }[] = [
  { id: "shield", label: "Especialistas em cobrança" },
  { id: "target", label: "Foco em resultados" },
  { id: "lock", label: "Segurança e compliance" },
  { id: "value", label: "Parceria que gera valor" },
];

const structurePillarSlug: Record<StructurePillar, "operacao" | "dados" | "juridico" | "relacionamento"> = {
  Operação: "operacao",
  Dados: "dados",
  Jurídico: "juridico",
  Relacionamento: "relacionamento",
};

/** Coloque ficheiros em `public/images/metodologia/` (ex.: pilar-operacao.png). */
const METODOLOGIA_PHOTO_DIR = "/images/metodologia";
const metodologiaFoto: Record<StructurePillar, { file: string; alt: string }> = {
  Operação: { file: "pilar-operacao.png", alt: "Operação e contacto" },
  Dados: { file: "pilar-dados.png", alt: "Dados e indicadores" },
  Jurídico: { file: "pilar-juridico.png", alt: "Jurídico" },
  Relacionamento: { file: "pilar-relacionamento.png", alt: "Relacionamento" },
};

function MetodologiaPilarImagem({ pillar }: { pillar: StructurePillar }) {
  const { file, alt } = metodologiaFoto[pillar];
  const slug = structurePillarSlug[pillar];
  const src = `${METODOLOGIA_PHOTO_DIR}/${file}`;
  const [failed, setFailed] = useState(false);

  return (
    <div className="methodologyPillar__media" data-pillar={slug} data-missing={failed ? "true" : undefined}>
      <div className="methodologyPillar__mediaFallback" aria-hidden />
      {!failed ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="methodologyPillar__mediaImg"
          sizes="(max-width: 900px) 100vw, 26vw"
          onError={() => setFailed(true)}
        />
      ) : null}
      {failed ? (
        <div className="methodologyPillar__emptySlot" aria-hidden>
          <span className="methodologyPillar__emptyKicker">Imagem (opcional)</span>
          <code className="methodologyPillar__emptyPath">
            {METODOLOGIA_PHOTO_DIR}/{file}
          </code>
        </div>
      ) : null}
    </div>
  );
}

const channelLabelToDataKey: Record<string, string> = {
  WhatsApp: "WhatsApp",
  SMS: "SMS",
  "E-mail": "E-mail",
  Ligação: "Ligação",
  "Visita Presencial": "Presencial",
};

function sumValues(data: DataPoint[]) {
  return data.reduce((acc, item) => acc + item.value, 0);
}

/** Converte pesos relativos em percentuais que somam 100% no segmento (mesma base do gráfico e do anel). */
function normalizeMixTo100Percent(points: DataPoint[]): DataPoint[] {
  const sum = sumValues(points);
  if (sum <= 0) {
    return points.map((p) => ({ ...p, value: 0 }));
  }
  const scaled = points.map((p) => ({
    channel: p.channel,
    value: (p.value / sum) * 100,
  }));
  const rounded = scaled.map((p) => ({
    channel: p.channel,
    value: Math.round(p.value * 10) / 10,
  }));
  let s = rounded.reduce((acc, p) => acc + p.value, 0);
  const drift = Math.round((100 - s) * 10) / 10;
  if (rounded.length > 0 && Math.abs(drift) >= 0.001) {
    const last = rounded.length - 1;
    rounded[last] = {
      ...rounded[last],
      value: Math.round((rounded[last].value + drift) * 10) / 10,
    };
  }
  return rounded;
}

function formatMixPercent(value: number): string {
  const v = Math.round(value * 10) / 10;
  if (Math.abs(v - Math.round(v)) < 0.001) return `${Math.round(v)}%`;
  return `${v.toFixed(1)}%`;
}

function KpiCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <article className="kpiCard reveal">
      <div className="kpiLabel">{label}</div>
      <div className="kpiValue">{value}</div>
      <div className="kpiSub">{sub}</div>
    </article>
  );
}

const MARQUEE_SPEED_PX = 0.34;

/** Faixa infinita: translateX + rAF (sempre em movimento; arrasto só enquanto o botão está pressionado). */
function PartnerLogoCarousel() {
  const count = CLIENT_LOGO_COUNT;
  const [reduceMotion, setReduceMotion] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const halfRef = useRef(0);
  const draggingRef = useRef(false);
  const dragRef = useRef({ startX: 0, startOffset: 0, pointerId: -1 });
  const rafRef = useRef(0);

  useEffect(() => {
    setReduceMotion(typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const measureHalf = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    halfRef.current = track.scrollWidth / 2;
  }, []);

  const wrapOffset = useCallback((x: number) => {
    const half = halfRef.current;
    if (half <= 0) return x;
    let o = x;
    while (o <= -half) o += half;
    while (o > 0) o -= half;
    return o;
  }, []);

  const applyTransform = useCallback(() => {
    const el = trackRef.current;
    if (el) el.style.transform = `translate3d(${offsetRef.current}px,0,0)`;
  }, []);

  useLayoutEffect(() => {
    if (reduceMotion || count < 2) return;
    measureHalf();
    const track = trackRef.current;
    if (!track) return;
    const ro = new ResizeObserver(measureHalf);
    ro.observe(track);
    return () => ro.disconnect();
  }, [count, reduceMotion, measureHalf]);

  useEffect(() => {
    if (reduceMotion || count < 2) return;
    const tick = () => {
      const half = halfRef.current;
      if (half > 0 && !draggingRef.current) {
        offsetRef.current -= MARQUEE_SPEED_PX;
        offsetRef.current = wrapOffset(offsetRef.current);
      }
      applyTransform();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reduceMotion, count, wrapOffset, applyTransform]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const vp = viewportRef.current;
    if (!vp) return;
    draggingRef.current = true;
    dragRef.current = {
      startX: e.clientX,
      startOffset: offsetRef.current,
      pointerId: e.pointerId,
    };
    try {
      vp.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    vp.style.cursor = "grabbing";
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || e.pointerId !== dragRef.current.pointerId) return;
    const dx = e.clientX - dragRef.current.startX;
    offsetRef.current = wrapOffset(dragRef.current.startOffset + dx);
    applyTransform();
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || e.pointerId !== dragRef.current.pointerId) return;
    draggingRef.current = false;
    const vp = viewportRef.current;
    try {
      vp?.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    if (vp) vp.style.cursor = "";
  };

  if (count === 1) {
    return (
      <div className="partnerMarquee partnerMarquee--single" role="region" aria-label="Logo de cliente">
        <div className="partnerMarquee__cell partnerMarquee__cell--solo">
          <Image
            src="/images/clientes/cliente-01.png"
            alt="Logo cliente"
            fill
            className="partnerMarquee__img"
            sizes="min(360px, 90vw)"
            priority
            draggable={false}
          />
        </div>
      </div>
    );
  }

  if (reduceMotion) {
    return (
      <div className="partnerMarquee partnerMarquee--static" role="region" aria-label="Logos de clientes">
        <div className="partnerMarquee__staticGrid">
          {Array.from({ length: count }, (_, i) => {
            const num = String(i + 1).padStart(2, "0");
            return (
              <div key={num} className="partnerMarquee__cell">
                <Image
                  src={`/images/clientes/cliente-${num}.png`}
                  alt={`Logo cliente ${num}`}
                  fill
                  className="partnerMarquee__img"
                  sizes="(max-width: 560px) 40vw, 200px"
                  priority={i === 0}
                  draggable={false}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="partnerMarquee">
      <div
        ref={viewportRef}
        className="partnerMarquee__viewport"
        role="region"
        tabIndex={0}
        aria-label="Faixa de logos em movimento contínuo. Pode arrastar horizontalmente; ao soltar, o movimento continua."
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="partnerMarquee__fade partnerMarquee__fade--left" aria-hidden />
        <div className="partnerMarquee__fade partnerMarquee__fade--right" aria-hidden />
        <div ref={trackRef} className="partnerMarquee__track partnerMarquee__track--loop">
          {(["a", "b"] as const).flatMap((prefix) =>
            Array.from({ length: count }, (_, i) => {
              const num = String(i + 1).padStart(2, "0");
              return (
                <div key={`${prefix}-${num}`} className="partnerMarquee__cell">
                  <Image
                    src={`/images/clientes/cliente-${num}.png`}
                    alt={`Logo cliente ${num}`}
                    fill
                    className="partnerMarquee__img"
                    sizes="(max-width: 560px) 44vw, 280px"
                    priority={prefix === "a" && i === 0}
                    draggable={false}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function MethodologyHubCore() {
  return (
    <div className="methodologyHub" role="img" aria-label="Radar da metodologia: varredura animada no eixo integrador">
      <div className="methodologyHub__glowHalo" aria-hidden />
      <div className="methodologyHub__staticDisk" aria-hidden />
      <div className="methodologyHub__rotor" aria-hidden>
        <div className="methodologyHub__sweep" />
        <div className="methodologyHub__dashedRing" />
      </div>
      <div className="methodologyHub__center" aria-hidden>
        <div className="methodologyHub__dots">
          <span className="methodologyHub__dot" />
          <div className="methodologyHub__dotsRow">
            <span className="methodologyHub__dot" />
            <span className="methodologyHub__dot" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MethodologyTrustIcon({ id }: { id: (typeof methodologyTrust)[number]["id"] }) {
  const c = "methodologyTrustBar__iconSvg";
  if (id === "shield")
    return (
      <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path
          d="M12 3l8 3v6c0 4.5-3.2 8.2-8 9-4.8-.8-8-4.5-8-9V6l8-3z"
          strokeLinejoin="round"
        />
        <path d="M9 12l2 2 4-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (id === "target")
    return (
      <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2" strokeLinecap="round" />
      </svg>
    );
  if (id === "lock")
    return (
      <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </svg>
    );
  return (
    <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path
        d="M9 12l2 2 4-4M8 8l-3 3a4 4 0 0 0 0 5.7L12 22l4.5-4.5a2 2 0 0 0 0-2.8L12 7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 5.5L17 4a4 4 0 0 1 4.5 4.5L20 9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SectionHeader({ eyebrow, title, description }: { eyebrow?: string; title: string; description: string }) {
  return (
    <div className="sectionHeader reveal">
      {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function ProgressBars({ data, highlightLabel }: { data: DataPoint[]; highlightLabel?: string }) {
  return (
    <div className="barChart reveal">
      {data.map((item) => (
        <div key={item.channel} className={`barRow ${highlightLabel === item.channel ? "barRow--hl" : ""}`}>
          <div className="barMeta">
            <span>{item.channel}</span>
            <strong>{formatMixPercent(item.value)}</strong>
          </div>
          <div className="barTrack">
            <div className="barFill" style={{ width: `${Math.min(100, Math.max(0, item.value))}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ShareRing({ portion }: { portion: number }) {
  const clamped = Math.min(100, Math.max(0, portion));
  return (
    <div
      className="shareRing"
      style={{
        background: `conic-gradient(var(--brand) ${clamped}%, color-mix(in srgb, var(--line) 80%, var(--text)) ${clamped}%)`,
      }}
      role="img"
      aria-label={`Participação estimada ${Math.round(clamped)} por cento`}
    />
  );
}

function channelByKey(key: string): Channel {
  return channels.find((c) => c.key === key) ?? channels[0];
}

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<SegmentName>("Industrial");
  const [channelModalOpen, setChannelModalOpen] = useState(false);
  const [modalChannelKey, setModalChannelKey] = useState("whatsapp");
  const [platformModalOpen, setPlatformModalOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("estrutura");
  const [ecosystemOpen, setEcosystemOpen] = useState<EcosystemId | null>(null);
  const [ecosystemImageLightbox, setEcosystemImageLightbox] = useState<{ src: string; alt: string; title: string } | null>(null);
  const ecosystemPanelRef = useRef<HTMLDivElement | null>(null);
  const structurePillarsBandRef = useRef<HTMLDivElement | null>(null);
  const structurePillarsParallaxRef = useRef<HTMLDivElement | null>(null);

  const currentData = useMemo(
    () => normalizeMixTo100Percent(recoveryData[selectedSegment]),
    [selectedSegment]
  );
  const strongestChannel = useMemo(() => [...currentData].sort((a, b) => b.value - a.value)[0], [currentData]);
  const modalChannel = useMemo(() => channels.find((c) => c.key === modalChannelKey) ?? channels[0], [modalChannelKey]);

  const highlightChannelLabel = useMemo(() => {
    const label = modalChannel.label;
    return channelLabelToDataKey[label] ?? label;
  }, [modalChannel]);

  /** Percentual do canal aberto no mix do segmento (igual ao rótulo da barra e à soma 100%). */
  const channelPortion = useMemo(() => {
    const row = currentData.find((d) => d.channel === highlightChannelLabel);
    return row?.value ?? 0;
  }, [currentData, highlightChannelLabel]);

  function openChannelInsight(key: string) {
    setModalChannelKey(key);
    setChannelModalOpen(true);
  }

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const next = total > 0 ? (window.scrollY / total) * 100 : 0;
      setScrollProgress(Math.max(0, Math.min(100, next)));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("isVisible");
          }
        });
      },
      { threshold: 0.16 }
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [channelModalOpen, platformModalOpen, ecosystemOpen, ecosystemImageLightbox]);

  useEffect(() => {
    const sectionElements = navItems
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => Boolean(element));

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) {
          setActiveSection(visible.target.id);
        }
      },
      { threshold: [0.2, 0.45, 0.7], rootMargin: "-20% 0px -40% 0px" }
    );

    sectionElements.forEach((section) => sectionObserver.observe(section));
    return () => sectionObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!channelModalOpen && !platformModalOpen && !ecosystemImageLightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setChannelModalOpen(false);
        setPlatformModalOpen(false);
        setEcosystemImageLightbox(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [channelModalOpen, platformModalOpen, ecosystemImageLightbox]);

  useEffect(() => {
    if (!ecosystemOpen) return;
    const id = requestAnimationFrame(() => {
      ecosystemPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(id);
  }, [ecosystemOpen]);

  useLayoutEffect(() => {
    const band = structurePillarsBandRef.current;
    const layer = structurePillarsParallaxRef.current;
    if (!band || !layer) return;

    const reduce =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      layer.style.transform = "translate3d(0,0,0) scale(1.16)";
      return;
    }

    /** Parallax: fundo desloca em Y em relação ao scroll — factor e limite altos = efeito bem visível. */
    const tick = () => {
      const r = band.getBoundingClientRect();
      const raw = -r.top * 0.32;
      const y = Math.max(-180, Math.min(180, raw));
      layer.style.transform = `translate3d(0, ${y}px, 0) scale(1.24)`;
    };

    let raf = 0;
    const onScrollOrResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };

    onScrollOrResize();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <main id="top">
      <div className="scrollProgress" style={{ width: `${scrollProgress}%` }} />

      <header className="siteHeader">
        <div className="container navWrap">
          <a href="#top" className="brandMark" aria-label="ABE — início">
            <Image src="/logos/abe.png" alt="ABE" width={150} height={70} className="brandLogo" priority />
          </a>

          <nav className={`mainNav ${menuOpen ? "open" : ""}`}>
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setMenuOpen(false)}
                className={activeSection === item.id ? "isActive" : ""}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="navActions">
            <ThemeToggle />
            <button className="menuButton" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label="Abrir menu">
              ☰
            </button>
          </div>
        </div>
      </header>

      <section className="heroSection">
        <div className="container heroLayout">
          <div className="heroTop reveal">
            <div className="heroCopy">
              <p className="heroBadge">Tradição, tecnologia e performance desde 1979</p>
              <h1>Recuperação de crédito B2B com presença nacional, inteligência operacional e experiência executiva.</h1>
              <p className="heroLead">
                A ABE integra cobrança preventiva, negociação amigável, jurídico especializado e cobrança presencial em uma jornada completa para reduzir inadimplência e elevar performance de recuperação.
              </p>
              <div className="heroActions">
                <a href="#ecossistema" className="buttonPrimary">
                  Explorar o ecossistema
                </a>
                <a href="#contratos" className="buttonSecondary">
                  Ver modelos contratuais
                </a>
              </div>
            </div>

            <figure className="heroMedia">
              <Image
                src="/images/hero-marca.png"
                alt="Identidade e atuação ABE"
                fill
                className="heroMedia__img"
                sizes="(max-width: 1080px) 100vw, 46vw"
                priority
              />
              <figcaption className="srOnly">Imagem institucional principal (hero)</figcaption>
            </figure>
          </div>

          <div className="kpiGrid heroKpi reveal">
            <KpiCard label="Atuação" value="100% nacional" sub="Cobertura com estrutura presencial" />
            <KpiCard label="Foco" value="B2B" sub="Estratégia orientada a empresas" />
            <KpiCard label="Modelo" value="Multicanal" sub="Tecnologia + jurídico + negociação" />
          </div>
        </div>
      </section>

      <section id="estrutura" className="siteSection">
        <div className="container">
          <SectionHeader
            title="Estrutura organizacional orientada à recuperação, governança e escala."
            description="Uma operação desenhada para unir tecnologia, inteligência comercial, negociação amigável e jurídico estratégico em um fluxo integrado, com foco na máxima eficiência da carteira."
          />

          <div className="structureLayout">
            <div className="structurePair structurePair--textFirst reveal">
              <div className="structureIntro">
                <h3 className="structureIntro__title">Estrutura organizacional</h3>
                <p className="structureIntro__line">Metodologia proprietária</p>
                <p className="structureIntro__copy">
                  Modelo desenhado para integrar operações, dados, jurídico e relacionamento em um fluxo único, com governança e escala para maximizar a recuperação em cada etapa da carteira.
                </p>
              </div>
              <div className="structureFigure structureFigure--hero">
                <Image
                  src="/images/estrutura-organizacional.png"
                  alt="Estrutura organizacional ABE"
                  width={1823}
                  height={1094}
                  className="structureFigure__img"
                  sizes="(max-width: 719px) 100vw, 77vw"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className="structurePillarsBand structurePillarsBand--methodology"
          ref={structurePillarsBandRef}
          aria-label="Metodologia: pilares da operação"
        >
          <div className="structurePillarsBand__parallax" ref={structurePillarsParallaxRef} aria-hidden>
            <Image
              src={ESTRUTURA_PILARES_BG}
              alt=""
              fill
              className="structurePillarsBand__parallaxImg"
              sizes="100vw"
              priority
            />
          </div>
          <div className="structurePillarsBand__veil" aria-hidden />
          <div className="container structurePillarsBand__inner">
            <p className="methodologyKicker reveal">Metodologia proprietária</p>
            <div className="methodologyLayout reveal">
              <div className="methodologyGrid">
                {methodologyPillars.map((pillar) => {
                  const text = structurePillars.find((p) => p.title === pillar.title)!.text;
                  const slug = structurePillarSlug[pillar.title];
                  return (
                    <article
                      key={pillar.title}
                      className={`methodologyPillar methodologyPillar--${pillar.side} methodologyPillar--${slug}`}
                      style={{ gridArea: pillar.gridArea }}
                    >
                      <div className="methodologyPillar__copy">
                        <h3 className="methodologyPillar__title">{pillar.title}</h3>
                        <p className="methodologyPillar__text">{text}</p>
                      </div>
                      <div className="methodologyPillar__iconRing" aria-hidden>
                        <StructureIcon title={pillar.title} />
                      </div>
                      <MetodologiaPilarImagem pillar={pillar.title} />
                    </article>
                  );
                })}
                <div className="methodologyGrid__hub" style={{ gridArea: "hub" }}>
                  <MethodologyHubCore />
                </div>
              </div>
              <div className="methodologyTrustBar" role="list">
                {methodologyTrust.map((item) => (
                  <div key={item.id} className="methodologyTrustBar__item" role="listitem">
                    <MethodologyTrustIcon id={item.id} />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="ecossistema" className="siteSection siteSection--dark">
        <div className="container">
          <SectionHeader
            title="Um ecossistema completo para gestão e recuperação de créditos."
            description="Clique em cada solução para ver os meios de cobrança integrados. Em seguida, abra o painel analítico para comparar o mix por segmento."
          />
          <div className="productGrid productGrid--interactive">
            {ecosystemCompanies.map((item) => {
              const isOpen = ecosystemOpen === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`productCard productCard--ecosystem reveal ${isOpen ? "isSelected" : ""}`}
                  onClick={() => setEcosystemOpen((prev) => (prev === item.id ? null : item.id))}
                  aria-pressed={isOpen}
                >
                  <div className="productLogoWrap">
                    <Image
                      src={item.logo}
                      alt={item.alt}
                      width={360}
                      height={120}
                      className="productLogo"
                      sizes="(max-width: 900px) 70vw, 280px"
                    />
                  </div>
                  <p>{item.text}</p>
                  <span className="productCard__hint">{isOpen ? "Fechar meios" : "Ver meios de cobrança"}</span>
                </button>
              );
            })}
          </div>

          {ecosystemOpen ? (
            <div ref={ecosystemPanelRef} className="ecosystemPanel reveal isVisible" id="ecosystem-meios">
              {ecosystemCompanies
                .filter((c) => c.id === ecosystemOpen)
                .map((item) => (
                  <div key={item.id} className="ecosystemPanel__inner">
                    <div className="ecosystemPanel__head">
                      <h3 className="ecosystemPanel__title">Meios de cobrança — {item.alt}</h3>
                      <p className="ecosystemPanel__lede">Selecione um canal para abrir o painel com KPIs, comparativo entre meios e leitura por segmento.</p>
                    </div>

                    <div className="ecosystemDashSlot">
                      <button
                        type="button"
                        className="ecosystemDashSlot__trigger"
                        onClick={() =>
                          setEcosystemImageLightbox({
                            src: item.panelImage.src,
                            alt: item.panelImage.alt,
                            title: item.alt,
                          })
                        }
                        aria-label={`Ampliar imagem — ${item.alt}`}
                      >
                        <Image
                          src={item.panelImage.src}
                          alt={`${item.panelImage.alt}. Clique para ampliar.`}
                          fill
                          className="ecosystemDashSlot__img"
                          sizes="(max-width: 1200px) 100vw, 1120px"
                        />
                      </button>
                    </div>

                    <div className="ecosystemChannelGrid">
                      {item.channelKeys.map((key) => {
                        const ch = channelByKey(key);
                        return (
                          <button
                            key={key}
                            type="button"
                            className="channelTile"
                            data-ch={ch.key}
                            onClick={() => {
                              setModalChannelKey(ch.key);
                              setChannelModalOpen(true);
                            }}
                          >
                            <span className="channelTile__iconWrap" aria-hidden>
                              <ChannelIcon name={ch.icon} />
                            </span>
                            <span className="channelTile__body">
                              <span className="channelTile__title">{ch.label}</span>
                              <span className="channelTile__desc">{ch.description}</span>
                            </span>
                            <span className="channelTile__cta">Abrir painel</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>
          ) : null}
        </div>
      </section>

      <section id="cobranca-presencial" className="siteSection">
        <div className="container">
          <SectionHeader
            title="Cobrança presencial e presença em todo o território."
            description="Estrutura de negociadores, visitas presenciais e leitura ilustrativa por estado no mapa abaixo."
          />

          <div className="visitLayout visitLayout--stack">
            <article className="visitCard reveal">
              <div className="visitCard__inner">
                <p className="heroBadge">Cobrança presencial</p>
                <h3>Cobrança presencial como diferencial competitivo real.</h3>
                <p>
                  A ABE conta com estrutura de cobrança presencial em todo o território nacional, promovendo uma abordagem mais humana, ágil, eficaz e efetiva. Nossos negociadores visitam o inadimplente em seu próprio estabelecimento comercial, fortalecendo a conversão em casos complexos e de maior valor agregado.
                </p>
                <ul className="featureList">
                  <li>Atuação em 100% do território nacional</li>
                  <li>Negociadores com formação específica e abordagem técnica</li>
                  <li>Uma das maiores fontes de recuperação da operação</li>
                </ul>
              </div>
              <div className="visitCard__photo">
                <Image
                  src="/images/negociador-presencial.png"
                  alt="Negociador presencial ABE"
                  fill
                  className="visitCard__img"
                  sizes="(max-width: 899px) 100vw, 42vw"
                  priority={false}
                />
              </div>
            </article>

            <article className="mapCard reveal">
              <p className="eyebrow alt">Cobertura nacional</p>
              <h3>Presença operacional por estado</h3>
              <p className="mapCard__intro">
                Mapa do Brasil interativo: taxa ilustrativa por UF, coerente com concentração comercial (pico em São Paulo, eixo forte em MG/PR e Sul) e faixas mais baixas onde a operação presencial e o volume típicos são menores (ex.: Acre e estados de fronteira com baixa densidade comercial).
              </p>
              <BrazilMapInteractive />
            </article>
          </div>
        </div>
      </section>

      {/*
        Preview: embed Power BI (URL em ABE_ONLINE_EMBED_URL).
        Imagem estática opcional para PDF/redes: public/images/plataforma-institucional-preview.png
      */}
      <section id="online" className="siteSection siteSection--dark">
        <div className="container">
          <SectionHeader
            title="ABE Online: visibilidade, transparência e acompanhamento em tempo real."
            description="Uma experiência visual pensada para destacar a tecnologia e permitir que o usuário explore a plataforma por meio de uma apresentação imersiva em tela cheia."
          />
          <div className="onlinePanel reveal">
            <div className="onlinePanel__copy">
              <div className="heroBadge">Plataforma institucional</div>
              <h3>Explore a operação em uma interface que valoriza dados, clareza e controle.</h3>
              <p>
                Acompanhe indicadores, carteiras e jornadas com transparência. Use o preview ao lado ou o botão abaixo para abrir a visualização ampliada — o mesmo destino nos dois casos.
              </p>
              <button type="button" className="buttonPrimary" onClick={() => setPlatformModalOpen(true)}>
                Visualizar plataforma
              </button>
            </div>
            <div className="onlinePanel__visual">
              <div className="onlinePanel__browser">
                <div className="onlinePanel__browserChrome" aria-hidden>
                  <span />
                  <span />
                  <span />
                </div>
                <div className="onlinePanel__browserBody">
                  <iframe
                    className="onlinePanel__iframe onlinePanel__iframe--interactive"
                    src={ABE_ONLINE_EMBED_URL}
                    title={ABE_PLATFORM_IFRAME_TITLE}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                  <button type="button" className="onlinePanel__fullscreenFab" onClick={() => setPlatformModalOpen(true)}>
                    Tela cheia
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="clientes" className="siteSection">
        <div className="container">
          <SectionHeader
            title="Empresas que confiam na ABE."
            description="Marcas de referência que reforçam credibilidade e escala."
          />
          <div className="partnerShowcase reveal">
            <PartnerLogoCarousel />
          </div>
        </div>
      </section>

      <section id="diferenciais" className="siteSection siteSection--dark">
        <div className="container">
          <SectionHeader
            title="Diferenciais que posicionam a ABE como referência no mercado."
            description="Tradição, cobertura nacional, inteligência operacional e um ecossistema integrado para entregar eficiência real na recuperação de crédito."
          />
          <div className="diffVault reveal" aria-label="Principais diferenciais ABE">
            <div className="diffVault__frame">
              <div className="diffVault__ambient" aria-hidden />
              <div className="diffVault__grid">
                {differentials.map((item, index) => (
                  <article
                    key={`diff-${index}`}
                    className={`diffVault__card ${index % 4 === 0 ? "diffVault__card--accent" : ""}`}
                  >
                    <div className="diffVault__cardStripe" aria-hidden />
                    <span className="diffVault__index">{String(index + 1).padStart(2, "0")}</span>
                    <p className="diffVault__text">{item}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contratos" className="siteSection">
        <div className="container contractSection">
          <div className="contractSection__header reveal">
            <SectionHeader
              title="Modelos contratuais com leitura clara e comparativo direto."
              description="Escolha o modelo alinhado ao seu objetivo: performance com success fee ou preservação do principal com honorário zero. Os valores abaixo são um exemplo ilustrativo para apoiar a conversa comercial."
            />
          </div>

          <div className="contractGrid contractGrid--modern">
            {contractCards.map((card, index) => (
              <article key={card.title} className={`contractCard contractCard--modern reveal ${index === 1 ? "contractCard--accent" : ""}`}>
                <header className="contractCard__head">
                  <span className="contractCard__tag">{card.tag}</span>
                  <h3>{card.title}</h3>
                </header>
                <ul className="contractCard__points">
                  {card.points.map((point) => (
                    <li key={point}>
                      <span className="contractCard__bullet" aria-hidden />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="siteFooter">
        <div className="container footerWrap reveal">
          <div>
            <Image src="/logos/abe.png" alt="ABE" width={140} height={70} className="footerLogo" />
            <p className="footerTagline">
              ABE Assessoria e Recuperação de Créditos Financeiros Ltda © Copyright 2026 - Todos os Direitos Reservados.
            </p>
          </div>
          <nav className="footerNav">
            {navItems.map((item) => (
              <a key={item.id} href={`#${item.id}`}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </footer>

      {channelModalOpen ? (
        <div className="modalOverlay modalOverlay--channel" role="dialog" aria-modal="true" aria-labelledby="channel-modal-title">
          <div className="modalContent modalContent--channel reveal isVisible">
            <button type="button" className="modalClose" onClick={() => setChannelModalOpen(false)} aria-label="Fechar">
              ✕
            </button>
            <div className="modalContent__intro">
              <div className="modalChannelHead">
                <span className="modalChannelHead__iconWrap" aria-hidden>
                  <ChannelIcon name={modalChannel.icon} />
                </span>
                <div className="modalChannelHead__main">
                  <h3 className="modalChannelHead__title" id="channel-modal-title">
                    {modalChannel.label}
                  </h3>
                  <p className="modalChannelHead__subtitle">Painel analítico</p>
                </div>
              </div>
              <p className="modalContent__lead">
                Os percentuais por canal somam 100% em cada ramo e correspondem ao mesmo critério do gráfico e do anel. Indicadores ilustrativos para leitura comparativa.
              </p>
            </div>
            <div className="modalContent__body">
              <div className="dashboardHead modalSegmentHead">
                <span className="modalSegmentHead__label">Ramo de atividade</span>
                <div className="segmentWrap">
                  {Object.keys(recoveryData).map((segment) => (
                    <button
                      key={segment}
                      type="button"
                      className={`segmentFilter ${selectedSegment === segment ? "active" : ""}`}
                      onClick={() => setSelectedSegment(segment as SegmentName)}
                    >
                      {segment}
                    </button>
                  ))}
                </div>
              </div>

              <div className="modalDashStack">
                <div className="modalDashKpis">
                  <KpiCard label="Segmento ativo" value={selectedSegment} sub="Base do comparativo (soma 100%)" />
                  <KpiCard
                    label="Canal em análise"
                    value={modalChannel.label}
                    sub={`${formatMixPercent(channelPortion)} do mix neste ramo`}
                  />
                  <KpiCard
                    label="Maior peso no ramo"
                    value={strongestChannel.channel}
                    sub={`${formatMixPercent(strongestChannel.value)} do mix`}
                  />
                </div>

                <div className="modalRingPanel">
                  <ShareRing portion={channelPortion} />
                  <div className="modalRingPanel__text">
                    <strong>Participação do canal no segmento</strong>
                    <p className="modalRingPanel__sub">
                      O mesmo valor de <strong>{formatMixPercent(channelPortion)}</strong> exibido na barra deste canal: fatia do mix entre meios neste ramo (total 100%).
                    </p>
                  </div>
                </div>
              </div>

              <div className="chartGrid modalChartGrid">
                <div className="chartPanel">
                  <strong>Comparativo entre meios — {selectedSegment}</strong>
                  <ProgressBars data={currentData} highlightLabel={highlightChannelLabel} />
                </div>
                <div className="storyPanel reveal">
                  <strong>Leitura estratégica</strong>
                  <p>{stories[selectedSegment]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {platformModalOpen ? (
        <div className="modalOverlay modalOverlay--platform" role="dialog" aria-modal="true" aria-label="Painel em tela cheia">
          <button type="button" className="modalClose modalClose--platform" onClick={() => setPlatformModalOpen(false)} aria-label="Fechar">
            ✕
          </button>
          <iframe
            className="modalPlatformIframe"
            src={ABE_ONLINE_EMBED_URL}
            title={ABE_PLATFORM_IFRAME_TITLE}
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      ) : null}

      {ecosystemImageLightbox ? (
        <div
          className="modalOverlay modalOverlay--ecosystemDash"
          role="dialog"
          aria-modal="true"
          aria-label={`Imagem ampliada — ${ecosystemImageLightbox.title}`}
          onClick={() => setEcosystemImageLightbox(null)}
        >
          <button type="button" className="modalClose modalClose--ecosystemDash" onClick={() => setEcosystemImageLightbox(null)} aria-label="Fechar">
            ✕
          </button>
          <div className="ecosystemDashModal" onClick={(e) => e.stopPropagation()}>
            <p className="ecosystemDashModal__title">{ecosystemImageLightbox.title}</p>
            <div className="ecosystemDashModal__imgWrap">
              <Image
                src={ecosystemImageLightbox.src}
                alt={ecosystemImageLightbox.alt}
                width={1200}
                height={520}
                className="ecosystemDashModal__img"
                sizes="100vw"
                priority
              />
            </div>
            <p className="ecosystemDashModal__hint">Clique fora ou em ✕ para fechar</p>
          </div>
        </div>
      ) : null}
    </main>
  );
}
