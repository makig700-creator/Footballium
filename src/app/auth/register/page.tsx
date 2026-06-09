"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Shield, Trophy, Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState("USER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Паролі не співпадають");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (res.ok) {
        // Automatically log in
        const signInRes = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (signInRes?.ok) {
          const sessionRes = await fetch("/api/auth/session");
          const sessionData = await sessionRes.json();
          const userRole = sessionData?.user?.role || "USER";
          
          const roleRoutes: Record<string, string> = {
            ADMIN: "/admin/dashboard",
            COACH: "/dashboard",
            REFEREE: "/dashboard",
            USER: "/"
          };
          router.push(roleRoutes[userRole] || "/");
          router.refresh();
        } else {
          router.push("/auth/login");
        }
      } else {
        const data = await res.json();
        setError(data.error || "Сталася помилка при реєстрації");
      }
    } catch (err) {
      setError("Помилка підключення");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: "USER", label: "Вболівальник", icon: User },
    { id: "COACH", label: "Тренер", icon: Shield },
    { id: "REFEREE", label: "Суддя", icon: Trophy },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#000000] p-4 selection:bg-[#ccff00] selection:text-black">
      <div className="w-full max-w-xl bg-[#0a0a0a] border border-[#2a2828] p-8 md:p-10 relative">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Реєстрація</h1>
          <p className="text-gray-500 font-medium text-sm tracking-wide">Долучайтесь до Footballium</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-950/30 border border-red-900 text-red-500 text-xs font-bold uppercase tracking-wider text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Ім'я</label>
                <input 
                  name="name" 
                  placeholder="Ваше ім'я" 
                  required 
                  className="w-full h-12 bg-[#111111] border border-[#2a2828] focus:border-[#ccff00] focus:outline-none text-white px-4 text-sm transition-colors rounded-none placeholder:text-gray-700"
                />
              </div>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Пароль</label>
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
          </div>
          
          <div className="pt-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 block">Оберіть вашу роль</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {roles.map((r) => {
                const isSelected = role === r.id;
                const Icon = r.icon;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`flex flex-col items-center justify-center p-4 border transition-colors ${
                      isSelected 
                        ? "bg-[#ccff00]/10 border-[#ccff00] text-[#ccff00]" 
                        : "bg-[#111111] border-[#2a2828] text-gray-400 hover:border-gray-600 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-2" />
                    <span className="text-[11px] font-black uppercase tracking-widest">
                      {r.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              className="w-full h-14 flex items-center justify-center bg-[#ccff00] hover:bg-white text-black font-extrabold uppercase text-sm tracking-widest transition-colors rounded-none"
              disabled={loading}
            >
              {loading ? "Обробка..." : "Створити акаунт"}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <Link href="/auth/login" className="text-xs font-bold text-gray-500 hover:text-[#ccff00] uppercase tracking-wider transition-colors">
            Вже є акаунт? Увійти
          </Link>
        </div>
      </div>
    </div>
  );
}
