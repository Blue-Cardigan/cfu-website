import type { Metadata } from "next";

export const CANONICAL_BASE_URL = "https://creativesforukraine.uk";

export const OG_IMAGES = ["/og-image.png", "/og-image-2.png", "/og-image-3.png", "/og-image-4.png"] as const;

export const SITE_TITLE = "Creatives for Ukraine";
export const SITE_DESCRIPTION = "Make a positive impact on the lives of Ukrainians.";

export function getBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (!raw) return CANONICAL_BASE_URL;
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return `https://${raw}`;
}

export function pickDailyOgImage(): (typeof OG_IMAGES)[number] {
  // Deterministic rotation (changes daily, stable within a day) to play nicely with crawlers/caches.
  const day = Math.floor(Date.now() / 86_400_000);
  return OG_IMAGES[day % OG_IMAGES.length];
}

export function buildOgImages(primary: (typeof OG_IMAGES)[number], altText: string): NonNullable<NonNullable<Metadata["openGraph"]>["images"]> {
  const imgs = OG_IMAGES.map((img) => ({
    url: img,
    width: 1200,
    height: 630,
    alt: altText,
    type: "image/png",
  }));

  return [imgs.find((i) => i.url === primary) ?? imgs[0], ...imgs.filter((i) => i.url !== primary)];
}

