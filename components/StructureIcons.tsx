type IconProps = { className?: string };

/** Equipa + diálogo (três figuras, bolha com reticências) — alinhado à identidade visual Operação */
export function IconOperacao({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="5.5" y="2.25" width="13" height="5.5" rx="1.25" />
      <circle cx="9.1" cy="4.9" r="0.55" fill="currentColor" stroke="none" />
      <circle cx="12" cy="4.9" r="0.55" fill="currentColor" stroke="none" />
      <circle cx="14.9" cy="4.9" r="0.55" fill="currentColor" stroke="none" />
      <circle cx="6.1" cy="15.1" r="1.5" />
      <path d="M3.2 20.1c0-2 1.2-3.1 2.9-3.1s2.9 1.1 2.9 3.1" />
      <circle cx="12" cy="14.2" r="1.75" />
      <path d="M8.3 20.1c0-2.1 1.3-3.2 3.1-3.2h1.2c1.8 0 3.1 1.1 3.1 3.2" />
      <circle cx="17.9" cy="15.1" r="1.5" />
      <path d="M15.1 20.1c0-2 1.2-3.1 2.9-3.1s2.9 1.1 2.9 3.1" />
    </svg>
  );
}

/** Base de dados (cilindro com 3 níveis) + tendência / barras */
export function IconDados({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <ellipse cx="9" cy="4.8" rx="5.2" ry="1.75" />
      <path d="M3.8 4.8v11.4" />
      <path d="M14.2 4.8v11.4" />
      <ellipse cx="9" cy="10.5" rx="5.2" ry="1.75" />
      <ellipse cx="9" cy="16.2" rx="5.2" ry="1.75" />
      <path d="M17.2 17.5V7.8M17.2 17.5h3M20.2 17.5l-1.4-2" strokeWidth="1.1" />
      <path d="M17.8 14v3.5M19.2 12v5.5M20.6 9.5v8" opacity="0.5" strokeWidth="1" />
    </svg>
  );
}

/** Balança da justiça — linhas finas, pratos equilibrados */
export function IconJuridico({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.15"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 2.8v1.4" />
      <path d="M4.5 7.2h15" />
      <path d="M6.2 7.2v1.6" />
      <path d="M17.8 7.2v1.6" />
      <path d="M3.8 8.8h4.8L6.2 15.4 3.8 8.8z" />
      <path d="M20.2 8.8h-4.8L17.8 15.4 20.2 8.8z" />
      <path d="M12 7.2V19.2" />
      <path d="M7.5 20h9" />
    </svg>
  );
}

/** Aperto de mãos — par de traços espelhados + polegares */
export function IconRelacionamento({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m11 17 2 2a1 1 0 1 0 3-3" />
      <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
      <path d="m21 3 1 11h-2" />
      <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
      <path d="M3 4h8" />
    </svg>
  );
}

const structureIconMap = {
  Operação: IconOperacao,
  Dados: IconDados,
  Jurídico: IconJuridico,
  Relacionamento: IconRelacionamento,
} as const;

export function StructureIcon({ title }: { title: keyof typeof structureIconMap }) {
  const Cmp = structureIconMap[title];
  return <Cmp className="structureIconSvg" />;
}
