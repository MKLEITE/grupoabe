import type { Metadata } from "next";

/** Apresentação completa herdada deste projeto: acesso apenas por URL explícita (não aparece como Home). */
export const metadata: Metadata = {
  title: "ABE | Apresentação institucional",
  description:
    "Apresentação detalhada do ecossistema ABE, cobrança, ecossistema, clientes e contratos.",
  robots: { index: false, follow: false },
};

export default function ApresentacaoInstitucionalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
