import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-7", className)}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" fill="currentColor" className="text-brand" />
      <path
        d="M9 21.5V10.5h3.1l4.2 6.6V10.5H19.5V21.5h-3.1l-4.2-6.6v6.6H9z"
        fill="#0b0d0c"
      />
      <circle cx="23.2" cy="11.2" r="1.5" fill="#0b0d0c" />
      <circle cx="23.2" cy="20.8" r="1.5" fill="#0b0d0c" />
      <path d="M23.2 12.7v6.4" stroke="#0b0d0c" strokeWidth="1.2" />
    </svg>
  );
}

export function BrandWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5 text-fg", className)}>
      <BrandMark />
      <span className="font-display text-xl tracking-tight">Nexora</span>
    </span>
  );
}
