"use client";

import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

const components: Components = {
  h1: ({ children }) => (
    <h1 className="mt-5 mb-2 font-display text-xl text-white first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-5 mb-2 font-display text-lg text-white first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-4 mb-1.5 text-[15px] font-semibold text-white first:mt-0">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="mt-3 mb-1 text-sm font-semibold text-white/90 first:mt-0">{children}</h4>
  ),
  p: ({ children }) => <p className="my-2.5 text-sm leading-relaxed text-white/70">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
  em: ({ children }) => <em className="italic text-white/80">{children}</em>,
  ul: ({ children }) => (
    <ul className="my-2.5 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-white/70">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-2.5 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-white/70">{children}</ol>
  ),
  li: ({ children }) => <li className="marker:text-white/35">{children}</li>,
  hr: () => <hr className="my-4 border-white/10" />,
  a: ({ href, children }) => (
    <a href={href} className="text-baby-blue underline-offset-2 hover:underline" target="_blank" rel="noreferrer">
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-3 border-l-2 border-baby-blue/40 pl-3 text-sm leading-relaxed text-white/55">
      {children}
    </blockquote>
  ),
  code: ({ className, children }) => {
    const isBlock = Boolean(className);
    if (isBlock) {
      return (
        <code className="block overflow-x-auto rounded-lg bg-black/30 p-3 font-mono text-xs leading-relaxed text-white/80">
          {children}
        </code>
      );
    }
    return (
      <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-[0.85em] text-baby-blue">{children}</code>
    );
  },
  pre: ({ children }) => <pre className="my-3 overflow-x-auto">{children}</pre>,
  table: ({ children }) => (
    <div className="my-3 overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full min-w-[28rem] border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-white/[.06] text-white/80">{children}</thead>,
  tbody: ({ children }) => <tbody className="text-white/65">{children}</tbody>,
  tr: ({ children }) => <tr className="border-t border-white/10">{children}</tr>,
  th: ({ children }) => (
    <th className="px-3 py-2 text-xs font-semibold tracking-wide uppercase">{children}</th>
  ),
  td: ({ children }) => <td className="px-3 py-2 align-top text-sm leading-relaxed">{children}</td>,
};

export function AiMarkdown({ content, className }: { content: string; className?: string }) {
  return (
    <div className={cn("ai-markdown max-w-none", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
