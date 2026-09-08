export function GateMark({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden fill="none">
      <rect x="8" y="10" width="48" height="46" rx="3" stroke="#7ea58a" strokeWidth="1.4" />
      <path d="M8 22h48M32 10v46" stroke="#c9b48a" strokeWidth="1" />
      <path
        d="M22 34c0-6 4.2-10 10-10s10 4 10 10v16H22V34Z"
        stroke="#7ea58a"
        strokeWidth="1.4"
      />
      <circle cx="36.5" cy="42" r="1.4" fill="#c9b48a" />
    </svg>
  );
}
