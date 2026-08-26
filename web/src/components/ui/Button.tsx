import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "light" | "ai" | "danger";

const variants: Record<Variant, string> = {
  // Accent-strong rather than deep-blue: the old primary sat too close to the
  // dark ground to read as the obvious action on a page.
  primary: "bg-accent-strong text-[#08111f] hover:bg-accent shadow-[var(--shadow-1)]",
  secondary: "bg-inset text-text-1 border border-edge hover:border-edge-strong",
  ghost: "bg-transparent text-text-2 border border-transparent hover:bg-inset hover:text-text-1",
  light: "bg-white text-near-black hover:bg-off-white",
  ai: "bg-ai text-[#07160f] hover:bg-ai-strong shadow-[var(--shadow-1)]",
  danger: "bg-danger text-[#2a0906] hover:bg-[#f2948b] shadow-[var(--shadow-1)]",
};

type Common = {
  children: ReactNode;
  className?: string;
  variant?: Variant;
};

type ButtonAsButton = Common &
  Omit<ComponentProps<"button">, "className" | "children"> & {
    href?: undefined;
  };

type ButtonAsLink = Common & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: ComponentProps<"a">["onClick"];
};

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonAsButton | ButtonAsLink) {
  const classes = cn(
    "inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold tracking-wide",
    "transition-[background,border-color,transform,box-shadow] duration-[var(--dur-fast)] ease-[var(--ease-out)]",
    "touch-manipulation select-none active:scale-[0.97] motion-reduce:active:scale-100",
    "disabled:pointer-events-none disabled:opacity-40",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
    variants[variant],
    className,
  );

  if ("href" in props && props.href) {
    const { href, target, rel, onClick } = props;
    return (
      <Link href={href} target={target} rel={rel} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
