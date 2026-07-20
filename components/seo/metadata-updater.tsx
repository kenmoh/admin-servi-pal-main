"use client";

import { useEffect } from "react";

interface PageMetadata {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
}

export function MetadataUpdater({
  title,
  description,
  canonical,
  ogImage,
}: PageMetadata) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://admin.servi-pal.com";

  useEffect(() => {
    // Update document title
    document.title = `${title} | ServiPal Admin`;

    // Update or create meta tags
    const updateMeta = (name: string, content: string, property = false) => {
      const attributeName = property ? "property" : "name";
      let element = document.querySelector(
        `meta[${attributeName}="${name}"]`,
      ) as HTMLMetaElement;

      if (element) {
        element.setAttribute("content", content);
      } else {
        element = document.createElement("meta");
        element.setAttribute(attributeName, name);
        element.setAttribute("content", content);
        document.head.appendChild(element);
      }
    };

    // Basic meta tags
    updateMeta("description", description);

    // Open Graph
    updateMeta("og:title", `${title} | ServiPal Admin`, true);
    updateMeta("og:description", description, true);
    updateMeta("og:type", "website", true);
    updateMeta("og:url", canonical || siteUrl, true);
    if (ogImage) {
      updateMeta("og:image", ogImage, true);
    }

    // Twitter
    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:title", `${title} | ServiPal Admin`);
    updateMeta("twitter:description", description);
    if (ogImage) {
      updateMeta("twitter:image", ogImage);
    }

    // Canonical URL
    if (canonical) {
      let canonicalLink = document.querySelector(
        'link[rel="canonical"]',
      ) as HTMLLinkElement;
      if (canonicalLink) {
        canonicalLink.setAttribute("href", canonical);
      } else {
        canonicalLink = document.createElement("link");
        canonicalLink.setAttribute("rel", "canonical");
        canonicalLink.setAttribute("href", canonical);
        document.head.appendChild(canonicalLink);
      }
    }
  }, [title, description, canonical, ogImage, siteUrl]);

  return null;
}
