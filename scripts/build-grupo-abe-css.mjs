import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const htmlPath = path.join(root, "grupo-abe-site.html");
const outPath = path.join(root, "app", "grupo-abe-site.css");

const s = fs.readFileSync(htmlPath, "utf8");
const m = s.match(/<style>([\s\S]*?)<\/style>/);
if (!m) throw new Error("no style block");
let c = m[1];

c = c.replace(/^body \{/m, ".grupoAbeSiteRoot {");
c = c.replace(/body\.cursor-visible/g, ".grupoAbeSiteRoot.cursor-visible");
c = c.replace(/body\.hovering/g, ".grupoAbeSiteRoot.hovering");
c = c.replace(/body\.clicking/g, ".grupoAbeSiteRoot.clicking");
c = c.replace(/^section \{/m, ".grupoAbeSiteRoot section {");
c = c.replace(/^nav \{/m, ".grupoAbeSiteRoot nav {");
c = c.replace(/^nav\.scrolled/m, ".grupoAbeSiteRoot nav.scrolled");
c = c.replace(/^footer \{/m, ".grupoAbeSiteRoot footer {");
c = c.replace(/^h1 \{/m, ".grupoAbeSiteRoot h1 {");
c = c.replace(/^h2 \{/m, ".grupoAbeSiteRoot h2 {");
c = c.replace(
  /\[data-theme="light"\] nav\.scrolled/g,
  '[data-theme="light"] .grupoAbeSiteRoot nav.scrolled',
);

const header = `@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap");

`;

const extra = `
/* Logos */
.nav-logo-link { display: flex; align-items: center; gap: 0.65rem; text-decoration: none; color: inherit; }
.nav-logo-img { height: 40px; width: auto; display: block; object-fit: contain; }
.nav-logo-word { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700; letter-spacing: .05em; color: var(--text); font-weight: 400; }
.empresa-logo-img { max-height: 48px; width: auto; max-width: 200px; object-fit: contain; }
.footer-brand { display: flex; align-items: center; gap: 0.75rem; }
.footer-logo-img { height: 36px; width: auto; object-fit: contain; opacity: 0.95; }

/* Mobile menu */
.nav-menu-btn {
  display: none;
  background: var(--border2);
  border: 1px solid var(--border);
  color: var(--text);
  width: 42px;
  height: 36px;
  border-radius: 6px;
  font-size: 1.1rem;
  line-height: 1;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.grupoAbeSiteRoot nav { position: relative; }
@media (max-width: 900px) {
  .nav-menu-btn { display: inline-flex; }
  .grupoAbeSiteRoot .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 1rem 1.25rem 1.25rem;
    background: rgba(11, 11, 11, 0.96);
    border-bottom: 1px solid var(--border2);
    backdrop-filter: blur(16px);
  }
  [data-theme="light"] .grupoAbeSiteRoot .nav-links {
    background: rgba(247, 244, 239, 0.96);
  }
  .grupoAbeSiteRoot .nav-links.is-open { display: flex; }
  .grupoAbeSiteRoot .nav-links li { width: 100%; }
  .grupoAbeSiteRoot .nav-links a { display: block; padding: 0.65rem 0; }
}

.theme-toggle { cursor: pointer; }
`;

fs.writeFileSync(outPath, header + c + extra + "\n");
console.log("Wrote", outPath);
