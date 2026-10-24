import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name}: free ATS-friendly resume builder`,
    short_name: SITE.name,
    description: SITE.tagline,
    start_url: `${base}/`,
    scope: `${base}/`,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    categories: ["productivity", "business"],
    icons: [
      { src: `${base}/brand/resumefold-icon-light.svg`, sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: `${base}/brand/resumefold-icon-light-256.png`, sizes: "256x256", type: "image/png", purpose: "any" },
      { src: `${base}/brand/resumefold-icon-light-512.png`, sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
