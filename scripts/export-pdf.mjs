/**
 * Gera um PDF da página (site single-page) via headless Chrome.
 * Uso: com o app rodando (npm run dev ou npm start), execute:
 *   npm run pdf
 * Opcional:
 *   PDF_URL=https://exemplo.com npm run pdf
 *   PDF_OUT=export/meu.pdf PDF_WAIT_MS=4000 npm run pdf
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const url = process.env.PDF_URL || process.argv[2] || "http://127.0.0.1:3000";
const outRel = process.env.PDF_OUT || process.argv[3] || path.join("export", "abe-site.pdf");
const outPath = path.isAbsolute(outRel) ? outRel : path.join(root, outRel);
const waitMs = Number(process.env.PDF_WAIT_MS || 3000);

fs.mkdirSync(path.dirname(outPath), { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });

  // "networkidle" costuma não terminar no Next em dev (HMR / polling).
  await page.goto(url, { waitUntil: "load", timeout: 120000 });
  await new Promise((r) => setTimeout(r, waitMs));

  // A página usa .reveal { opacity: 0 } até o IntersectionObserver marcar .isVisible.
  // No PDF fullPage o viewport não “rola” como no browser: o restante fica invisível
  // e só aparece o fundo do body (parece “tudo azul” no tema escuro).
  await page.evaluate(async () => {
    const step = 600;
    const max = Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight ?? 0);
    for (let y = 0; y < max; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
  await page.evaluate(() => {
    document.querySelectorAll(".reveal").forEach((el) => {
      el.classList.add("isVisible");
    });
  });
  await page.addStyleTag({
    content: `
      html.pdf-export .reveal {
        opacity: 1 !important;
        transform: none !important;
      }
      html.pdf-export *, html.pdf-export *::before, html.pdf-export *::after {
        animation: none !important;
        transition: none !important;
      }
    `,
  });
  await page.evaluate(() => {
    document.documentElement.classList.add("pdf-export");
  });
  await new Promise((r) => setTimeout(r, 400));

  await page.pdf({
    path: outPath,
    printBackground: true,
    fullPage: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  });

  const stat = fs.statSync(outPath);
  console.log("PDF salvo:", outPath, `(${(stat.size / 1024).toFixed(1)} KB)`);
} finally {
  await browser.close();
}
