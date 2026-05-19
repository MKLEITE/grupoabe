"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { href: "#hero", label: "Início" },
  { href: "#jornada", label: "Jornada" },
  { href: "#grupo", label: "Empresas" },
  { href: "#inteligencia", label: "Inteligência" },
  { href: "#contato", label: "Contato" },
];

export function HomeGrupoHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="siteHeader grupoInst__header">
      <div className="container navWrap">
        <Link href="/#hero" className="brandMark" aria-label="Grupo ABE — início">
          <Image src="/logos/abe.png" alt="ABE" width={150} height={70} className="brandLogo" priority />
        </Link>

        <nav className={`mainNav grupoInst__mainNav ${menuOpen ? "open" : ""}`} aria-label="Secções institucionais">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="grupoInst__navLink" onClick={() => setMenuOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="navActions">
          <ThemeToggle />
          <button
            type="button"
            className="menuButton grupoInst__menuBtn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}
