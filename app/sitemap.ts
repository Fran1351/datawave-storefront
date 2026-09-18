import { MetadataRoute } from "next";
import { MOCK_PRODUCTS } from "@/app/data/products";
import { slugify } from "@/app/lib/slugify";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://datawave-storefront-fv8f.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/productos`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/seguimiento`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/cookies`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  const productRoutes: MetadataRoute.Sitemap = MOCK_PRODUCTS.map((product) => ({
    url: `${SITE_URL}/productos/${slugify(product.name)}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes];
}