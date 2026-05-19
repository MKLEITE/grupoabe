"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import CompaniesSection from "@/components/CompaniesSection";
import ContactSection from "@/components/ContactSection";
import FooterSection from "@/components/FooterSection";
import JourneySection from "@/components/JourneySection";

function IconExternal({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  );
}

export function GrupoAbeSite() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  const toggleTheme = useCallback(() => {
    const html = document.documentElement;
    const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    const root = rootRef.current;
    if (!root) return;

    root.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="grupoAbeSiteRoot">
      <nav id="nav" className={navScrolled ? "scrolled" : undefined}>
        <a href="#inicio" className="nav-logo-link nav-logo" onClick={() => setMenuOpen(false)}>
          <span className="nav-logo-word">Grupo</span>
          <Image
            src="/logos/abe.png"
            alt="ABE"
            width={140}
            height={56}
            className="nav-logo-img"
            priority
          />
        </a>
        <ul className={`nav-links ${menuOpen ? "is-open" : ""}`}>
          <li>
            <a href="#inicio" onClick={() => setMenuOpen(false)}>
              Início
            </a>
          </li>
          <li>
            <a href="#jornada" onClick={() => setMenuOpen(false)}>
              Jornada
            </a>
          </li>
          <li>
            <a href="#empresas" onClick={() => setMenuOpen(false)}>
              Empresas
            </a>
          </li>
          <li>
            <a href="#inteligencia" onClick={() => setMenuOpen(false)}>
              Inteligência
            </a>
          </li>
          <li>
            <a href="#contato" onClick={() => setMenuOpen(false)}>
              Contato
            </a>
          </li>
        </ul>
        <div className="nav-actions">
          <button type="button" className="theme-toggle" id="themeToggle" aria-label="Alternar tema claro/escuro" onClick={toggleTheme} />
          <button
            type="button"
            className="nav-menu-btn"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            ☰
          </button>
        </div>
      </nav>

      <section id="inicio">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-eyebrow">Grupo ABE · Ecossistema de crédito corporativo</div>
        <h1>
          Do <em>vencimento</em> à blindagem <em>jurídica.</em>
        </h1>
        <p className="hero-sub">
          Um propósito, quatro especialistas. Tecnologia e dados onde aceleram. Equipes próximas ao negócio onde a decisão exige
          julgamento.
        </p>
        <div className="hero-chips">
          <div className="chip">
            <strong>Preventivo</strong> · AvantPay
          </div>
          <div className="chip">
            <strong>Operação</strong> · ABE
          </div>
          <div className="chip">
            <strong>Digital</strong> · Acordo Seguro
          </div>
          <div className="chip">
            <strong>Jurídico</strong> · Grejo
          </div>
        </div>
        <div className="hero-ctas">
          <a href="#jornada" className="btn-primary">
            <span>Ver a jornada do crédito</span>
          </a>
          <a href="#empresas" className="btn-ghost">
            Conhecer cada empresa
          </a>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-line" />
          <span className="scroll-text">Scroll</span>
        </div>
      </section>

      <JourneySection />

      <CompaniesSection />

      <section id="inteligencia">
        <div className="container">
          <div className="intel-layout">
            <div className="intel-text">
              <div className="section-eyebrow reveal">Dados + automação + humano</div>
              <h2 className="reveal">
                Tecnologia como <em>suporte,</em> não substituição
              </h2>
              <div className="intel-tag reveal">Processo · Não promessa</div>
              <p className="reveal">
                Analytics e automação entram onde o volume e a velocidade exigem — triagem comportamental, sugestão de canal, geração de relatórios, marcação de exceções. A decisão sobre como abordar, negociar ou acionar juridicamente segue sendo humana.
              </p>
              <p className="reveal">
                O grupo opera com minimização de dados, segurança da informação e alinhamento às exigências da LGPD. Auditorias, controles de acesso e documentação de processos fazem parte do modelo operacional — não do marketing.
              </p>
              <div className="commitments reveal">
                <div className="commitment">
                  <h4>
                    <span className="commitment-num">01</span> Previsibilidade operacional
                  </h4>
                  <p>Comportamento da carteira registrado antes que o problema escale. Credores têm visibilidade de risco antes de registrar perdas graves.</p>
                </div>
                <div className="commitment">
                  <h4>
                    <span className="commitment-num">02</span> Presença humana onde diferencia
                  </h4>
                  <p>Negociação consultiva onde o caso exige. Automação elimina o trabalho repetitivo — não o julgamento especializado.</p>
                </div>
                <div className="commitment">
                  <h4>
                    <span className="commitment-num">03</span> Continuidade entre etapas
                  </h4>
                  <p>Dados operacionais e jurídicos alinhados. A transição entre etapas acontece com histórico completo, sem retrabalho.</p>
                </div>
              </div>
            </div>
            <div className="intel-visual reveal">
              <div className="data-panel">
                <div className="panel-header">
                  <div className="panel-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="panel-title">Visão de carteira · Grupo ABE</div>
                </div>
                <div className="panel-body">
                  <div className="metric-row">
                    <div className="metric-label">Pré-cobrança ativa</div>
                    <div className="metric-bar">
                      <div className="metric-fill" style={{ "--pct": "78%" } as React.CSSProperties} />
                    </div>
                    <div className="metric-val">78%</div>
                  </div>
                  <div className="metric-row">
                    <div className="metric-label">Recuperação operacional</div>
                    <div className="metric-bar">
                      <div className="metric-fill" style={{ "--pct": "64%" } as React.CSSProperties} />
                    </div>
                    <div className="metric-val">64%</div>
                  </div>
                  <div className="metric-row">
                    <div className="metric-label">Negociação digital</div>
                    <div className="metric-bar">
                      <div className="metric-fill" style={{ "--pct": "51%" } as React.CSSProperties} />
                    </div>
                    <div className="metric-val">51%</div>
                  </div>
                  <div className="metric-row">
                    <div className="metric-label">Acionamento jurídico</div>
                    <div className="metric-bar">
                      <div className="metric-fill" style={{ "--pct": "23%" } as React.CSSProperties} />
                    </div>
                    <div className="metric-val">23%</div>
                  </div>
                  <div className="metric-row">
                    <div className="metric-label">Conformidade LGPD</div>
                    <div className="metric-bar">
                      <div className="metric-fill" style={{ "--pct": "100%" } as React.CSSProperties} />
                    </div>
                    <div className="metric-val">100%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="credibilidade">
        <div className="container">
          <div className="cred-inner">
            <div className="section-eyebrow reveal" style={{ justifyContent: "center" }}>
              Continuidade · Não silos
            </div>
            <h2 className="reveal">
              Crédito corporativo pede <em>consistência</em> em cada etapa
            </h2>
            <div className="cred-divider reveal" />
            <p className="reveal">
              Quando pré-cobrança, operação, negociação digital e jurídico não compartilham o mesmo raciocínio sobre a carteira, o resultado é atrito — retrabalho, abordagens inconsistentes, desgaste de reputação do credor. O custo operacional sobe e a taxa de recuperação cai.
            </p>
            <p className="reveal">
              Cada marca tem site, contato e equipe próprios. O site do grupo existe para explicar a lógica do conjunto antes das conversas técnicas e contratuais com cada empresa individualmente.
            </p>
          </div>
        </div>
      </section>

      <ContactSection />

      <FooterSection />
    </div>
  );
}
