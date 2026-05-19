import Image from "next/image";
import Link from "next/link";

type CompanyCard = {
  id: string;
  name: string;
  logo: string;
  logoAlt: string;
  headline: string;
  body: string;
  bullets: string[];
  url: string;
  urlDisplay: string;
  slotHint: string;
  reverse: boolean;
};

const EXTERNAL_LABEL = "Visitar site institucional (abre em nova aba)";

const journeySteps = [
  {
    kicker: "01 — Preventivo",
    title: "Antecipar o vencimento",
    brand: "AvantPay",
    brandUrl: "https://avantpay.com.br/",
    text:
      "Antes mesmo do título vencer, a comunicação ganha cadência inteligente: lembretes no canal certo e no momento certo — para recuperar comportamento sem acumular atrito nem ruídos no relacionamento B2B.",
  },
  {
    kicker: "02 — Operação",
    title: "Entrar quando há incumprimento",
    brand: "ABE",
    brandUrl: "https://abe.com.br/",
    text:
      "Se o cenário mudou e o crédito ficou irregular, uma operação nacional e madura organiza os próximos passos: método, governança e especialistas a tratar da carteira com respeito à reputação junto aos clientes.",
  },
  {
    kicker: "03 — Experiência digital",
    title: "Negociar sem fricção desnecessária",
    brand: "Acordo Seguro",
    brandUrl: "https://www.acordoseguro.com.br/",
    text:
      "Um canal de negociação desenhado para dar autonomia e clareza: consulta rápida, condições alinhadas à política da credora e trilhos de conformidade para quem precisa pagar ou parcelar.",
  },
  {
    kicker: "04 — Blindagem jurídica",
    title: "Estratégia quando o caso exige rigor jurídico",
    brand: "Grejo Advogados",
    brandUrl: "https://grejoadvogados.com.br/",
    text:
      "Escritório especializado que reforça a frente jurídica com profundidade em direito empresarial e recuperação de crédito: segurança de peças e posicionamento alinhado à lei.",
  },
];

const companiesPresentationOrder: CompanyCard[] = [
  {
    id: "abe",
    name: "ABE",
    logo: "/logos/abe.png",
    logoAlt: "Logo ABE — Assessoria e Recuperação de Créditos",
    headline: "O coração operacional: cobrança B2B com presença nacional e método consistente.",
    body:
      "A ABE combina tradição (desde 1979), presencialidade onde faz diferença e leitura executiva sobre a carteira. Integra tecnologia, negociação multicanal e equipas próximas do negócio — para recuperar resultado sem desistir do tom de marca que exige relacionamento corporativo forte.",
    bullets: [
      "Fluxo definido assim que há inadimplemento",
      "Cobrança nacional e equipas próximas do terreno onde importa",
      "Foco B2B: complexidade valor e governança de carteira",
      "Indicadores e painéis que antecipam decisões estratégicas",
    ],
    url: "https://abe.com.br/",
    urlDisplay: "abe.com.br",
    slotHint: "Operação nacional / relacionamento estratégico",
    reverse: false,
  },
  {
    id: "avantpay",
    name: "AvantPay",
    logo: "/logos/avantpay.png",
    logoAlt: "Logo AvantPay",
    headline: "A pré-cobrança inteligente: agir antes do atraso, com reguas sob medida.",
    body:
      "AvantPay existe para reduzir inadimplemento na origem: lembretes e jornadas multicanal automatizadas, inteligência preditiva e painéis que traduzem envios e comportamento em decisão de tesouraria e crédito — sem inflar custo nem despersonalizar relacionamento já contratado com o seu cliente.",
    bullets: [
      "Lembrete preventivo (e-mail, SMS, WhatsApp, conforme regras e conformidade)",
      "Regras, jornadas e visão operacional unificadas no painel",
      "Tratamento de dados e boas práticas alinhados à LGPD",
    ],
    url: "https://avantpay.com.br/",
    urlDisplay: "avantpay.com.br",
    slotHint: "Painel pré-cobrança / jornadas multicanal",
    reverse: true,
  },
  {
    id: "grejo",
    name: "Grejo Sociedade de Advogados",
    logo: "/logos/grejo.png",
    logoAlt: "Logo Grejo Advogados",
    headline: "Apoio jurídico sólido quando a estratégia exige segurança de peça e conformidade.",
    body:
      "Com sede em São Paulo (SP), a Grejo associa reputação institucional e mediação onde é produtivo, além das medidas jurídicas quando o perfil do caso assim o exige — com comunicação alinhada à realidade regulatória e ao risco reputacional corporativo.",
    bullets: [
      "Direito empresarial e recuperação com profundidade de equipe dedicada",
      "Compromisso com ética transparência e alinhamento legal (LGPD e demais legislações aplicáveis)",
      "Atuação que conversa com a operação e com o ciclo econômico já em curso",
    ],
    url: "https://grejoadvogados.com.br/",
    urlDisplay: "grejoadvogados.com.br",
    slotHint: "Expertise jurídica / ambiente de estratégia legal",
    reverse: false,
  },
  {
    id: "acordo",
    name: "Acordo Seguro",
    logo: "/logos/acordo-seguro.png",
    logoAlt: "Logo Acordo Seguro",
    headline: "Negociação 100% digital para quitar com rastreio e segurança de credoras exigentes.",
    body:
      "Plataforma desenhada para o devedor concluir a jornada com autonomia (consulta rápida, condições dentro da política da credora, liquidações com métodos ágeis) enquanto a credora acompanha dashboards e trilhos de negócio sem perder controlo nem rastreabilidade.",
    bullets: [
      "Portal digital self-service e disparos automatizados alinhados à política de crédito",
      "Gestão transparente das interações para o credor acompanhar em tempo útil",
      "Integração opcional via API ao ecossistema de cobrança e ERP quando necessário",
    ],
    url: "https://www.acordoseguro.com.br/",
    urlDisplay: "acordoseguro.com.br",
    slotHint: "Portal de negociação / onboarding de devedores",
    reverse: true,
  },
];

