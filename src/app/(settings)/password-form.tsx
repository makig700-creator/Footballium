"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function PasswordForm() {
  const [isSaving, setIsSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Будь ласка, заповніть всі поля");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Нові паролі не співпадають");
      return;
    }
    if (currentPassword === newPassword) {
      toast.error("Новий пароль не може співпадати з поточним");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Пароль має містити мінімум 6 символів");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/settings/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword
        }),
      });

      if (res.ok) {
        toast.success("Пароль успішно змінено");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const error = await res.text();
        toast.error(error || "Помилка зміни паролю");
      }
    } catch {
      toast.error("Помилка мережі");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-black uppercase tracking-widest mb-6 border-b border-white/10 pb-4">
        Зміна паролю
      </h1>

      <form onSubmit={onSubmit} className="space-y-6 max-w-xl">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Поточний пароль</Label>
            <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="bg-zinc-900 border-white/10 text-white focus-visible:ring-[#CCFF00]" />
          </div>

          <div className="space-y-2">
            <Label>Новий пароль</Label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="bg-zinc-900 border-white/10 text-white focus-visible:ring-[#CCFF00]" />
          </div>

          <div className="space-y-2">
            <Label>Підтвердження нового паролю</Label>
            <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="bg-zinc-900 border-white/10 text-white focus-visible:ring-[#CCFF00]" />
          </div>
        </div>

        <Button
          type="submit"
          onClick={onSubmit}
          disabled={isSaving}
          className="w-full bg-[#CCFF00] text-black hover:bg-[#b3ff00] font-bold uppercase tracking-widest transition-all"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Змінити пароль"}
        </Button>
      </form>
    </div>
  );
}
