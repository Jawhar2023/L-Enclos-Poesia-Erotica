export const AVATAR_IDS = [
  "quill",
  "book",
  "scroll",
  "lyre",
  "ink",
  "laurel",
  "verse",
  "parchment",
] as const;

export type AvatarId = (typeof AVATAR_IDS)[number];

const tones: Record<AvatarId, string> = {
  quill: "bg-pistachio/80",
  book: "bg-sky/70",
  scroll: "bg-butter/85",
  lyre: "bg-rose/70",
  ink: "bg-mist",
  laurel: "bg-pistachio/60",
  verse: "bg-rose/50",
  parchment: "bg-butter/65",
};

function Icon({ id }: { id: AvatarId }) {
  const common = {
    fill: "none",
    stroke: "#3d3a38",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (id) {
    case "quill":
      return (
        <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden>
          <path {...common} d="M7 25c6-8 11-13 18-17-1 6-5 12-10 16l-8 1Z" />
          <path {...common} d="M11 21c2-3 5-6 9-8" />
        </svg>
      );
    case "book":
      return (
        <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden>
          <path {...common} d="M16 8c-3-2-7-2-9-1v16c3-1 7-1 9 1 2-2 6-2 9-1V7c-2-1-6-1-9 1Z" />
          <path {...common} d="M16 8v16" />
        </svg>
      );
    case "scroll":
      return (
        <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden>
          <path {...common} d="M9 8h12a3 3 0 0 1 3 3v11H12a3 3 0 0 0-3 3V8Z" />
          <path {...common} d="M9 8a3 3 0 0 0-3 3v13M12 13h8M12 17h6" />
        </svg>
      );
    case "lyre":
      return (
        <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden>
          <path {...common} d="M10 8c0 7 2 12 6 12s6-5 6-12" />
          <path {...common} d="M8 9c0-3 2.5-4 4-3M24 9c0-3-2.5-4-4-3M16 20v5M13 25h6M13 10v8M16 9v9M19 10v8" />
        </svg>
      );
    case "ink":
      return (
        <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden>
          <path {...common} d="M12 12h8l1 4v8a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3v-8l1-4Z" />
          <path {...common} d="M14 12V8h4v4M16 18v3" />
        </svg>
      );
    case "laurel":
      return (
        <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden>
          <path {...common} d="M16 26c-5-3-8-8-8-13 2 1 5 2 8 1M16 26c5-3 8-8 8-13-2 1-5 2-8 1" />
          <path {...common} d="M11 11c.5 2 2 3 3.5 3M21 11c-.5 2-2 3-3.5 3M12 16c1 1.5 2.4 2 4 2s3-.5 4-2" />
        </svg>
      );
    case "verse":
      return (
        <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden>
          <path {...common} d="M8 9h16M8 14h12M8 19h14M8 24h9" />
        </svg>
      );
    case "parchment":
      return (
        <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden>
          <path {...common} d="M9 6h14v18l-3-2-2 2-2-2-2 2-2-2-3 2V6Z" />
          <path {...common} d="M13 11h8M13 15h6" />
        </svg>
      );
  }
}

export function isAvatarId(value: string | undefined): value is AvatarId {
  return !!value && (AVATAR_IDS as readonly string[]).includes(value);
}

export function randomAvatar(): AvatarId {
  return AVATAR_IDS[Math.floor(Math.random() * AVATAR_IDS.length)];
}

export function avatarFromId(seed: string): AvatarId {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash + seed.charCodeAt(i)) % AVATAR_IDS.length;
  return AVATAR_IDS[hash];
}

export function CommentAvatar({
  id,
  size = "md",
}: {
  id?: string;
  size?: "sm" | "md";
}) {
  const avatar = isAvatarId(id) ? id : avatarFromId(id || "guest");
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full ${tones[avatar]} ${
        size === "sm" ? "h-9 w-9" : "h-11 w-11"
      }`}
    >
      <Icon id={avatar} />
    </span>
  );
}
