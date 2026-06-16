"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createNewsSchema, CreateNewsInput } from "@/lib/validations/news";
import { TiptapEditor } from "./TiptapEditor";
import { ImageUpload } from "./ImageUpload";
import { Save, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface NewsFormProps {
  initialData?: any; // To support editing
}

export function NewsForm({ initialData }: NewsFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const form = useForm<CreateNewsInput>({
    resolver: zodResolver(createNewsSchema),
    defaultValues: {
      title: initialData?.title || "",
      excerpt: initialData?.excerpt || "",
      content: initialData?.content || "",
      coverImage: initialData?.coverImage || "",
    },
  });

  const onSubmit = async (data: CreateNewsInput, isPublish: boolean = false) => {
    try {
      if (isPublish) setIsPublishing(true);
      else setIsSaving(true);

      if (initialData) {
        // Edit mode
        const res = await fetch(`/api/news/admin/${initialData.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error("Failed to update news");

        if (isPublish && initialData.status !== "PUBLISHED") {
          const publishRes = await fetch(`/api/news/admin/${initialData.id}/publish`, {
            method: "POST",
          });
          if (!publishRes.ok) throw new Error("Failed to publish news");
        }
        
        toast.success(isPublish ? "Опубліковано" : "Збережено");
      } else {
        // Create mode
        const res = await fetch("/api/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error("Failed to create news");
        const newNews = await res.json();

        if (isPublish) {
          const publishRes = await fetch(`/api/news/admin/${newNews.id}/publish`, {
            method: "POST",
          });
          if (!publishRes.ok) throw new Error("Failed to publish news");
        }

        toast.success(isPublish ? "Опубліковано" : "Чернетку збережено");
      }

      router.push("/admin/news");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Сталася помилка");
    } finally {
      setIsSaving(false);
      setIsPublishing(false);
    }
  };

  return (
    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Заголовок</label>
            <input
              {...form.register("title")}
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#ccff00] transition-colors"
              placeholder="Введіть заголовок новини"
            />
            {form.formState.errors.title && (
              <p className="text-red-500 text-xs">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Короткий опис</label>
            <textarea
              {...form.register("excerpt")}
              rows={3}
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#ccff00] transition-colors resize-none"
              placeholder="Короткий зміст (необов'язково)"
            />
            {form.formState.errors.excerpt && (
              <p className="text-red-500 text-xs">{form.formState.errors.excerpt.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Текст новини</label>
            <TiptapEditor
              content={form.watch("content")}
              onChange={(html) => form.setValue("content", html, { shouldValidate: true })}
            />
            {form.formState.errors.content && (
              <p className="text-red-500 text-xs">{form.formState.errors.content.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0a0a0a] border border-gray-900 rounded-sm p-6 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-white border-b border-gray-800 pb-4">
              Публікація
            </h3>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Обкладинка</label>
              <ImageUpload
                value={form.watch("coverImage") || ""}
                onChange={(url) => form.setValue("coverImage", url)}
              />
              {form.formState.errors.coverImage && (
                <p className="text-red-500 text-xs">{form.formState.errors.coverImage.message}</p>
              )}
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => form.handleSubmit((data) => onSubmit(data, false))()}
                disabled={isSaving || isPublishing}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                Зберегти чернетку
              </button>
              
              <button
                type="button"
                onClick={() => form.handleSubmit((data) => onSubmit(data, true))()}
                disabled={isSaving || isPublishing}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#ccff00] text-black font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-[#b3e600] transition-colors disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                {initialData?.status === "PUBLISHED" ? "Оновити" : "Опублікувати"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
