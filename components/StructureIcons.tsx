type IconProps = { className?: string };

export function IconOperacao({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M4 6h16M4 12h10M4 18h16" strokeLinecap="round" />
      <path d="M17 9v6l3-3-3-3z" strokeLinejoin="round" />
    </svg>
  );
}

export function IconDados({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M4 19V5M4 19h16M8 15v4M12 11v8M16 7v12" strokeLinecap="round" />
    </svg>
  );
}

export function IconJuridico({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M12 3v18M9 21h6" strokeLinecap="round" />
      <path d="M7 8h10M7 12h6" strokeLinecap="round" />
      <path d="M5 3h14v5H5V3z" strokeLinejoin="round" />
    </svg>
  );
}

export function IconRelacionamento({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path
        d="M18 18.72a9.09 9.09 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
