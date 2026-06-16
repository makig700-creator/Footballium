import slugify from "slugify";
import { prisma } from "./prisma";

export async function generateSlug(title: string): Promise<string> {
  const baseSlug = slugify(title, {
    lower: true,
    strict: true,
    locale: "uk", // Handle Ukrainian characters appropriately
  });

  let slug = baseSlug;
  let counter = 2;
  let isUnique = false;

  while (!isUnique) {
    const existingNews = await prisma.news.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existingNews) {
      isUnique = true;
    } else {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  return slug;
}
