import type { Metadata, Viewport } from "next";
import { Archivo, Martian_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { Nav } from "@/components/nav";
import { SectionRail } from "@/components/section-rail";
import { SiteProvider } from "@/components/site-provider";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Toaster } from "@/components/ui/sonner";
import { BOOT_SCRIPT } from "@/lib/boot-script";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", adjustFontFallback: true });
const martian = Martian_Mono({ subsets: ["latin"], axes: ["wdth"], variable: "--font-martian", adjustFontFallback: true });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Umejr Dzinovic — Next.js & Spring Boot developer", template: "%s — Umejr Dzinovic" },
  description:
    "Next.js and Spring Boot developer, studying software engineering in Graz. Spring Boot APIs with stateless JWT auth, the Next.js apps on top — containerised with Docker, shipped through CI/CD.",
  authors: [{ name: "Umejr Dzinovic", url: "https://github.com/Umex10" }],
  openGraph: { type: "website", siteName: "umex10", locale: "en" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#08090c" },
    { media: "(prefers-color-scheme: light)", color: "#eceef2" },
  ],
};

export default function RootLayout({ children, modal }: { children: ReactNode; modal: ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${archivo.variable} ${martian.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false} storageKey="umex-theme" disableTransitionOnChange>
          <SiteProvider>
            <SmoothScroll>
              <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-1 overflow-hidden">
                <div className="absolute -top-[20vw] -left-[18vw] size-[62vw] rounded-full bg-acc opacity-(--blob) blur-[140px]" />
                <div className="absolute -right-[14vw] -bottom-[10vw] size-[44vw] rounded-full bg-acc2 opacity-(--blob) blur-[150px]" />
              </div>
              <a
                href="#main"
                className="fixed top-3 left-3 z-100 -translate-y-20 rounded-full bg-ink px-4 py-2 font-mono text-[11px] text-bg focus:translate-y-0"
              >
                skip to content
              </a>
              <Nav />
              <SectionRail />
              {children}
              {modal}
              <Toaster position="bottom-center" />
            </SmoothScroll>
          </SiteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
