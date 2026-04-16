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
  { id: "meios", label: "Meios de Cobrança" },
  { id: "online", label: "ABE Online" },
  { id: "clientes", label: "Clientes" },
  { id: "diferenciais", label: "Diferenciais" },
  { id: "contratos", label: "Contratos" },
];

const channels: Channel[] = [
  { key: "whatsapp", label: "WhatsApp", icon: "whatsapp", description: "Alto índice de resposta para lembretes, renegociação e conversão rápida." },
  { key: "sms", label: "SMS", icon: "sms", description: "Reforço tático para jornadas de cobrança com ampla capilaridade." },
  { key: "email", label: "E-mail", icon: "email", description: "Formalização, registro de proposta e comunicação documentada." },
  { key: "chatbot", label: "Chatbot", icon: "chatbot", description: "Escala digital com autoatendimento inteligente e disponibilidade contínua." },
  { key: "ligacao", label: "Ligação", icon: "ligacao", description: "Canal consultivo para objeções, negociação estruturada e alinhamento mais próximo." },
  { key: "presencial", label: "Visita Presencial", icon: "presencial", description: "Grande diferencial para carteiras complexas e negociações de maior impacto." },
  { key: "internas", label: "Fases Internas", icon: "internas", description: "Fluxos especializados para conduzir a carteira com inteligência e progressão." },
];

const recoveryData: Record<SegmentName, DataPoint[]> = {
  Industrial: [
    { channel: "WhatsApp", value: 22 },
    { channel: "SMS", value: 11 },
    { channel: "E-mail", value: 17 },
    { channel: "Chatbot", value: 14 },
    { channel: "Ligação", value: 28 },
    { channel: "Presencial", value: 35 },
    { channel: "Fases Internas", value: 19 },
  ],
  Varejo: [
    { channel: "WhatsApp", value: 34 },
    { channel: "SMS", value: 21 },
    { channel: "E-mail", value: 18 },
    { channel: "Chatbot", value: 29 },
    { channel: "Ligação", value: 22 },
    { channel: "Presencial", value: 16 },
    { channel: "Fases Internas", value: 20 },
  ],
  Serviços: [
    { channel: "WhatsApp", value: 27 },
    { channel: "SMS", value: 14 },
    { channel: "E-mail", value: 24 },
    { channel: "Chatbot", value: 19 },
    { channel: "Ligação", value: 31 },
    { channel: "Presencial", value: 21 },
    { channel: "Fases Internas", value: 23 },
  ],
  Saúde: [
    { channel: "WhatsApp", value: 20 },
    { channel: "SMS", value: 10 },
    { channel: "E-mail", value: 26 },
    { channel: "Chatbot", value: 15 },
    { channel: "Ligação", value: 29 },
    { channel: "Presencial", value: 24 },
    { channel: "Fases Internas", value: 22 },
  ],
  Distribuição: [
    { channel: "WhatsApp", value: 24 },
    { channel: "SMS", value: 13 },
    { channel: "E-mail", value: 19 },
    { channel: "Chatbot", value: 17 },
    { channel: "Ligação", value: 30 },
    { channel: "Presencial", value: 32 },
    { channel: "Fases Internas", value: 21 },
  ],
};

