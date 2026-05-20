"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, ExternalLink, Globe, Radio, Scale, Shield } from "lucide-react";
import { useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import CompanyModal from "@/components/CompanyModal";

export type CompanyCard = {
  step: string;
  tag: string;
  name: string;
  logoSrc: string;
  logoAlt: string;
  logoWidth: number;
  logoHeight: number;
  modalLogoWidth: number;
  modalLogoHeight: number;
  icon: LucideIcon;
  headline: string;
  description: string;
  differentials: string[];
  url: string;
  urlLabel: string;
  toneClass: string;
  iconClass: string;
};

const companies: CompanyCard[] = [
  {
    step: "01",
    tag: "Operação",
    name: "ABE",
    logoSrc: "/logos/abe.png",
    logoAlt: "ABE",
    logoWidth: 76,
    logoHeight: 24,
    modalLogoWidth: 120,
    modalLogoHeight: 38,
    icon: Shield,
    headline: "Operação nacional de cobrança com método e governança",
    description:
      "ABE é a operação de cobrança do grupo — presença em todo o Brasil, equipes especializadas por segmento e processos auditáveis. Atua em carteiras de pessoas físicas e jurídicas com abordagem consultiva e respeito à política de cada credor. A gestão da carteira irregular começa com diagnóstico e segue com execução estruturada.",
    differentials: [
      "Cobertura nacional com equipes regionais",
      "Segmentação de carteira por perfil de devedor",
      "Processos auditáveis e relatórios de performance",
      "Integração operacional com as demais empresas do grupo",
    ],
    url: "https://abe.com.br/",
    urlLabel: "abe.com.br",
    toneClass: "is-blue",
    iconClass: "is-blue",
  },
  {
    step: "02",
    tag: "Preventivo",
    name: "AvantPay",
    logoSrc: "/logos/avantpay.png",
    logoAlt: "AvantPay",
    logoWidth: 92,
    logoHeight: 24,
    modalLogoWidth: 136,
    modalLogoHeight: 36,
    icon: Radio,
    headline: "Pré-cobrança inteligente antes do vencimento",
    description:
      "AvantPay atua na etapa mais negligenciada do ciclo de crédito: o momento antes do vencimento. Com tecnologia de comunicação e análise comportamental, identifica o momento e o canal certo para cada devedor B2B — reduzindo inadimplência antes que ela aconteça. A plataforma opera dentro das políticas do credor, com foco em preservação do relacionamento comercial.",
    differentials: [
      "Comunicação multicanal com timing baseado em dados",
      "Segmentação comportamental de carteira ativa",
      "Operação sem contato agressivo — modelo preventivo",
      "Painéis de monitoramento para a equipe do credor",
    ],
    url: "https://avantpay.com.br/",
    urlLabel: "avantpay.com.br",
    toneClass: "is-emerald",
    iconClass: "is-emerald",
  },
  {
    step: "03",
    tag: "Jurídico",
    name: "Grejo Sociedade de Advogados",
    logoSrc: "/logos/grejo.png",
    logoAlt: "Grejo Advogados",
    logoWidth: 118,
    logoHeight: 24,
    modalLogoWidth: 172,
    modalLogoHeight: 36,
    icon: Scale,
    headline: "Direito empresarial e recuperação de crédito com estratégia",
    description:
      "O Grejo Advogados atua em direito empresarial com foco em recuperação de crédito, contencioso e reestruturação. A equipe jurídica trabalha alinhada à operação de cobrança do grupo — com acesso ao histórico do crédito e continuidade processual entre as etapas. Peças fundamentadas, prazos controlados e comunicação direta com o cliente.",
    differentials: [
      "Especialização em crédito, contencioso e direito empresarial",
      "Atuação integrada com a operação de cobrança",
      "Controle de prazos processuais com transparência",
      "Relatórios jurídicos periódicos para credores corporativos",
    ],
    url: "https://grejoadvogados.com.br/",
    urlLabel: "grejoadvogados.com.br",
    toneClass: "is-amber",
    iconClass: "is-amber",
  },
  {
    step: "04",
    tag: "Digital",
    name: "Acordo Seguro",
    logoSrc: "/logos/acordo-seguro.png",
    logoAlt: "Acordo Seguro",
    logoWidth: 128,
    logoHeight: 28,
    modalLogoWidth: 188,
    modalLogoHeight: 40,
    icon: Globe,
    headline: "Portal de negociação digital para credores e devedores",
    description:
      "Acordo Seguro é o canal de negociação digital do grupo — uma plataforma onde o devedor acessa suas dívidas, visualiza condições disponíveis e formaliza acordos de forma autônoma. Operação 100% digital, dentro da política da credora, com conformidade e rastreabilidade em cada etapa. Reduz o custo operacional de negociação sem sacrificar controle.",
    differentials: [
      "Negociação autônoma 24h sem necessidade de operador",
      "Configuração por carteira conforme política da credora",
      "Conformidade com LGPD e requisitos de auditoria",
      "Integração com sistemas de gestão do credor",
    ],
    url: "https://www.acordoseguro.com.br/",
    urlLabel: "acordoseguro.com.br",
    toneClass: "is-violet",
    iconClass: "is-violet",
  },
];

export default function CompaniesSection() {
  const [selectedCompany, setSelectedCompany] = useState<CompanyCard | null>(null);

  return (
    <section id="empresas" className="companies-section">
      <div className="container companies-container">
        <AnimatedSection>
          <p className="companies-eyebrow">As Empresas</p>
          <h2 className="companies-title">Quatro marcas, um propósito</h2>
          <p className="companies-intro">
            Cada empresa do Grupo ABE tem site próprio, equipe própria e especialização distinta. Para detalhes completos sobre cada
            empresa, os links direcionam para os domínios oficiais.
          </p>
        </AnimatedSection>

        <div className="companies-grid">
          {companies.map((company, index) => (
            <AnimatedSection key={company.name} delay={index * 0.1}>
              <motion.article
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`company-card ${company.toneClass}`}
                onClick={() => setSelectedCompany(company)}
              >
                <div className="company-card-topline" />

                <div className="company-card-body">
                  <div className="company-card-head">
                    <div className="company-card-id">
                      <div className="company-card-iconWrap">
                        <company.icon className={`company-card-icon ${company.iconClass}`} />
                      </div>
                      <div>
                        <h3 className="company-card-name">
                          <Image
                            src={company.logoSrc}
                            alt={company.logoAlt}
                            width={company.logoWidth}
                            height={company.logoHeight}
                            className="company-card-logo"
                          />
                        </h3>
                      </div>
                    </div>
                    <motion.div className="company-card-arrowWrap" whileHover={{ scale: 1.1 }}>
                      <ArrowRight size={14} />
                    </motion.div>
                  </div>

                  <p className="company-card-headline">{company.headline}</p>
                  <p className="company-card-description">{company.description}</p>

                  <div className="company-card-footer">
                    <div className="company-card-chips">
                      {company.differentials.slice(0, 2).map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                      {company.differentials.length > 2 && <span>+{company.differentials.length - 2}</span>}
                    </div>
                    <a
                      href={company.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(event) => event.stopPropagation()}
                      className="company-card-link"
                      aria-label={`Acessar ${company.urlLabel} (abre em nova aba)`}
                    >
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              </motion.article>
            </AnimatedSection>
          ))}
        </div>
      </div>

      <CompanyModal open={Boolean(selectedCompany)} onOpenChange={(open) => !open && setSelectedCompany(null)} company={selectedCompany} />
    </section>
  );
}
