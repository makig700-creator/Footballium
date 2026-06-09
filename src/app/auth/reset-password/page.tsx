"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Паролі не співпадають");
      setLoading(false);
      return;
    }

    if (!token) {
      setError("Недійсне посилання");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Пароль успішно змінено. Ви можете увійти.");
        setTimeout(() => router.push("/auth/login"), 2000);
      } else {
        setError(data.error || "Сталася помилка");
      }
    } catch (err) {
      setError("Помилка підключення");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardContent>
      {error && <p className="mb-4 text-sm text-destructive text-center">{error}</p>}
      {message && <p className="mb-4 text-sm text-green-500 text-center">{message}</p>}
      {!message && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="password" type="password" placeholder="Новий пароль" required />
          <Input name="confirmPassword" type="password" placeholder="Підтвердіть новий пароль" required />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Зачекайте..." : "Зберегти пароль"}
          </Button>
        </form>
      )}
    </CardContent>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Створення нового паролю</CardTitle>
        </CardHeader>
        <Suspense fallback={<CardContent><p className="text-center">Завантаження...</p></CardContent>}>
          <ResetPasswordForm />
        </Suspense>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          <Link href="/auth/login" className="hover:text-primary transition-colors">
            Повернутися до входу
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
