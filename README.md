# Uday Kumar M — Portfolio

A dark, cinematic, scroll-driven portfolio built with Next.js, TypeScript, Tailwind CSS, GSAP ScrollTrigger, and React Three Fiber.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
```

Requires Node.js 20 or newer.

## Edit your content

All text, links, and photo paths live in **`src/content/profile.ts`**. Components only read from that file.

| To change | Edit in `profile.ts` |
|---|---|
| Name, title, intro, location | `name`, `title`, `titleAccent`, `intro`, `location` |
| GitHub link (icon appears once set) | `links.github` |
| Floating hero tech cards | `techCards` |
| About text and highlight cards | `about` |
| Scroll-lit statement | `statement` |
| Big numbers scene | `stats` |
| Projects | `projects` (add `image`, `githubUrl`, `liveUrl` and the card shows them) |
| Experience, skills, education, certifications | `experience`, `skills`, `education`, `certifications` |

## Swap files

- **Resume:** drop your PDF at `public/resume.pdf` and rebuild. Both "Download Resume" buttons appear automatically. They stay hidden while the file is missing.
- **3D hero character (Dev Toy):** built from shapes in code in `src/components/three/devToy.ts`. Change his colours (skin, hair, hoodie, cap, shoes) in the `makeHuman({...})` call inside `buildDev`. His scroll routine (type → swivel → wave → stand) is the pose list `P` and the `update` function below it. His head follows the mouse; when the mouse is still for 2.5 seconds he watches the glowing ball instead.
- **Graduation photo:** `public/photos/graduation-night.jpg`. If you swap it, give the new file a new name and update `photos` in `profile.ts`, so browsers don't show a cached copy. Your untouched original photos and the studio cut-out from the earlier design are in `design-source/`.
- **Project images:** add `public/projects/<name>.webp` (16:10) and set `image: "/projects/<name>.webp"` on the project. Without an image, a drawn cover is used.
- **Social preview image:** `public/og-image.png`, a 1200×630 screenshot of the hero.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New → Project**, import the repository, and keep the defaults.
3. In **Settings → Environment Variables**, set `NEXT_PUBLIC_SITE_URL` to your final URL (for example `https://udaykumar.dev`) so social previews use absolute links.

## How the motion works

Every scroll animation is scrubbed to the scrollbar, so it reverses exactly when you scroll back up. Native scrolling is never hijacked.

| Scene | File |
|---|---|
| 3D Dev Toy: scroll routine, mouse-follow, glowing ball | `src/components/three/devToy.ts`, `src/components/Hero.tsx` |
| Scroll-progress ball (left rail) | `src/components/SideRail.tsx` |
| Glowing cursor ball | `src/components/CursorBall.tsx` |
| Scroll-lit statement | `src/components/Statement.tsx` |
| Pinned big numbers | `src/components/Stats.tsx` |
| Pinned horizontal projects | `src/animations/useProjectsPin.ts` |
| Scroll-drawn experience timeline | `src/components/Experience.tsx` |
| Full-screen graduation zoom | `src/components/Education.tsx` |
| Section headline reveals | `src/animations/useReveal.ts` |

Modes, defined once in `src/app/globals.css` and `src/lib/motion.ts`:

- **Cinematic** (≥1024px wide, ≥640px tall, motion allowed): every scene, including the pinned 3D hero and full-screen photo.
- **Tablet** (≥768px): pinned projects, simpler photo scenes.
- **Phone**: stacked layout, swipeable project row, scroll-lit text and stats still run.
- **Reduced motion**: no pinning, scrubbing, or floating; all content is visible.

## Static preview build (optional)

`STATIC_EXPORT=1 npm run build` writes a plain static site to `out/`. `python3 scripts/make-preview.py <folder>` turns it into a copy that works from any sub-path.
