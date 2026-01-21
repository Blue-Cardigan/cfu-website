import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const raw = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  const baseUrl =
    raw && (raw.startsWith("http://") || raw.startsWith("https://"))
      ? raw
      : raw
        ? `https://${raw}`
        : "https://creativesforukraine.uk";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${baseUrl.replace(/\/$/, "")}/sitemap.xml`,
  };
}

