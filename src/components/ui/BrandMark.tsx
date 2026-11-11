import Image from "next/image";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function BrandMark({ lockup = false }: { lockup?: boolean }) {
  const asset = lockup ? "lockup" : "icon-small";
  return (
    <span
      className={lockup ? "brand-logo" : "brand-mark"}
      aria-hidden="true"
    >
      {(["light", "dark"] as const).map((theme) => (
        <Image
          key={theme}
          className={`brand-asset brand-asset-${theme}`}
          src={`${base}/brand/foliozen-${asset}-${theme}.svg`}
          alt=""
          width={lockup ? 810 : 1024}
          height={lockup ? 256 : 1024}
          loading="eager"
          unoptimized
        />
      ))}
    </span>
  );
}
