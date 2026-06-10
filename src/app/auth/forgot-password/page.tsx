"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
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
    <div className="flex min-h-screen items-center justify-center bg-[#000000] p-4 selection:bg-[#ccff00] selection:text-black">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-[#2a2828] p-8 md:p-10 relative">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Відновлення</h1>
          <p className="text-gray-500 font-medium text-sm tracking-wide">Введіть email для скидання паролю</p>
        </div>

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

            <div className="pt-4">
              <button 
                type="submit" 
                className="w-full h-14 flex items-center justify-center bg-[#ccff00] hover:bg-white text-black font-extrabold uppercase text-sm tracking-widest transition-colors rounded-none"
                disabled={loading}
              >
                {loading ? "Обробка..." : "Відправити посилання"}
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link href="/auth/login" className="text-xs font-bold text-gray-500 hover:text-[#ccff00] uppercase tracking-wider transition-colors">
            Повернутися до входу
          </Link>
        </div>
      </div>
    </div>
  );
}
