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
      { src: `${base}/icon.svg`, sizes: "any", type: "image/svg+xml" },
      { src: `${base}/apple-touch-icon.png`, sizes: "180x180", type: "image/png" },
    ],
  };
}
