"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    <div className="w-full">
      {error && (
        <div className="mb-8 p-4 bg-red-950/30 border border-red-900 text-red-500 text-xs font-bold uppercase tracking-wider text-center">
          {error}
        </div>
      )}
      
      {message && (
        <div className="mb-8 p-4 bg-[#ccff00]/10 border border-[#ccff00]/50 text-[#ccff00] text-xs font-bold uppercase tracking-wider text-center">
          {message}
        </div>
      )}

      {!message && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Новий пароль</label>
              <div className="relative">
                <input 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Мін. 6 символів" 
                  required 
                  className="w-full h-12 bg-[#111111] border border-[#2a2828] focus:border-[#ccff00] focus:outline-none text-white px-4 pr-12 text-sm transition-colors rounded-none placeholder:text-gray-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Підтвердження</label>
              <div className="relative">
                <input 
                  name="confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Повторіть пароль" 
                  required 
                  className="w-full h-12 bg-[#111111] border border-[#2a2828] focus:border-[#ccff00] focus:outline-none text-white px-4 pr-12 text-sm transition-colors rounded-none placeholder:text-gray-700"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full h-14 flex items-center justify-center bg-[#ccff00] hover:bg-white text-black font-extrabold uppercase text-sm tracking-widest transition-colors rounded-none"
              disabled={loading}
            >
              {loading ? "Обробка..." : "Зберегти пароль"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#000000] p-4 selection:bg-[#ccff00] selection:text-black">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-[#2a2828] p-8 md:p-10 relative">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Новий пароль</h1>
          <p className="text-gray-500 font-medium text-sm tracking-wide">Створіть надійний пароль</p>
        </div>

        <Suspense fallback={<div className="text-center text-gray-500 text-xs font-bold uppercase tracking-widest">Завантаження...</div>}>
          <ResetPasswordForm />
        </Suspense>

        <div className="mt-8 text-center">
          <Link href="/auth/login" className="text-xs font-bold text-gray-500 hover:text-[#ccff00] uppercase tracking-wider transition-colors">
            Повернутися до входу
          </Link>
        </div>
      </div>
    </div>
  );
}
