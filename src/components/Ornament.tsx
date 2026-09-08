export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden>
      <span className="h-px w-16 bg-pistachio/80" />
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3c2.2 3.4 2.2 6.2 0 9-2.2-2.8-2.2-5.6 0-9Zm0 9c2.2 3.4 2.2 6.2 0 9-2.2-2.8-2.2-5.6 0-9Zm-6.5-1.2C8.8 9.2 11 10 12 12c-2.4-.6-5-1.3-6.5-4.2Zm13 0C15.2 9.2 13 10 12 12c2.4-.6 5-1.3 6.5-4.2Z"
          stroke="#7ea58a"
          strokeWidth="1.1"
        />
      </svg>
      <span className="h-px w-16 bg-rose/80" />
    </div>
  );
}