function ImageSlot({
  caption,
  note,
  aspect = "16x10",
}: {
  caption: string;
  note: string;
  aspect?: "16x10" | "4x5";
}) {
  return (
    <figure
      className={`grupoInst__imgSlot grupoInst__imgSlot--${aspect}`}
      data-slot={note}
      aria-label={`Reserva para imagem: ${note}`}
    >
      <span className="grupoInst__imgSlotBadge" aria-hidden>
        Visual
      </span>
      <div className="grupoInst__imgSlotInner" aria-hidden>
        <span className="grupoInst__imgSlotGlow" />
      </div>
      <figcaption className="grupoInst__imgSlotCaption">{caption}</figcaption>
    </figure>
  );
}

export function HomeGrupoBody() {
  return (
    <>
      <section id="hero" className="grupoInst__hero grupoInstSection" aria-labelledby="grupo-inst-hero-title">
        <div className="container grupoInst__heroGrid">
          <div className="grupoInst__heroCopy">
            <p className="heroBadge grupoInst__heroBadge">Grupo ABE · ecossistema de crédito</p>
            <h1 id="grupo-inst-hero-title" className="grupoInst__heroTitle">
              Da previsibilidade antes do vencimento à blindagem jurídica quando o caso pede maior rigor.
            </h1>
            <p className="grupoInst__heroLead">
              Um mesmo propósito, quatro especialistas sob marcas diferentes: tecnologia de dados,
              automatização onde faz sentido e equipas próximas do negócio — da pré-cobrança à operação
              nacional, passando pela negociação digital até ao apoio jurídico quando o cenário assim o
              pede — com tonalidade institucional e continuidade de processos.
            </p>
            <div className="grupoInst__heroChips" role="list">
              <span className="grupoInst__chip" role="listitem">
                Preventivo · AvantPay
              </span>
              <span className="grupoInst__chip" role="listitem">
                Operação · ABE
              </span>
              <span className="grupoInst__chip" role="listitem">
                Digital · Acordo Seguro
              </span>
              <span className="grupoInst__chip" role="listitem">
                Jurídico · Grejo
              </span>
            </div>
            <div className="grupoInst__heroCtas">
              <a href="#jornada" className="buttonPrimary grupoInst__ctaPrimary">
                Ver jornada do crédito
              </a>
              <a href="#grupo" className="buttonSecondary grupoInst__ctaSecondary">
                Conhecer cada empresa
              </a>
            </div>
          </div>
          <div className="grupoInst__heroVisual">
            <ImageSlot caption="À substituir: imagem do ecossistema ou infográfico" note="Hero Grupo · imagem alta resolução" aspect="16x10" />
          </div>
        </div>
      </section>

      <section id="jornada" className="grupoInstSection grupoInstSection--dark grupoInstSection--journey" aria-labelledby="grupo-journey-title">
        <div className="container">
          <div className="grupoInstSection__head grupoInstReveal">
            <p className="grupoInst__eyebrow">Linha mestra — ordem como o ciclo econômico acontece</p>
            <h2 id="grupo-journey-title">Cada empresa entra quando o papel dela faz diferença</h2>
            <p className="grupoInstSection__lede grupoInstReveal">
              Primeiro, a tecnologia próxima do devedor (AvantPay) reduz atrito antes da data. Se houver incumprimento,
              o fluxo operacional da ABE organiza o tratamento em escala nacional. No mesmo ciclo entra o Acordo Seguro quando
              a experiência digital rastreada entrega melhor equilíbrio entre custo e resultado. Quando o cenário exige mais rigor jurídico, a Grejo reforça a estratégia legal.
            </p>
          </div>

          <div className="grupoInst__journeyIntro grupoInstReveal">
            <ImageSlot caption="À substituir: diagrama da jornada" note="Infográfico export horizontal" aspect="16x10" />
          </div>

          <ol className="grupoInst__journeyRail" aria-label="Etapas do ecossistema em ordem">
            {journeySteps.map((step) => (
              <li key={step.kicker} className="grupoInst__journeyStep grupoInstReveal">
                <span className="grupoInst__journeyOrb" aria-hidden />
                <p className="grupoInst__journeyKicker">{step.kicker}</p>
                <h3 className="grupoInst__journeyStepTitle">{step.title}</h3>
                <p className="grupoInst__journeyBrand">
                  via{" "}
                  <a href={step.brandUrl} target="_blank" rel="noopener noreferrer" className="grupoInst__inlineLink">
                    {step.brand}
                  </a>
                </p>
                <p className="grupoInst__journeyCopy">{step.text}</p>
                <a
                  className="grupoInst__journeyMiniCta"
                  href={step.brandUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${EXTERNAL_LABEL} · ${step.brand}`}
                >
                  Website {step.brand}
                  <span className="grupoInst__ctaArrow" aria-hidden>
                    {" "}
                    →
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="inteligencia" className="grupoInstSection grupoInstSection--ia" aria-labelledby="grupo-ia-title">
        <div className="container grupoInst__iaGrid">
          <div className="grupoInst__iaCopy grupoInstReveal">
            <p className="grupoInst__eyebrow">Inteligência de dados · automação onde acelera</p>
            <h2 id="grupo-ia-title">Assistência automatizada onde acelera, sensibilidade humana onde marca se define</h2>
            <p>
              Modelos matemáticos e camadas modernas entram onde aceleram trabalho já existente: triagem
              comportamental, sugestões de momento e canal para envio de mensagens, resumos sobre grandes volumes transacionais
              e marcação rápida de exceções. O controlo estratégico continua sempre com especialistas quando o momento da
              negociação ou o risco jurídico o exige.
            </p>
            <p>
              Trabalhamos com minimização dados e boas práticas de segurança da informação alinhadas à LGPD e às próprias
              exigências que credoras enterprise impõem a fornecedores tecnológicos e operacionais.
            </p>
          </div>
          <ImageSlot caption="À substituir: painéis dashboards ou ilustração IA+dados+pessoas" note="Screens ou arte abstratos" aspect="4x5" />
        </div>

        <div className="container grupoInst__iaMetrics grupoInstReveal" aria-label="Compromissos estratégicos">
          <article className="grupoInst__metricCard">
            <h3>Previsibilidade operacional</h3>
            <p>Registrar o comportamento antes de o problema ganhar volume ajuda tesourarias e estruturas de crédito a ler risco antes de perdas mais severas.</p>
          </article>
          <article className="grupoInst__metricCard">
            <h3>A presença humana onde marca se diferencia</h3>
            <p>
              Negociação consultiva ou presencial continua onde o problema exige tonalidade institucional; a automatização apenas elimina trabalho repetitivo que não acrescente valor perceptível ao relacionamento econômico.
            </p>
          </article>
          <article className="grupoInst__metricCard">
            <h3>Compliance jurídico alinhados à operação</h3>
            <p>Há continuidade entre dados operacionais e instrumentos jurídicos — reduz surpresas de última hora e acelera decisões com contexto completo.</p>
          </article>
        </div>
      </section>

      <section id="grupo" className="grupoInstSection grupoInstSection--dark" aria-labelledby="grupo-cards-title">
        <div className="container">
          <div className="grupoInstSection__head grupoInstReveal">
            <p className="grupoInst__eyebrow">Quatro marcas · um mesmo propósito de ecossistema</p>
            <h2 id="grupo-cards-title">Conheça cada empresa pelo site oficial</h2>
            <p className="grupoInstSection__lede">
              Ordem de apresentação: ABE primeiro (operação e história institucional), depois AvantPay, Grejo e Acordo Seguro — sempre com uma ligação explícita para o site oficial de cada marca.
            </p>
          </div>

          <div className="grupoInst__companyList">
            {companiesPresentationOrder.map((company) => (
              <article
                key={company.id}
                className={`grupoInst__companyCard grupoInstReveal ${company.reverse ? "grupoInst__companyCard--reverse" : ""}`}
                aria-labelledby={`company-${company.id}-title`}
              >
                <div className="grupoInst__companyText">
                  <div className="grupoInst__companyLogoWrap">
                    <Image
                      src={company.logo}
                      alt={company.logoAlt}
                      width={340}
                      height={120}
                      className="grupoInst__companyLogo"
                      sizes="(max-width: 900px) 70vw, 320px"
                    />
                  </div>
                  <h3 id={`company-${company.id}-title`} className="grupoInst__companyHeadline">
                    {company.headline}
                  </h3>
                  <p className="grupoInst__companyBody">{company.body}</p>
                  <ul className="grupoInst__bulletList">
                    {company.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                  <a
                    href={company.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="buttonPrimary grupoInst__companyCta"
                    aria-label={`${EXTERNAL_LABEL} · ${company.urlDisplay}`}
                  >
                    Site {company.urlDisplay}
                    <span className="grupoInst__ctaArrow" aria-hidden>
                      {" "}
                      →
                    </span>
                  </a>
                </div>
                <div className="grupoInst__companyAside">
                  <ImageSlot caption={`À substituir · ${company.name}`} note={company.slotHint} aspect="4x5" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grupoInstSection grupoInstSection--cred" aria-labelledby="grupo-cred-title">
        <div className="container grupoInst__credGrid grupoInstReveal">
          <ImageSlot caption="À substituir: ambiente marca equipe institucional ou fotografia sala" note="Credibility · fotografia marca" aspect="16x10" />
          <div className="grupoInst__credCopy">
            <h2 id="grupo-cred-title">Crédito corporativo pede continuidade, não silos</h2>
            <p>
              Quando a pré-cobrança, a operação, a negociação digital e o jurídico não partilham a mesma linha de raciocínio,
              o credor sente incoerência de mensagem, atrito com o devedor e retrabalho interno. O ecossistema nasceu para evitar esse desgaste.
            </p>
            <p>
              Cada marca mantém o seu site e o seu contacto comercial — mas a narrativa do grupo explica como as peças encaixam antes de se avançar para conversas técnicas ou contratuais.
            </p>
          </div>
        </div>
      </section>

      <section id="contato" className="grupoInstSection grupoInstSection--dark grupoInstSection--cta" aria-labelledby="grupo-contato-title">
        <div className="container grupoInst__ctaLayout grupoInstReveal">
          <ImageSlot caption="À substituir: imagem institucional de encerramento" note="Banner CTA marca final" aspect="16x10" />
          <div className="grupoInst__ctaCopy">
            <p className="grupoInst__eyebrow">Escolha a porta correcta porque cada marca responde comercial próprio ritmo próprio método próprio segurança</p>
            <h2 id="grupo-contato-title">Próximo passo: fale com equipa marca melhor cenário problema actual</h2>
            <p>
              Avantpay preventivo apenas abe apenas operação apenas acordo seguro apenas canal digital apenas grejo apenas jurídico — cada link envia sempre site institucional completo porque transparência reforço confiança multi stakeholders internos externos simultaneamente.
            </p>
            <p className="grupoInst__ctaMuted">
              Existe igualmente fluxo técnico apresentação executiva longitudinal extenso (deck completo já construído outro projeto) acessível unicamente mediante URL código exacto porque não faz sentido aparecer lado público entrada larga — apenas quem já conhece propósito dever usar tal rota porque confidencial método processo exemplo execuções finas.
            </p>
            <div className="grupoInst__ctaCluster">
              <Link href="/#hero" className="buttonSecondary">
                Voltar ao topo
              </Link>
              <a href="https://abe.com.br/" className="buttonPrimary grupoInst__ctaExternal" target="_blank" rel="noopener noreferrer" aria-label={`${EXTERNAL_LABEL} · abe.com.br`}>
                Começar em abe.com.br
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="siteFooter grupoInstFooter">
        <div className="container footerWrap footerWrap--home grupoInstFooter__inner reveal">
          <div>
            <Image src="/logos/abe.png" alt="ABE" width={140} height={70} className="footerLogo" />
            <p className="footerTagline grupoInstFooter__tagline">
              Grupo institucional: ABE · AvantPay · Grejo Sociedade de Advogados · Acordo Seguro. Cada marca mantém canal próprio conforme seus domínios oficiais. © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
