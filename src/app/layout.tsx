import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./editorial.css";
import "./workflow.css";
import { THEME_BOOT_SCRIPT } from "@/lib/theme";
import { SITE } from "@/lib/site";
import { OG_IMAGE } from "@/lib/seo";
import { ScrollEffects } from "@/components/ui/ScrollEffects";

const editorialFont = localFont({
  src: "../../public/fonts/source-serif-regular.woff2",
  variable: "--font-editorial",
  weight: "400 700",
  display: "swap",
});
const googleSansCode = localFont({
  src: "./fonts/google-sans-code-latin.woff2",
  variable: "--font-google-sans-code",
  weight: "300 800",
  display: "swap",
  preload: false,
});
const headingFont = localFont({
  src: "./fonts/inter-variable.woff2",
  variable: "--font-heading",
  weight: "400 800",
  display: "swap",
});

const description = SITE.description;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `%s · ${SITE.name}`,
  },
  description,
  authors: [{ name: SITE.owner, url: SITE.repo || SITE.url }],
  creator: SITE.owner,
  publisher: SITE.owner,
  category: "productivity",
  formatDetection: { telephone: false, email: false, address: false },
  // Set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION at build time to verify the site in Google Search Console.
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
  // Google ignores meta keywords; other engines may still read them. The page copy is what ranks.
  keywords: [
    "free resume builder",
    "ATS-friendly resume builder",
    "resume builder no sign up",
    "resume builder no watermark",
    "ATS resume templates",
    "ATS resume checker",
    "ATS score checker",
    "resume keyword scanner",
    "LaTeX resume templates",
    "Overleaf resume template",
    "resume maker",
    "CV maker",
    "open source resume builder",
  ],
  applicationName: SITE.name,
  // Pages set their own canonical URL and social tags through pageMetadata().
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_US",
    title: SITE.title,
    description,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description,
    images: [OG_IMAGE],
  },
  // Public icon URLs include the deployment base path for static hosting.
  icons: {
    icon: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/favicon.ico`,
        type: "image/x-icon",
      },
      {
        url: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/icon.svg`,
        type: "image/svg+xml",
        sizes: "any",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/brand/foliozen-icon-small-dark.svg`,
        type: "image/svg+xml",
        sizes: "any",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/apple-touch-icon.png`,
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7ee" },
    { media: "(prefers-color-scheme: dark)", color: "#151d26" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${editorialFont.variable} ${googleSansCode.variable} ${headingFont.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
        <ScrollEffects />
        {children}
      </body>
    </html>
  );
}
