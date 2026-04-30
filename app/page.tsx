"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BrazilMapInteractive } from "@/components/BrazilMapInteractive";
import { ChannelIcon } from "@/components/ChannelIcons";
import { ImageComparisonSlider } from "@/components/ImageComparisonSlider";

type SegmentName = "Industrial" | "Varejo" | "Serviços" | "Saúde" | "Distribuição";

type DataPoint = { channel: string; value: number };

type NavItem = { id: string; label: string };

type Channel = { key: string; label: string; description: string; icon: string };

const navItems: NavItem[] = [
  { id: "home", label: "Home" },
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

/** Grejo abre modal com antes/depois lateral (call center × negociadores sênior). */
type EcosystemPanelCompare = {
  left: { src: string; alt: string };
  right: { src: string; alt: string };
  leftLabel: string;
  rightLabel: string;
};

type EcosystemImageLightboxState =
  | { kind: "single"; title: string; src: string; alt: string }
  | {
      kind: "compare";
      title: string;
      left: { src: string; alt: string };
      right: { src: string; alt: string };
      leftLabel: string;
      rightLabel: string;
    };

const ecosystemCompanies: {
  id: EcosystemId;
  logo: string;
  alt: string;
  text: string;
  channelKeys: Channel["key"][];
  /** Imagem no painel; `panelCompare` exige dois ficheiros (veja também `public/images/grejo-*.png`). */
  panelImage: { src: string; alt: string };
  panelCompare?: EcosystemPanelCompare;
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
      src: "/images/grejo-negociadores-senior.png",
      alt: "Negociadores sênior e atuação comercial com apoio Grejo Advogados",
    },
    panelCompare: {
      left: {
        src: "/images/grejo-operacao-call-center.png",
        alt: "Operação em call center: acionamento e relacionamento com devedores",
      },
      right: {
        src: "/images/grejo-negociadores-senior.png",
        alt: "Negociadores sênior: proximidade, técnica e presença comercial",
      },
      leftLabel: "Call center",
      rightLabel: "Negociadores sênior",
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

/** Masthead «Cobrança presencial» — faixa Brasil (território nacional). */
const PRESENCIAL_MASTHEAD_IMAGE = "/images/bandeira-brasil.png";

/** Foto negociador (`public/images/`): card inferior. */
const PRESENCIAL_NEGOTIATOR_IMAGE = "/images/negociador-presencial1.png";

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

/** Mural: todas as logos visíveis, sem carrossel. */
function PartnerLogoWall() {
  const count = CLIENT_LOGO_COUNT;
  const logos = useMemo(() => Array.from({ length: count }, (_, i) => String(i + 1).padStart(2, "0")), [count]);

  if (count <= 0) return null;

  if (count === 1) {
    return (
      <div className="partnerWall partnerWall--solo">
        <figure className="partnerWall__solo">
          <div className="partnerWall__card partnerWall__card--prominent">
            <Image
              src="/images/clientes/cliente-01.png"
              alt="Logo de cliente"
              fill
              className="partnerWall__img"
              sizes="min(620px, 92vw)"
              priority
              draggable={false}
            />
          </div>
        </figure>
      </div>
    );
  }

  return (
    <div className="partnerWall" role="region" aria-label="Marcas e clientes ABE — todas as logos">
      <ul className="partnerWall__grid" role="list">
        {logos.map((num) => (
          <li key={num} className="partnerWall__item" role="listitem">
            <div className="partnerWall__card">
              <Image
                src={`/images/clientes/cliente-${num}.png`}
                alt={`Logo cliente ${num}`}
                fill
                className="partnerWall__img"
                sizes="(max-width: 480px) 52vw, (max-width: 900px) 30vw, 240px"
                priority={num === "01"}
                draggable={false}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SectionHeader({ eyebrow, title, description }: { eyebrow?: string; title: string; description: ReactNode }) {
  return (
    <div className="sectionHeader reveal">
      {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
      <h2>{title}</h2>
      <div className="sectionHeader__desc">{typeof description === "string" ? <p>{description}</p> : description}</div>
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
  const [structureModalOpen, setStructureModalOpen] = useState(false);
  const [channelModalOpen, setChannelModalOpen] = useState(false);
  const [modalChannelKey, setModalChannelKey] = useState("whatsapp");
  const [platformModalOpen, setPlatformModalOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("home");
  const [ecosystemOpen, setEcosystemOpen] = useState<EcosystemId | null>(null);
  const [ecosystemImageLightbox, setEcosystemImageLightbox] = useState<EcosystemImageLightboxState | null>(null);
  const ecosystemPanelRef = useRef<HTMLDivElement | null>(null);

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
    if (!structureModalOpen && !channelModalOpen && !platformModalOpen && !ecosystemImageLightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setStructureModalOpen(false);
        setChannelModalOpen(false);
        setPlatformModalOpen(false);
        setEcosystemImageLightbox(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [structureModalOpen, channelModalOpen, platformModalOpen, ecosystemImageLightbox]);

  useEffect(() => {
    if (!ecosystemOpen) return;
    const id = requestAnimationFrame(() => {
      ecosystemPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(id);
  }, [ecosystemOpen]);

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

      <section id="home" className="heroSection">
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
                <button type="button" className="buttonSecondary" onClick={() => setStructureModalOpen(true)}>
                  Estrutura Organizacional
                </button>
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
                        onClick={() => {
                          const compare = item.panelCompare;
                          if (compare) {
                            setEcosystemImageLightbox({
                              kind: "compare",
                              title: item.alt,
                              left: compare.left,
                              right: compare.right,
                              leftLabel: compare.leftLabel,
                              rightLabel: compare.rightLabel,
                            });
                            return;
                          }
                          setEcosystemImageLightbox({
                            kind: "single",
                            title: item.alt,
                            src: item.panelImage.src,
                            alt: item.panelImage.alt,
                          });
                        }}
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

      <section id="cobranca-presencial" className="siteSection siteSection--presencialImpact">
        <div className="container">
          <div className="presencialImpact__masthead reveal">
            <div className="presencialImpact__mastheadGrid">
              <div className="presencialImpact__mastheadCopy">
                <p className="presencialImpact__chip">Proximidade e execução no território</p>
                <SectionHeader
                  title="Cobrança presencial em todo o território nacional"
                  description={
                    <>
                      <p className="sectionHeader__leadAccent">
                        A ABE é a única empresa de recuperação de créditos com estrutura de cobrança presencial em todo o território nacional.
                      </p>
                      <p>O mapa abaixo sintetiza, ilustrativamente, a leitura por UF.</p>
                    </>
                  }
                />
              </div>
              <div className="presencialImpact__mastheadPhoto">
                <Image
                  src={PRESENCIAL_MASTHEAD_IMAGE}
                  alt="Território nacional — bandeira do Brasil"
                  fill
                  className="presencialImpact__mastheadImg"
                  sizes="(max-width: 899px) 100vw, min(460px, 40vw)"
                  priority={false}
                />
              </div>
            </div>
          </div>

          <div className="visitLayout visitLayout--stack">
            <article className="mapCard reveal" aria-label="Mapa interativo por estado">
              <p className="mapCard__kicker">Leitura ilustrativa por UF — passe o cursor sobre os estados</p>
              <BrazilMapInteractive />
            </article>

            <article className="visitCard visitCard--presence reveal">
              <div className="visitCard__inner">
                <p className="visitCard__kicker">Equipe Presencial!</p>
                <h3 className="visitCard__subtitle">Presença comercial onde o caso pede resultado</h3>
                <p className="visitCard__lead">
                  Abrangência nacional combinada com abordagem humana e técnica. Os negociadores visitam o estabelecimento do inadimplente quando isso aumenta produtividade e conversão — especialmente em operações maiores ou mais delicadas.
                </p>
                <div className="visitCard__divider" aria-hidden />
                <ul className="featureList featureList--presence">
                  <li>Atuação em 100% do território nacional</li>
                  <li>Formação técnica e discurso alinhados à carteira</li>
                  <li>Uma das principais frentes de recuperação na operação</li>
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
            <PartnerLogoWall />
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

      {structureModalOpen ? (
        <div
          className="modalOverlay modalOverlay--structure"
          role="dialog"
          aria-modal="true"
          aria-labelledby="structure-modal-title"
          onClick={() => setStructureModalOpen(false)}
        >
          <div className="modalContent modalContent--structure reveal isVisible" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modalClose" onClick={() => setStructureModalOpen(false)} aria-label="Fechar">
              ✕
            </button>
            <div className="modalContent__intro">
              <h3 className="modalStructure__title" id="structure-modal-title">
                Estrutura organizacional
              </h3>
              <p className="modalStructure__subtitle">Metodologia proprietária</p>
              <p className="modalContent__lead">
                Tradição e eficiência na recuperação de créditos <strong>desde 1979</strong>, com operação, dados, jurídico e relacionamento
                integrados em um fluxo único.
              </p>
            </div>
            <div className="modalStructure__imageWrap">
              <Image
                src="/images/estrutura-organizacional.png"
                alt="Estrutura organizacional ABE"
                fill
                className="modalStructure__image"
                sizes="(max-width: 1500px) calc(100vw - 32px), 1400px"
                priority
              />
            </div>
          </div>
        </div>
      ) : null}

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
          aria-label={
            ecosystemImageLightbox.kind === "compare"
              ? `Comparativo — ${ecosystemImageLightbox.title}`
              : `Imagem ampliada — ${ecosystemImageLightbox.title}`
          }
          onClick={() => setEcosystemImageLightbox(null)}
        >
          <button type="button" className="modalClose modalClose--ecosystemDash" onClick={() => setEcosystemImageLightbox(null)} aria-label="Fechar">
            ✕
          </button>
          <div
            className={`ecosystemDashModal ${ecosystemImageLightbox.kind === "compare" ? "ecosystemDashModal--compare" : ""}`}
            onClick={(event) => event.stopPropagation()}
          >
            <p className="ecosystemDashModal__title">{ecosystemImageLightbox.title}</p>
            {ecosystemImageLightbox.kind === "compare" ? (
              <>
                <div className="ecosystemDashModalBody--compare">
                  <ImageComparisonSlider
                    leftImage={ecosystemImageLightbox.left}
                    rightImage={ecosystemImageLightbox.right}
                    leftCaption={ecosystemImageLightbox.leftLabel}
                    rightCaption={ecosystemImageLightbox.rightLabel}
                  />
                </div>
                <p className="ecosystemDashModal__hint">
                  Arraste horizontalmente sobre a imagem ou use ← → para comparar. Clique fora ou em ✕ para fechar.
                </p>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      ) : null}
    </main>
  );
}
