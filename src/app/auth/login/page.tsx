"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Невірний email або пароль");
        return;
      }

      if (res?.ok) {
        // Fetch session to get the role
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        
        const role = sessionData?.user?.role || "USER";
        const roleRoutes: Record<string, string> = {
          ADMIN: "/admin/dashboard",
          COACH: "/dashboard",
          REFEREE: "/dashboard",
          USER: "/"
        };
        router.push(roleRoutes[role] || "/");
        router.refresh();
      } else {
        setError("Невірний email або пароль");
      }
    } catch (err) {
      setError("Невірний email або пароль");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#000000] p-4 selection:bg-[#ccff00] selection:text-black">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-[#2a2828] p-8 md:p-10 relative">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Вхід</h1>
          <p className="text-gray-500 font-medium text-sm tracking-wide">Повернення до Footballium</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-950/30 border border-red-900 text-red-500 text-xs font-bold uppercase tracking-wider text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Email</label>
              <input 
                name="email" 
                type="email" 
                placeholder="name@example.com" 
                required 
                className="w-full h-12 bg-[#111111] border border-[#2a2828] focus:border-[#ccff00] focus:outline-none text-white px-4 text-sm transition-colors rounded-none placeholder:text-gray-700"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Пароль</label>
                <Link href="/auth/forgot-password" className="text-[10px] font-bold text-gray-500 hover:text-[#ccff00] uppercase tracking-wider transition-colors">
                  Забули пароль?
                </Link>
              </div>
              <div className="relative">
                <input 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Ваш пароль" 
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
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full h-14 flex items-center justify-center bg-[#ccff00] hover:bg-white text-black font-extrabold uppercase text-sm tracking-widest transition-colors rounded-none"
              disabled={loading}
            >
              {loading ? "Обробка..." : "Увійти"}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <Link href="/auth/register" className="text-xs font-bold text-gray-500 hover:text-[#ccff00] uppercase tracking-wider transition-colors">
            Немає акаунту? Створити
          </Link>
        </div>
      </div>
    </div>
  );
}
