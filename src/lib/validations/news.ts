import { z } from "zod";

export const createNewsSchema = z.object({
  title: z.string().min(5, "Заголовок повинен містити мінімум 5 символів").max(200, "Заголовок занадто довгий"),
  excerpt: z.string().max(300, "Короткий опис занадто довгий").optional().or(z.literal('')),
  content: z.string().min(20, "Текст новини повинен містити мінімум 20 символів"),
  coverImage: z.string().url("Неправильний формат URL").optional().or(z.literal('')),
});

export type CreateNewsInput = z.infer<typeof createNewsSchema>;

export const createCommentSchema = z.object({
  content: z.string().min(1, "Коментар не може бути порожнім").max(1000, "Коментар занадто довгий"),
  parentId: z.string().optional(),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
