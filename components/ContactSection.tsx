"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ExternalLink, Globe, Radio, Scale, Shield } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

type ContactItem = {
  icon: LucideIcon;
  name: string;
  desc: string;
  url: string;
  toneClass: string;
};

const contacts: ContactItem[] = [
  {
    icon: Shield,
    name: "ABE",
    desc: "Para carteiras em cobrança e operação nacional",
    url: "https://abe.com.br/",
    toneClass: "is-blue",
  },
  {
    icon: Radio,
    name: "AvantPay",
    desc: "Para pré-cobrança e comunicação preventiva",
    url: "https://avantpay.com.br/",
    toneClass: "is-emerald",
  },
  {
    icon: Scale,
    name: "Grejo Advogados",
    desc: "Para suporte jurídico e contencioso",
    url: "https://grejoadvogados.com.br/",
    toneClass: "is-amber",
  },
  {
    icon: Globe,
    name: "Acordo Seguro",
    desc: "Para negociação digital e portal de autoatendimento",
    url: "https://www.acordoseguro.com.br/",
    toneClass: "is-violet",
  },
];

export default function ContactSection() {
  return (
    <section id="contato" className="contact-v2-section">
      <div className="contact-v2-glow" aria-hidden />

      <div className="container contact-v2-container">
        <AnimatedSection>
          <p className="contact-v2-eyebrow">Fale com a empresa certa para o seu momento.</p>
          <h2 className="contact-v2-title">Cada cenário tem uma porta de entrada</h2>
          <p className="contact-v2-intro">
            O Grupo ABE não tem um ponto único de contato comercial — cada empresa atende seu próprio mercado e tem canais diretos. Os
            links abaixo direcionam para os sites oficiais de cada marca.
          </p>
        </AnimatedSection>

        <div className="contact-v2-grid">
          {contacts.map((contact, index) => (
            <AnimatedSection key={contact.name} delay={index * 0.08}>
              <motion.a
                href={contact.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`contact-v2-card ${contact.toneClass}`}
              >
                <div className="contact-v2-iconWrap">
                  <contact.icon className="contact-v2-icon" />
                </div>
                <div className="contact-v2-cardText">
                  <p className="contact-v2-name">{contact.name}</p>
                  <p className="contact-v2-desc">{contact.desc}</p>
                </div>
                <ExternalLink className="contact-v2-linkIcon" />
              </motion.a>
            </AnimatedSection>
          ))}
        </div>

      </div>
    </section>
  );
}
