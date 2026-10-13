import type { AnchorHTMLAttributes, ReactNode } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: "primary" | "glass";
  icon?: ReactNode;
  external?: boolean;
};

export function Button({ variant = "primary", icon, external, className = "", children, ...rest }: Props) {
  const base =
    "group relative inline-flex h-11 items-center gap-2 rounded-full px-5 text-[1.02rem] font-normal tracking-[-0.01em] transition-[transform,background-color,color] duration-300 ease-[var(--ease-out-expo)] active:scale-[0.97]";
  const styles =
    variant === "primary"
      ? "bg-ink text-ivory hover:bg-sky-deep"
      : "text-ink ring-1 ring-inset ring-white/30 hover:bg-white/10";
  return (
    <a
      className={`${base} ${styles} ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      <span>{children}</span>
      {icon && (
        <span className="transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5">
          {icon}
        </span>
      )}
    </a>
  );
}

export function IconLink({
  href,
  label,
  children,
  external = true,
}: {
  href: string;
  label: string;
  children: ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      className="inline-flex size-11 items-center justify-center rounded-full bg-white/[0.06] text-ink-soft transition-[background-color,color] duration-300 hover:bg-white/[0.12] hover:text-ink"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
