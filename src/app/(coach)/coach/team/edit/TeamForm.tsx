'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createTeamSchema } from '@/lib/validations/team'
import { Loader2, Upload, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Image from 'next/image'

export function TeamForm({ initialData }: { initialData: any }) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string>(initialData?.logo || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<z.infer<typeof createTeamSchema>>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: initialData || { founded: new Date().getFullYear(), shortName: 'ТМ', stadium: 'Невідомо' },
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'teams')
    
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (res.ok) {
        const data = await res.json()
        setValue('logo', data.url)
        setLogoPreview(data.url)
      } else {
        alert('Помилка завантаження')
      }
    } catch (err) {
      alert('Помилка завантаження')
    } finally {
      setIsUploading(false)
    }
  }

  const onSubmit = async (data: z.infer<typeof createTeamSchema>) => {
    setIsSaving(true)
    try {
      const url = initialData ? `/api/teams/${initialData.id}` : '/api/teams'
      const method = initialData ? 'PATCH' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (!res.ok) {
        throw new Error('Помилка збереження')
      }
      
      router.push('/coach/team')
      router.refresh()
    } catch (error) {
      alert('Помилка збереження')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-[#1c1a1a] p-8 border border-[#2a2828] rounded-sm">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <div 
            className="w-40 h-40 rounded-sm bg-[#0a0a0a] border-2 border-dashed border-gray-800 flex flex-col items-center justify-center cursor-pointer hover:border-[#CCFF00] transition-colors relative overflow-hidden group"
            onClick={() => fileInputRef.current?.click()}
          >
            {logoPreview ? (
              <>
                <Image src={logoPreview} alt="Logo" fill className="object-contain p-2" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Upload className="w-6 h-6 text-white" />
                </div>
              </>
            ) : (
              <div className="text-center p-4">
                {isUploading ? <Loader2 className="w-8 h-8 text-[#CCFF00] animate-spin mx-auto" /> : <Upload className="w-8 h-8 text-gray-600 mb-2 mx-auto group-hover:text-[#CCFF00] transition-colors" />}
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block">Завантажити лого</span>
              </div>
            )}
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          {logoPreview && (
            <button 
              type="button" 
              onClick={() => { setLogoPreview(''); setValue('logo', '') }}
              className="mt-4 text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-400 flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" /> Видалити
            </button>
          )}
        </div>

        <div className="w-full md:w-2/3 space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Назва команди *</label>
            <Input {...register('name')} className="bg-[#0a0a0a] border-gray-800 text-white focus-visible:ring-[#CCFF00]" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Місто *</label>
              <Input {...register('city')} className="bg-[#0a0a0a] border-gray-800 text-white focus-visible:ring-[#CCFF00]" />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Коротка назва</label>
              <Input {...register('shortName')} className="bg-[#0a0a0a] border-gray-800 text-white focus-visible:ring-[#CCFF00]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Стадіон</label>
              <Input {...register('stadium')} className="bg-[#0a0a0a] border-gray-800 text-white focus-visible:ring-[#CCFF00]" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Рік заснування</label>
              <Input type="number" {...register('founded', { valueAsNumber: true })} className="bg-[#0a0a0a] border-gray-800 text-white focus-visible:ring-[#CCFF00]" />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Опис команди</label>
            <textarea 
              {...register('description')} 
              className="flex min-h-[80px] w-full rounded-sm border border-gray-800 bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CCFF00] disabled:cursor-not-allowed disabled:opacity-50"
              rows={4}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 border-t border-gray-800 pt-6">
        <button 
          type="button" 
          onClick={() => router.back()}
          className="px-6 py-3 rounded-sm border border-gray-700 text-white font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors"
        >
          Скасувати
        </button>
        <button 
          type="submit" 
          disabled={isSaving || isUploading}
          className="flex items-center gap-2 px-6 py-3 rounded-sm bg-[#CCFF00] text-black font-black text-xs uppercase tracking-widest hover:bg-[#b3e600] transition-colors disabled:opacity-50"
        >
          {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
          Зберегти
        </button>
      </div>
    </form>
  )
}