const stories: Record<SegmentName, string> = {
  Industrial:
    "No segmento industrial, ligação e visita presencial costumam se destacar porque as negociações envolvem valores maiores, múltiplos decisores e mais profundidade consultiva. Os canais digitais seguem acelerando a jornada e reforçando contato.",
  Varejo:
    "No varejo, velocidade faz diferença. Por isso, WhatsApp e chatbot lideram com mais frequência, enquanto SMS, e-mail e ligação sustentam reforço, formalização e reengajamento.",
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
  "https://app.powerbi.com/view?r=eyJrIjoiMTNlMjg1YjAtMWNjZi00OTk0LWE1MGItZGQ0YmUwNzMwODlmIiwidCI6ImJiNmFlZmY5LTczYWItNGNmNS1iZDVlLTkyYmM2M2E3NTI2YyJ9";

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

const structurePillars: { title: StructurePillar; text: string }[] = [
  { title: "Operação", text: "Condução estratégica da carteira com fases, disciplina e acompanhamento contínuo." },
  { title: "Dados", text: "Indicadores executivos para leitura de performance e tomada de decisão." },
  { title: "Jurídico", text: "Suporte técnico e segurança para casos que exigem maior robustez." },
  { title: "Relacionamento", text: "Atendimento próximo, consultivo e alinhado à realidade do cliente." },
];

const channelLabelToDataKey: Record<string, string> = {
  WhatsApp: "WhatsApp",
  SMS: "SMS",
  "E-mail": "E-mail",
  Chatbot: "Chatbot",
  Ligação: "Ligação",
  "Visita Presencial": "Presencial",
  "Fases Internas": "Fases Internas",
};

function maxValue(data: DataPoint[]) {
  return Math.max(...data.map((item) => item.value));
}

function sumValues(data: DataPoint[]) {
  return data.reduce((acc, item) => acc + item.value, 0);
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
  const biggest = maxValue(data);
  return (
    <div className="barChart reveal">
      {data.map((item) => (
        <div key={item.channel} className={`barRow ${highlightLabel === item.channel ? "barRow--hl" : ""}`}>
          <div className="barMeta">
            <span>{item.channel}</span>
            <strong>{item.value}%</strong>
          </div>
          <div className="barTrack">
            <div className="barFill" style={{ width: `${(item.value / biggest) * 100}%` }} />
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

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<SegmentName>("Industrial");
  const [channelModalOpen, setChannelModalOpen] = useState(false);
  const [modalChannelKey, setModalChannelKey] = useState("whatsapp");
  const [platformModalOpen, setPlatformModalOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("estrutura");

  const currentData = useMemo(() => recoveryData[selectedSegment], [selectedSegment]);
  const strongestChannel = useMemo(() => [...currentData].sort((a, b) => b.value - a.value)[0], [currentData]);
  const modalChannel = useMemo(() => channels.find((c) => c.key === modalChannelKey) ?? channels[0], [modalChannelKey]);
  const dataTotal = useMemo(() => sumValues(currentData), [currentData]);

  const highlightChannelLabel = useMemo(() => {
    const label = modalChannel.label;
    return channelLabelToDataKey[label] ?? label;
  }, [modalChannel]);

  const channelPortion = useMemo(() => {
    const row = currentData.find((d) => d.channel === highlightChannelLabel);
    if (!row || dataTotal <= 0) return 0;
    return (row.value / dataTotal) * 100;
  }, [currentData, dataTotal, highlightChannelLabel]);

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
  }, [channelModalOpen, platformModalOpen]);

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
    if (!channelModalOpen && !platformModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setChannelModalOpen(false);
        setPlatformModalOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [channelModalOpen, platformModalOpen]);

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
              <div className="structureFigure">
                <Image
                  src="/images/estrutura-organizacional.png"
                  alt="Estrutura organizacional ABE"
                  width={800}
                  height={640}
                  className="structureFigure__img"
                  sizes="(max-width: 1080px) 100vw, 50vw"
                />
              </div>
            </div>

            <div className="cardGrid structurePillars">
              {structurePillars.map(({ title, text }) => (
                <article className="infoCard reveal" key={title}>
                  <div className="infoCardIconWrap" aria-hidden>
                    <StructureIcon title={title} />
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="ecossistema" className="siteSection siteSection--dark">
        <div className="container">
          <SectionHeader
            title="Um ecossistema completo para gestão e recuperação de créditos."
            description="A ABE atua em conjunto com soluções complementares para ampliar eficiência, previsibilidade e experiência do cliente em toda a jornada de crédito."
          />
          <div className="productGrid">
            {[
              {
                logo: "/logos/avantpay.png",
                alt: "AvantPay",
                title: "AvantPay",
                text: "Plataforma de cobrança preventiva e gestão de recebíveis para agir antes do vencimento e reduzir inadimplência.",
              },
              {
                logo: "/logos/acordo-seguro.png",
                alt: "Acordo Seguro",
                title: "Acordo Seguro",
                text: "Solução 100% digital para negociação online com autonomia, rapidez e experiência moderna.",
              },
              {
                logo: "/logos/grejo.png",
                alt: "Grejo Advogados",
                title: "Grejo Advogados",
                text: "Suporte jurídico empresarial especializado para reforçar segurança e robustez da operação.",
              },
            ].map((item) => (
              <article className="productCard reveal" key={item.title}>
                <div className="productLogoWrap">
                  <Image src={item.logo} alt={item.alt} width={240} height={80} className="productLogo" sizes="(max-width: 900px) 50vw, 200px" />
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="meios" className="siteSection">
        <div className="container">
          <SectionHeader
            title="Meios de cobrança inteligentes com leitura por canal, segmento e performance."
            description="Selecione um meio para abrir o painel com KPIs, comparativo entre canais e leitura estratégica por ramo de atividade."
          />

          <div className="channelShowcaseGrid reveal">
            {channels.map((channel, i) => (
              <button
                key={channel.key}
                type="button"
                className="channelTile"
                data-ch={channel.key}
                onClick={() => openChannelInsight(channel.key)}
              >
                  <span className="channelTile__iconWrap" aria-hidden>
                    <ChannelIcon name={channel.icon} />
                  </span>
                  <span className="channelTile__body">
                    <span className="channelTile__title">{channel.label}</span>
                    <span className="channelTile__desc">{channel.description}</span>
                  </span>
                  <span className="channelTile__cta">Abrir painel</span>
                </button>
              ))}
          </div>

          <div className="visitLayout visitLayout--stack">
            <article className="visitCard reveal">
              <div className="visitCard__inner">
                <p className="heroBadge">Visita presencial</p>
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
                Mapa do Brasil interativo: passe o cursor sobre cada estado para ver a taxa ilustrativa de recuperação. Clique em uma UF na barra ou no mapa para destacar. Os percentuais são exemplos para leitura estratégica.
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
                Análise de desempenho e leitura por segmento. Indicadores ilustrativos — ajuste o ramo para comparar o peso dos meios na carteira.
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
                  <KpiCard label="Segmento ativo" value={selectedSegment} sub="Comparativo por ramo" />
                  <KpiCard label="Canal em análise" value={modalChannel.label} sub="Peso relativo no mix" />
                  <KpiCard label="Destaque no segmento" value={strongestChannel.channel} sub={`${strongestChannel.value}% referência`} />
                </div>

                <div className="modalRingPanel">
                  <ShareRing portion={channelPortion} />
                  <div className="modalRingPanel__text">
                    <strong>Participação estimada neste segmento</strong>
                    <p className="modalRingPanel__sub">
                      O canal analisado representa cerca de {channelPortion.toFixed(1)}% do mix de eficiência relativa (dados ilustrativos).
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
    </main>
  );
}
