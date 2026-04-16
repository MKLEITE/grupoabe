type Props = { name: string; className?: string };

/** Ícones em estilo próximo aos canais (marcas genéricas em SVG). */
export function ChannelIcon({ name, className = "" }: Props) {
  const c = `channelIconSvg ${className}`.trim();
  switch (name) {
    case "whatsapp":
      return (
        <svg className={c} viewBox="0 0 24 24" aria-hidden>
          <path
            fill="currentColor"
            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
          />
        </svg>
      );
    case "sms":
      return (
        <svg className={c} viewBox="0 0 24 24" aria-hidden>
          <path
            fill="currentColor"
            d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H8l-4 3v-3H4a2 2 0 01-2-2V6a2 2 0 012-2zm2 4h12v2H6V8zm0 4h8v2H6v-2z"
          />
        </svg>
      );
    case "email":
      return (
        <svg className={c} viewBox="0 0 24 24" aria-hidden>
          <path
            fill="currentColor"
            d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z"
          />
        </svg>
      );
    case "chatbot":
      return (
        <svg className={c} viewBox="0 0 24 24" aria-hidden>
          <path
            fill="currentColor"
            d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7v4h-2v-2H4v2H2v-4a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2M7.5 13A1.5 1.5 0 109 14.5 1.5 1.5 0 007.5 13m9 0a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"
          />
        </svg>
      );
    case "ligacao":
      return (
        <svg className={c} viewBox="0 0 24 24" aria-hidden>
          <path
            fill="currentColor"
            d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57a1 1 0 011 1V21a1 1 0 01-1 1C10.07 22 2 13.93 2 3a1 1 0 011-1h3.5a1 1 0 011 1c0 1.24.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
          />
        </svg>
      );
    case "presencial":
      return (
        <svg className={c} viewBox="0 0 24 24" aria-hidden>
          <path
            fill="currentColor"
            d="M12 11.5A2.5 2.5 0 109.5 9 2.5 2.5 0 0012 11.5M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7z"
          />
        </svg>
      );
    case "internas":
      return (
        <svg className={c} viewBox="0 0 24 24" aria-hidden>
          <path
            fill="currentColor"
            d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm15 0h3v3h-3v3h-3v-3h-3v-3h3v-3h3v3z"
          />
        </svg>
      );
    default:
      return (
        <svg className={c} viewBox="0 0 24 24" aria-hidden>
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.75" />
        </svg>
      );
  }
}
