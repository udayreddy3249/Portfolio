import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { profile } from "@/content/profile";
import "./globals.css";

const inter = localFont({
  src: "../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const archivo = localFont({
  src: "../../node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2",
  variable: "--font-archivo",
  weight: "100 900",
  display: "swap",
});

const title = `${profile.name} — Forward Deployed Engineer | Applied AI`;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title,
  description: profile.intro,
  authors: [{ name: profile.name }],
  openGraph: {
    title,
    description: profile.intro,
    type: "profile",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: title }],
  },
  twitter: { card: "summary_large_image", title, description: profile.intro, images: ["/og-image.png"] },
};

export const viewport: Viewport = {
  themeColor: "#080a10",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${archivo.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js','intro-active')" }} />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
