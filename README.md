# ABE — Site institucional (Next.js)

Site institucional da **ABE Assessoria e Recuperação de Créditos Financeiros** (stack Next.js). O projeto comporta uma **nova Home** (`/`) e mantém uma **apresentação completa** numa segunda rota oculta (apenas um caminho específico, sem ser o destaque do site público).

| Rota | O que é |
|------|---------|
| **`/`** | **Home Grupo ABE** — ecossistema institucional (jornada, IA, empresas, links externos abe.com.br, avantpay.com.br, grejoadvogados.com.br, acordoseguro.com.br). |
| **`/abe-apresentacao-8fqm3xk2`** | Deck/apresentação completa herdada deste projeto (secções antigas, modais, mapa). O segmento **`8fqm3xk2`** é o “código” no URL para não aparecer óbvio. Metadatos com **`noindex`** para reduzir indexação casual; o caminho só funciona quando é escrito/aberto esse URL exato. |

O valor do segmento também está definido em `lib/presentacao-route.ts` (para referência de cópias / migrações, sem aparecer obrigatoriamente na UI).

---

## Stack técnica

| Tecnologia | Versão (referência) |
|------------|---------------------|
| [Next.js](https://nextjs.org/) (App Router) | 14.2.x |
| React | 18.3.x |
| TypeScript | 5.6.x |
| CSS global | `app/globals.css` (tema e UI na apresentação). Home pública: `app/grupo-abe-site.css` + `components/GrupoAbeSite.tsx`. |

Outras dependências relevantes:

- `@svg-country-maps/brazil` — SVG do mapa do Brasil (secção “Presença operacional por estado”).

---

## Requisitos

- **Node.js** 18 ou superior (recomendado: LTS atual)
- **npm** (vem com Node)

---

## Instalação e comandos

Na raiz do projeto:

```bash
npm install
```

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento em [http://localhost:3000](http://localhost:3000) |
| `npm run build` | Gera build de produção (`.next/`) |
| `npm run start` | Serve o build de produção (após `build`) |
| `npm run lint` | Executa o ESLint do Next.js |

---

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `NEXT_PUBLIC_ABE_ONLINE_IFRAME_URL` | Não | URL do embed da plataforma **ABE Online** (ex.: Power BI). Se não definida, usa o URL por defeito na secção correspondente dentro de `app/abe-apresentacao-8fqm3xk2/page.tsx`. |

Crie um ficheiro `.env.local` na raiz (não é commitado; está no `.gitignore`):

```env
NEXT_PUBLIC_ABE_ONLINE_IFRAME_URL=https://seu-painel/embed
```

---

## Estrutura do repositório

```
abe-next-final/
├── app/
│   ├── layout.tsx      # Layout raiz, metadata, script de tema (localStorage)
│   ├── grupo-abe-site.css  # Estilos da Home pública (animações, modais, tipografia Google)
│   ├── page.tsx            # Home (`/`) — Grupo ABE
│   ├── abe-apresentacao-8fqm3xk2/
│   │   ├── layout.tsx  # Metadata da rota interna (`noindex`)
│   │   └── page.tsx    # Apresentação completa (deck)
│   └── globals.css     # Estilos globais (temas, componentes UI compartilhados)
├── lib/
│   └── presentacao-route.ts  # Token do path `/abe-apresentacao-…` (referência)
├── components/
│   ├── GrupoAbeSite.tsx          # Home pública única (hero, jornada, empresas, modais)
│   ├── HomeGrupoHeader.tsx       # (legado) — não usado na Home actual
│   ├── HomeGrupoBody.tsx         # (legado) — não usado na Home actual
│   ├── ThemeToggle.tsx           # Alternância claro/escuro
│   ├── BrazilMapInteractive.tsx  # Mapa BR interativo + barra de UFs
│   ├── ChannelIcons.tsx          # Ícones dos canais de cobrança
│   └── StructureIcons.tsx        # Ícones da estrutura organizacional
├── public/
│   ├── logos/          # Logos ABE, parceiros (AvantPay, Grejo, Acordo Seguro)
│   └── images/         # Hero, estrutura, clientes, presencial, etc.
├── next.config.mjs     # Imagens em modo unoptimized (export-friendly)
├── package.json
├── tsconfig.json
└── README.md
```

---

## Funcionalidades principais

- **Navegação fixa** com destaque da secção ativa e **barra de progresso de scroll** no topo.
- **Temas**: `data-theme="dark" | "light"` no `<html>`, persistido em `localStorage` (`theme`).
- **Secções** (na rota interna **`/abe-apresentacao-8fqm3xk2`**): Ecossistema, Cobrança presencial, ABE Online, Clientes, Diferenciais, Contratos, etc., com navegação por âncoras.
- **Meios de cobrança**: grelha de canais; ao clicar abre **modal** com KPIs, gráfico de barras por segmento e texto de leitura (dados ilustrativos).
- **Mapa do Brasil**: componente dedicado com estados clicáveis / realce.
- **Clientes** (apresentação interna): grelha de logos (`public/images/clientes/cliente-01.png` … `cliente-49.png`). Constantes em `app/abe-apresentacao-8fqm3xk2/page.tsx`: `CLIENT_LOGO_START`, `CLIENT_LOGO_COUNT`.
- **Contratos**: dois modelos (Success Fee e Honorário Zero) em cartões comparativos.

---

## Imagens e assets

- Logos institucionais: `public/logos/`.
- Logos de clientes na grelha: `public/images/clientes/` (`cliente-01.png` … `cliente-49.png`).
- `next.config.mjs` define `images.unoptimized: true` — adequado a hospedagens estáticas ou quando não se usa o otimizador de imagens do Next.

---

## Build de produção

```bash
npm run build
npm run start
```

Para **Vercel**, **Netlify** ou outro host compatível com Next.js: ligue o repositório Git, defina `NEXT_PUBLIC_ABE_ONLINE_IFRAME_URL` nas variáveis de ambiente do painel se necessário, e use o comando de build padrão (`next build`).

---

## Licença e propriedade

Conteúdo e marca **ABE** são propriedade da organização. Este repositório destina-se ao site institucional do grupo.

---

## Autor / manutenção

**Meykson Leite** — [meyksonleite@gmail.com](mailto:meyksonleite@gmail.com)

Repositório: [github.com/MKLEITE/grupoabe](https://github.com/MKLEITE/grupoabe)
