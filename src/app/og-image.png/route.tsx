import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { OG_IMAGE } from "@/lib/seo";

export const dynamic = "force-static";

/**
 * Share card used by every page, generated once at build time. It lives at /og-image.png
 * rather than the opengraph-image convention so static hosts serve it with an image type.
 */
export async function GET() {
  const logo = await readFile(join(process.cwd(), "public/brand/resumefold-lockup-light@2x.png"));
  const line = (width: number, strong = false) => (
    <div style={{ display: "flex", width, height: strong ? 14 : 10, borderRadius: 6, background: strong ? "#202124" : "#dadce0" }} />
  );
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#f1f3f4", padding: 64, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, paddingRight: 48 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse requires a native image. */}
            <img src={`data:image/png;base64,${logo.toString("base64")}`} alt="ResumeFold" width={250} height={64} />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 68, fontWeight: 700, lineHeight: 1.05, color: "#202124", letterSpacing: -1 }}>Free ATS-friendly resume builder</div>
            <div style={{ display: "flex", marginTop: 24, fontSize: 30, color: "#5f6368" }}>Live preview, resume checker, PDF, DOCX and LaTeX export.</div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {["No sign-up", "Open source", "Overleaf ready"].map((label) => (
              <div key={label} style={{ display: "flex", padding: "10px 22px", borderRadius: 999, background: "#ffffff", fontSize: 24, color: "#202124" }}>{label}</div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: 330, background: "#ffffff", borderRadius: 12, padding: 32, gap: 14, boxShadow: "0 12px 40px rgba(60,64,67,.18)" }}>
          {line(200, true)}
          {line(250)}
          <div style={{ display: "flex", height: 12 }} />
          {line(120, true)}
          {line(266)}
          {line(240)}
          {line(256)}
          <div style={{ display: "flex", height: 12 }} />
          {line(120, true)}
          {line(250)}
          {line(210)}
          {line(262)}
          <div style={{ display: "flex", height: 12 }} />
          {line(90, true)}
          {line(230)}
        </div>
      </div>
    ),
    { width: OG_IMAGE.width, height: OG_IMAGE.height },
  );
}
