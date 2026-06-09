import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Некоректний email"),
  password: z.string().min(6, "Пароль має містити мінімум 6 символів"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Введіть ім'я"),
  email: z.string().email("Некоректний email"),
  password: z.string().min(6, "Мінімум 6 символів"),
  role: z.enum(["USER", "COACH", "REFEREE", "ADMIN"]).default("USER"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Некоректний email"),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, "Мінімум 6 символів"),
});
