import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

/**
 * Crawlers only read robots.txt at the root of a host. On a GitHub project page
 * (user.github.io/resumefold/) submit the sitemap in Search Console instead.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
