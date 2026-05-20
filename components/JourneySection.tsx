"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { ExternalLink, Globe, Radio, Scale, Shield } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

type JourneyStep = {
  num: string;
  tag: string;
  company: string;
  companyLogoSrc: string;
  companyLogoAlt: string;
  companyLogoWidth: number;
  companyLogoHeight: number;
  title: string;
  icon: LucideIcon;
  description: string;
  url: string;
  urlLabel: string;
  toneClass: string;
};

const steps: JourneyStep[] = [
  {
    num: "01",
    tag: "Preventivo",
    company: "AvantPay",
    companyLogoSrc: "/logos/avantpay.png",
    companyLogoAlt: "AvantPay",
    companyLogoWidth: 88,
    companyLogoHeight: 22,
    title: "Antecipar o vencimento",
    icon: Radio,
    description:
      "Antes do vencimento, o problema ainda tem solução simples. A AvantPay atua na pré-cobrança inteligente: comunicação no momento certo, pelos canais adequados, com a mensagem apropriada para o relacionamento B2B. O objetivo é preservar o relacionamento comercial enquanto reduz o risco de inadimplência — sem ruído, sem atrito, sem comprometer a reputação do credor junto ao seu cliente.",
    url: "https://avantpay.com.br/",
    urlLabel: "Site AvantPay",
    toneClass: "is-emerald",
  },
  {
    num: "02",
    tag: "Operação",
    company: "ABE",
    companyLogoSrc: "/logos/abe.png",
    companyLogoAlt: "ABE",
    companyLogoWidth: 72,
    companyLogoHeight: 22,
    title: "Entrar quando há inadimplência",
    icon: Shield,
    description:
      "Quando a carteira já tem títulos vencidos, entra a operação de cobrança. A ABE atua em âmbito nacional com método, governança e equipes especializadas — respeitando a reputação do credor e seguindo os critérios operacionais de cada carteira. Não é cobrança genérica: é gestão de carteira irregular com foco em resultado sustentável e conformidade operacional.",
    url: "https://abe.com.br/",
    urlLabel: "Site ABE",
    toneClass: "is-blue",
  },
  {
    num: "03",
    tag: "Digital",
    company: "Acordo Seguro",
    companyLogoSrc: "/logos/acordo-seguro.png",
    companyLogoAlt: "Acordo Seguro",
    companyLogoWidth: 126,
    companyLogoHeight: 26,
    title: "Negociar sem fricção",
    icon: Globe,
    description:
      "Nem todo devedor precisa de abordagem ativa — muitos estão dispostos a negociar, mas precisam de um canal acessível, claro e autônomo. O Acordo Seguro oferece uma plataforma de negociação digital onde o devedor acessa suas dívidas, entende as condições disponíveis e formaliza o acordo dentro da política da credora. Transparência, conformidade e experiência fluida do começo ao fim.",
    url: "https://www.acordoseguro.com.br/",
    urlLabel: "Site Acordo Seguro",
    toneClass: "is-violet",
  },
  {
    num: "04",
    tag: "Jurídico",
    company: "Grejo Advogados",
    companyLogoSrc: "/logos/grejo.png",
    companyLogoAlt: "Grejo Advogados",
    companyLogoWidth: 94,
    companyLogoHeight: 22,
    title: "Estratégia jurídica quando o caso exige rigor",
    icon: Scale,
    description:
      "Alguns créditos precisam de mais do que cobrança — precisam de estratégia jurídica. O Grejo Advogados atua em direito empresarial e recuperação de crédito, com equipe especializada, peças processuais fundamentadas e atuação alinhada à operação de cobrança. A transição entre a etapa operacional e o suporte jurídico acontece com continuidade de informação, sem recomeçar do zero.",
    url: "https://grejoadvogados.com.br/",
    urlLabel: "Site Grejo Advogados",
    toneClass: "is-amber",
  },
];

export default function JourneySection() {
  return (
    <section id="jornada" className="journey-section">
      <div className="container journey-container">
        <AnimatedSection>
          <p className="journey-eyebrow">O Ciclo do Crédito</p>
          <h2 className="journey-title">A jornada em quatro etapas</h2>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <p className="journey-intro">
            A ordem das etapas abaixo segue como o ciclo econômico acontece na prática — não é uma hierarquia de importância entre as
            marcas. Cada empresa entra no momento em que sua especialidade é mais relevante.
          </p>
          <p className="journey-intro journey-intro--last">
            O ciclo começa antes do vencimento, com comunicação preventiva que reduz o volume de inadimplência antes que ela aconteça.
            Quando o vencimento passa sem pagamento, entra a operação de cobrança. Se o devedor está acessível mas precisa de condições
            para negociar, o canal digital oferece autonomia. Nos casos que exigem rigor legal, o suporte jurídico encerra o ciclo com
            estratégia e fundamento.
          </p>
        </AnimatedSection>

        <div className="journey-timeline">
          <div className="journey-line" aria-hidden />
          <div className="journey-step-list">
            {steps.map((step, i) => (
              <AnimatedSection key={step.num} delay={i * 0.12} direction="left">
                <motion.div
                  whileHover={{ x: 8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className={`journey-step ${step.toneClass}`}
                >
                  <div className="journey-dot" aria-hidden />
                  <article className="journey-card">
                    <div className="journey-head">
                      <span className="journey-num">{step.num}</span>
                      <span className="journey-tag">{step.tag}</span>
                      <span className="journey-company">
                        <Image
                          src={step.companyLogoSrc}
                          alt={step.companyLogoAlt}
                          width={step.companyLogoWidth}
                          height={step.companyLogoHeight}
                          className={`journey-company-logo${step.num === "03" ? " journey-company-logo--acordo" : ""}`}
                        />
                      </span>
                    </div>

                    <h3 className="journey-step-title">
                      <step.icon className="journey-icon" />
                      {step.title}
                    </h3>

                    <p className="journey-description">{step.description}</p>

                    <a href={step.url} target="_blank" rel="noopener noreferrer" className="journey-link">
                      {step.urlLabel}
                      <ExternalLink className="journey-link-icon" />
                    </a>
                  </article>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
