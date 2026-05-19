import type { Metadata } from "next";
import "./grupo-abe-site.css";
import { GrupoAbeSite } from "@/components/GrupoAbeSite";

export const metadata: Metadata = {
  title: "Grupo ABE — Ecossistema de Crédito Corporativo",
  description:
    "Quatro especialistas, uma jornada. O Grupo ABE reúne ABE, AvantPay, Grejo Advogados e Acordo Seguro para cobrir todo o ciclo do crédito corporativo.",
};

export default function Home() {
  return (
    <main id="top">
      <GrupoAbeSite />
    </main>
  );
}
