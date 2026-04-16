import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ABE | Recuperação de Crédito B2B",
  description:
    "Site institucional da ABE com ecossistema completo de recuperação de crédito, cobrança preventiva, cobrança digital e suporte jurídico.",
};

const themeScript = `
(function() {
  try {
    var saved = localStorage.getItem('theme');
    var theme = saved === 'light' || saved === 'dark' ? saved : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
