export function TempleBackdrop({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 -z-10 bg-temple-dots [background-size:18px_18px] opacity-70 ${className}`}
      aria-hidden
    />
  );
}
