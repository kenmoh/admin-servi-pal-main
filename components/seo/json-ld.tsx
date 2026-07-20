interface JsonLdProps {
  type?: string;
  name: string;
  description: string;
  url: string;
  image?: string;
  sameAs?: string[];
}

export function OrganizationJsonLd({
  name = "ServiPal",
  description = "Multi-vendor lifestyle application for delivery, food ordering, laundry services, and P2P marketplace.",
  url,
  image,
  sameAs = [],
}: Omit<JsonLdProps, "type">) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    description,
    url,
    ...(image && { logo: image }),
    ...(sameAs.length > 0 && { sameAs }),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "support@servi-pal.com",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebSiteJsonLd({
  name = "ServiPal",
  description = "Multi-vendor lifestyle application for delivery, food ordering, laundry services, and P2P marketplace.",
  url,
  image,
}: Omit<JsonLdProps, "type">) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    description,
    url,
    ...(image && { image }),
    potentialAction: {
      "@type": "SearchAction",
      target: `${url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function SoftwareApplicationJsonLd({
  name = "ServiPal",
  description = "Multi-vendor lifestyle application for delivery, food ordering, laundry services, and P2P marketplace.",
  url,
  image,
}: Omit<JsonLdProps, "type">) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    ...(image && { image }),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "NGN",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
