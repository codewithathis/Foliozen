import { ImageResponse } from "next/og";

export const dynamic = "force-static";
/** PNG home-screen icon matching icon.svg, for iOS and the web manifest. Served at /apple-touch-icon.png. */
export function GET() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#1a73e8", alignItems: "center", justifyContent: "center" }}>
        <svg width="120" height="120" viewBox="12 12 40 44">
          <path d="M18 18h20a8 8 0 0 1 0 16H18zM18 34h22a8 8 0 0 1 0 16H18z" fill="none" stroke="#fff" strokeWidth="5" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    { width: 180, height: 180 },
  );
}
