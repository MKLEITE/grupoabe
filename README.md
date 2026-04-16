# ABE — Site institucional (Next.js)

Site institucional da **ABE Assessoria e Recuperação de Créditos Financeiros**, com apresentação do ecossistema, meios de cobrança, clientes, diferenciais e modelos contratuais. Interface em **português (pt-BR)** com **tema escuro** por defeito e opção de **modo claro**.

---

## Stack técnica

| Tecnologia | Versão (referência) |
|------------|---------------------|
| [Next.js](https://nextjs.org/) (App Router) | 14.2.x |
| React | 18.3.x |
| TypeScript | 5.6.x |
| CSS global | `app/globals.css` |

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
| `NEXT_PUBLIC_ABE_ONLINE_IFRAME_URL` | Não | URL do embed da plataforma **ABE Online** (ex.: Power BI). Se não definida, usa o URL por defeito definido no código em `app/page.tsx`. |

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
│   ├── page.tsx        # Página única: todas as secções e modais
│   └── globals.css     # Estilos globais, temas, componentes visuais
├── components/
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
- **Secções**: Estrutura, Ecossistema, Meios de cobrança, ABE Online, Clientes, Diferenciais, Contratos.
- **Meios de cobrança**: grelha de canais; ao clicar abre **modal** com KPIs, gráfico de barras por segmento e texto de leitura (dados ilustrativos).
- **Mapa do Brasil**: componente dedicado com estados clicáveis / realce.
- **Clientes**: faixa de logos (`public/images/clientes/cliente-01.png` … `cliente-24.png`); a quantidade é controlada pela constante `CLIENT_LOGO_COUNT` em `app/page.tsx`.
- **Contratos**: dois modelos (Success Fee e Honorário Zero) em cartões comparativos.

---

## Imagens e assets

- Logos institucionais: `public/logos/`.
- Logos de clientes na faixa: `public/images/clientes/` (nomes com dois dígitos: `cliente-01.png` … `cliente-24.png`).
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
