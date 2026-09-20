import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/utils";

function inline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re =
    /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[0-9]+\]|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = re.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const token = match[0];
    if (token.startsWith("**")) {
      nodes.push(<strong key={i++}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("*")) {
      nodes.push(<em key={i++}>{token.slice(1, -1)}</em>);
    } else if (token.startsWith("`")) {
      nodes.push(
        <code
          key={i++}
          className="rounded-sm bg-elevated px-1 py-0.5 font-mono text-[0.85em] text-brand"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else if (/^\[[0-9]+\]$/.test(token)) {
      nodes.push(
        <span
          key={i++}
          className="mx-0.5 inline-flex size-4 translate-y-[-1px] items-center justify-center rounded-sm bg-brand-dim font-mono text-[10px] text-brand"
        >
          {token.slice(1, -1)}
        </span>,
      );
    } else {
      const m = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (m) {
        nodes.push(
          <a
            key={i++}
            href={m[2]}
            className="text-brand underline-offset-2 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            {m[1]}
          </a>,
        );
      } else nodes.push(token);
    }
    last = match.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function MarkdownView({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const blocks = text.split(/\n{2,}/);
  return (
    <div className={cn("space-y-3 text-[15px] leading-relaxed text-fg", className)}>
      {blocks.map((block, bi) => {
        if (block.startsWith("```")) {
          const body = block.replace(/^```[a-z]*\n?/, "").replace(/```$/, "");
          return (
            <pre
              key={bi}
              className="overflow-x-auto rounded-md bg-elevated p-3 font-mono text-xs text-fg"
            >
              {body}
            </pre>
          );
        }
        const lines = block.split("\n");
        if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
          return (
            <ul key={bi} className="list-disc space-y-1 pl-5 text-fg">
              {lines.map((l, li) => (
                <li key={li}>{inline(l.replace(/^\s*[-*]\s+/, ""))}</li>
              ))}
            </ul>
          );
        }
        if (lines.every((l) => /^\s*\d+\.\s+/.test(l))) {
          return (
            <ol key={bi} className="list-decimal space-y-1 pl-5 text-fg">
              {lines.map((l, li) => (
                <li key={li}>{inline(l.replace(/^\s*\d+\.\s+/, ""))}</li>
              ))}
            </ol>
          );
        }
        const heading = block.match(/^(#{1,3})\s+(.*)$/);
        if (heading) {
          const Tag = heading[1].length === 1 ? "h3" : "h4";
          return (
            <Tag key={bi} className="font-medium tracking-tight text-fg">
              {inline(heading[2])}
            </Tag>
          );
        }
        return (
          <p key={bi} className="whitespace-pre-wrap">
            {lines.map((line, li) => (
              <Fragment key={li}>
                {li > 0 ? <br /> : null}
                {inline(line)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
