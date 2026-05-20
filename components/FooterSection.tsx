"use client";

import { ExternalLink } from "lucide-react";
import Image from "next/image";

const companies = [
  { name: "ABE", url: "https://abe.com.br/" },
  { name: "AvantPay", url: "https://avantpay.com.br/" },
  { name: "Grejo Advogados", url: "https://grejoadvogados.com.br/" },
  { name: "Acordo Seguro", url: "https://www.acordoseguro.com.br/" },
];

const navigation = [
  { label: "Início", href: "#inicio" },
  { label: "Jornada", href: "#jornada" },
  { label: "Empresas", href: "#empresas" },
  { label: "Inteligência", href: "#inteligencia" },
  { label: "Contato", href: "#contato" },
];

export default function FooterSection() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-v2">
      <div className="footer-v2-inner">
        <div className="footer-v2-top">
          <div className="footer-v2-brand">
            <div className="footer-v2-brand-head">
              <p className="footer-v2-brand-title">Grupo</p>
              <Image src="/logos/ponteiro-mouse/ABE.svg" alt="ABE" width={120} height={40} className="footer-v2-brand-logo" />
            </div>
            <p className="footer-v2-brand-text">
              O Grupo ABE é formado por quatro empresas independentes — ABE, AvantPay, Grejo Sociedade de Advogados e Acordo Seguro —
              cada uma com CNPJ, domínio e operação próprios.
            </p>
          </div>

          <div>
            <p className="footer-v2-col-title">Empresas do grupo</p>
            <div className="footer-v2-company-grid">
              {companies.map((company) => (
                <a key={company.name} href={company.url} target="_blank" rel="noopener noreferrer" className="footer-v2-link footer-v2-link--external">
                  {company.name}
                  <ExternalLink className="footer-v2-link-icon" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="footer-v2-col-title">Navegação</p>
            <div className="footer-v2-nav">
              {navigation.map((item) => (
                <a key={item.label} href={item.href} className="footer-v2-link">
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-v2-bottom">
          <p>© {year} Grupo ABE. Todos os direitos reservados.</p>
          <p>Ecossistema de prevenção e recuperação de crédito corporativo</p>
        </div>
      </div>
    </footer>
  );
}
