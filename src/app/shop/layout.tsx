import type { Metadata } from "next";
import { buildOgImages, getBaseUrl, pickDailyOgImage, SITE_TITLE } from "@/lib/site";

export function generateMetadata(): Metadata {
  const ogImage = pickDailyOgImage();
  const baseUrl = getBaseUrl();
  const title = `Shop | ${SITE_TITLE}`;
  const description = "Support Ukraine through art. Shop gifts and merchandise that help fund creatives and humanitarian aid.";

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: { canonical: "/shop" },
    openGraph: {
      title,
      description,
      url: "/shop",
      siteName: SITE_TITLE,
      locale: "en_GB",
      type: "website",
      images: buildOgImages(ogImage, SITE_TITLE),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  const baseUrl = getBaseUrl();
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: SITE_TITLE,
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop",
        item: `${baseUrl.replace(/\/$/, "")}/shop`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}

