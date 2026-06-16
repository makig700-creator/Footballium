"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { User, Upload, Loader2 } from "lucide-react";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
  photo: string | null;
  phone: string | null;
  refereeCategory: string | null;
}

export function ProfileForm() {
  const { update } = useSession();
  const [data, setData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { setValue, watch } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      refereeCategory: "",
    }
  });

  const photo = watch("photo") as string | undefined;

  useEffect(() => {
    fetch("/api/settings/profile")
      .then(res => res.json())
      .then(d => {
        setData(d);
        setValue("name", d.name || "");
        setValue("phone", d.phone || "");
        setValue("photo" as any, d.photo);
        if (d.role === "REFEREE") {
          setValue("refereeCategory", d.refereeCategory || "");
        }
        setIsLoading(false);
      })
      .catch(() => {
        toast.error("Помилка завантаження профілю");
        setIsLoading(false);
      });
  }, [setValue]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "avatars");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setValue("photo" as any, data.url);
        toast.success("Фото завантажено");
      }
    } catch {
      toast.error("Помилка завантаження фото");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    let cleaned = val.replace(/[^\d+]/g, '');
    
    if (cleaned.indexOf('+') > 0) {
      cleaned = cleaned.replace(/\+/g, '');
      cleaned = '+' + cleaned;
    }

    if (!cleaned) {
      setValue("phone", "");
      return;
    }

    if (cleaned.length === 1 && cleaned !== '+') {
      if (cleaned === '0') cleaned = '+380';
      else if (cleaned === '3') cleaned = '+3';
      else cleaned = '+380' + cleaned;
    } else if (cleaned.length > 1 && !cleaned.startsWith('+')) {
      if (cleaned.startsWith('380')) cleaned = '+' + cleaned;
      else if (cleaned.startsWith('0')) cleaned = '+38' + cleaned;
      else cleaned = '+380' + cleaned;
    }

    cleaned = cleaned.substring(0, 13);
    setValue("phone", cleaned);
  };

  const onSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    
    let currentPhone = watch("phone") || "";
    if (currentPhone) {
      const phoneRegex = /^\+380\d{9}$/;
      if (!phoneRegex.test(currentPhone)) {
        toast.error("Введіть коректний номер телефону України (формат: +380XXXXXXXXX)");
        return;
      }
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: watch("name"),
          phone: currentPhone,
          refereeCategory: watch("refereeCategory"),
          photo: photo
        }),
      });

      if (res.ok) {
        const updatedData = await res.json();
        setData(updatedData);
        await update({ name: updatedData.name, picture: updatedData.photo });
        toast.success("Профіль оновлено");
      } else {
        toast.error("Помилка оновлення");
      }
    } catch {
      toast.error("Помилка мережі");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !data) return <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-[#CCFF00]" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-black uppercase tracking-widest mb-6 border-b border-white/10 pb-4">
        Мій Профіль
      </h1>

      <form onSubmit={onSubmit} className="space-y-6 max-w-xl">
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 rounded-full border border-white/10 bg-zinc-900 flex items-center justify-center overflow-hidden shrink-0">
            {photo ? (
              <img src={photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-zinc-500" />
            )}

            <label className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
              <Upload className="w-6 h-6 text-white" />
              <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={isUploading} />
            </label>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">{data.name}</h3>
            <p className="text-zinc-400 text-sm">{data.email}</p>
            {data.phone && <p className="text-zinc-400 text-sm">{data.phone}</p>}
            <div className="mt-1 inline-flex px-2 py-0.5 rounded text-xs font-bold uppercase bg-[#CCFF00]/10 text-[#CCFF00]">
              {data.role}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Ім'я</Label>
            <Input value={watch("name")} onChange={(e) => setValue("name", e.target.value)} className="bg-zinc-900 border-white/10 text-white focus-visible:ring-[#CCFF00]" />
          </div>

          <div className="space-y-2">
            <Label>Телефон</Label>
            <Input 
              value={watch("phone")} 
              onChange={handlePhoneChange} 
              placeholder="+380XXXXXXXXX"
              className="bg-zinc-900 border-white/10 text-white focus-visible:ring-[#CCFF00]" 
            />
          </div>

          {data.role === "REFEREE" && (
            <div className="space-y-2">
              <Label>Категорія судді</Label>
              <Select
                value={watch("refereeCategory")}
                onValueChange={(val) => setValue("refereeCategory", val)}
              >
                <SelectTrigger className="bg-zinc-900 border-white/10 text-white focus:ring-[#CCFF00]">
                  <SelectValue placeholder="Оберіть категорію" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                  <SelectItem value="FIFA">FIFA</SelectItem>
                  <SelectItem value="UEFA">UEFA</SelectItem>
                  <SelectItem value="Національна">Національна</SelectItem>
                  <SelectItem value="Регіональна">Регіональна</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <Button
          type="submit"
          onClick={onSubmit}
          disabled={isSaving || isUploading}
          className="w-full bg-[#CCFF00] text-black hover:bg-[#b3ff00] font-bold uppercase tracking-widest transition-all"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Зберегти зміни"}
        </Button>
      </form>
    </div>
  );
}
