import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const raw = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  const baseUrl = (
    raw && (raw.startsWith("http://") || raw.startsWith("https://"))
      ? raw
      : raw
        ? `https://${raw}`
        : "https://creativesforukraine.uk"
  ).replace(/\/$/, "");
  const now = new Date();

  const routes = ["", "/shop"] as const;

  return routes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));
}

