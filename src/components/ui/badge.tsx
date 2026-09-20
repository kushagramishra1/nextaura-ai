import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium tracking-wide",
  {
    variants: {
      variant: {
        default: "border-transparent bg-brand-dim text-brand",
        outline: "border-border text-muted",
        success: "border-transparent bg-brand-dim text-ok",
        warn: "border-transparent bg-[#2a2418] text-warn",
        danger: "border-transparent bg-[#2a1818] text-danger",
        muted: "border-transparent bg-elevated text-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
