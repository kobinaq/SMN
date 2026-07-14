import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "light";

const variants: Record<Variant, string> = {
  primary: "bg-deep-blue text-white hover:bg-[#0c3ab0]",
  secondary: "bg-white/10 text-white border border-white/15 hover:bg-white/15",
  ghost: "bg-transparent text-white hover:bg-white/10 border border-transparent",
  light: "bg-white text-near-black hover:bg-off-white",
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
    "inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium tracking-wide transition duration-300 sm:min-h-0 sm:px-6 sm:py-3",
    "touch-manipulation select-none",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-baby-blue",
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
