import { prisma } from "@/lib/prisma";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_URL!;

  const cars = await prisma.car.findMany({
    select: {
      id: true,
      updatedAt: true,
    },
  });

  const carsUrls: MetadataRoute.Sitemap = cars.map((i) => ({
    url: `${baseUrl}/cars/${i.id}`,
    lastModified: new Date(i.updatedAt),
    changeFrequency: "monthly",
    priority: 1,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },

    ...carsUrls,
  ];
}
