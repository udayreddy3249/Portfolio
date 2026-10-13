"use client";

import { useRef } from "react";
import { profile } from "@/content/profile";
import { useReveal } from "@/animations/useReveal";
import { Button, IconLink } from "./ui/Button";
import { ArrowUpRightIcon, DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon } from "./ui/Icons";

export function Contact({ hasResume }: { hasResume: boolean }) {
  const section = useRef<HTMLElement>(null);
  useReveal(section);

  return (
    <section ref={section} id="contact" aria-labelledby="contact-title" className="relative pt-28 md:pt-40">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="tile relative overflow-hidden !rounded-[36px] px-6 py-16 text-center md:px-16 md:py-28" data-reveal>

          <p className="eyebrow relative">Contact</p>
          <h2 id="contact-title" className="display relative mx-auto mt-6 max-w-4xl text-[clamp(2.6rem,6.6vw,5.6rem)]">
            {profile.contact.heading.replace("intelligent.", "")}
            <span className="text-gradient">intelligent.</span>
          </h2>
          <p className="relative mx-auto mt-6 max-w-xl text-[1.05rem] leading-relaxed text-ink-soft md:text-lg">{profile.contact.blurb}</p>

          <a
            href={`mailto:${profile.links.email}`}
            className="group relative mt-10 inline-flex items-center gap-2 text-[clamp(1.35rem,3.4vw,2.3rem)] font-semibold tracking-[-0.03em] text-sky-deep"
          >
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 ease-[var(--ease-out-expo)] group-hover:bg-[length:100%_2px]">
              {profile.links.email}
            </span>
            <ArrowUpRightIcon width={28} height={28} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>

          <div className="relative mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button href={profile.links.linkedin} external icon={<LinkedInIcon width={18} height={18} />}>
              Connect on LinkedIn
            </Button>
            {hasResume && (
              <Button href={profile.links.resume} download variant="glass" icon={<DownloadIcon />}>
                Download Resume
              </Button>
            )}
            {profile.links.github && (
              <IconLink href={profile.links.github} label="GitHub profile">
                <GitHubIcon />
              </IconLink>
            )}
          </div>
        </div>
      </div>

      <footer className="mx-auto mt-16 flex max-w-6xl flex-col items-center justify-between gap-4 px-5 pb-10 text-sm text-ink-muted md:flex-row md:px-8">
        <p>
          © {new Date().getFullYear()} {profile.name} · {profile.location}
        </p>
        <div className="flex items-center gap-2">
          <IconLink href={profile.links.linkedin} label="LinkedIn profile">
            <LinkedInIcon width={18} height={18} />
          </IconLink>
          {profile.links.github && (
            <IconLink href={profile.links.github} label="GitHub profile">
              <GitHubIcon width={18} height={18} />
            </IconLink>
          )}
          <IconLink href={`mailto:${profile.links.email}`} label={`Email ${profile.links.email}`} external={false}>
            <MailIcon width={18} height={18} />
          </IconLink>
          <a href="#home" className="ml-3 hover:text-ink">
            Back to top ↑
          </a>
        </div>
      </footer>
    </section>
  );
}
