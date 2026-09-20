import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { BrandWordmark } from "@/components/brand-mark";

export function AuthFrame({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-dvh bg-bg lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between border-r border-border bg-surface p-10 lg:flex">
        <Link to="/">
          <BrandWordmark />
        </Link>
        <div>
          <p className="font-display text-4xl leading-tight tracking-tight">
            Answers with a paper trail.
          </p>
          <p className="mt-4 max-w-md text-muted">
            Upload the handbook once. Ask how refunds, incidents, or onboarding
            actually work — and see which document said so.
          </p>
        </div>
        <p className="text-sm text-subtle">Nexora · knowledge operations</p>
      </div>
      <div className="flex flex-col justify-center px-4 py-12 sm:px-10">
        <div className="mb-10 lg:hidden">
          <Link to="/">
            <BrandWordmark />
          </Link>
        </div>
        <div className="mx-auto w-full max-w-sm">
          <h1 className="font-display text-3xl tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
