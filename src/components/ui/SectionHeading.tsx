import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  lead,
  id,
  className = "",
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <header className={`max-w-3xl ${className}`} data-reveal-group>
      <p className="eyebrow mb-5" data-reveal>
        {eyebrow}
      </p>
      <h2 id={id} className="display text-[clamp(2.4rem,5.4vw,4.6rem)]" data-reveal>
        {title}
      </h2>
      {lead && (
        <p className="mt-6 max-w-2xl text-[1.075rem] leading-relaxed text-ink-soft md:text-lg" data-reveal>
          {lead}
        </p>
      )}
    </header>
  );
}
