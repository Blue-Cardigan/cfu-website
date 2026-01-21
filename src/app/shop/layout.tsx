import type { Metadata } from "next";

const CANONICAL_BASE_URL = "https://creativesforukraine.uk";

function getBaseUrl() {
  const raw = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (!raw) return CANONICAL_BASE_URL;
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return `https://${raw}`;
}

export const metadata: Metadata = {
  title: "Shop | Creatives for Ukraine",
  description: "Support Ukraine through art. Shop gifts and merchandise that help fund creatives and humanitarian aid.",
  metadataBase: new URL(getBaseUrl()),
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: "Shop | Creatives for Ukraine",
    description: "Support Ukraine through art. Shop gifts and merchandise that help fund creatives and humanitarian aid.",
    url: "/shop",
    siteName: "Creatives for Ukraine",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop | Creatives for Ukraine",
    description: "Support Ukraine through art. Shop gifts and merchandise that help fund creatives and humanitarian aid.",
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}

