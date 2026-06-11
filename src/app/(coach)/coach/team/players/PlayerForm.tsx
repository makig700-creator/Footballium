'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createPlayerSchema } from '@/lib/validations/player'
import { Loader2, Upload, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Image from 'next/image'

export function PlayerForm({ initialData, teamId }: { initialData?: any, teamId: string }) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string>(initialData?.photo || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<z.infer<typeof createPlayerSchema>>({
    resolver: zodResolver(createPlayerSchema),
    defaultValues: initialData || { position: 'MIDFIELDER' },
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (res.ok) {
        const data = await res.json()
        setValue('photo', data.url)
        setPhotoPreview(data.url)
      } else {
        alert('Помилка завантаження')
      }
    } catch (err) {
      alert('Помилка завантаження')
    } finally {
      setIsUploading(false)
    }
  }

  const onSubmit = async (data: z.infer<typeof createPlayerSchema>) => {
    setIsSaving(true)
    try {
      const url = initialData ? `/api/teams/${teamId}/players/${initialData.id}` : `/api/teams/${teamId}/players`
      const method = initialData ? 'PATCH' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Помилка збереження')
      }
      
      router.push('/coach/team')
      router.refresh()
    } catch (error: any) {
      alert(error.message)
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
            {photoPreview ? (
              <>
                <Image src={photoPreview} alt="Photo" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Upload className="w-6 h-6 text-white" />
                </div>
              </>
            ) : (
              <div className="text-center p-4">
                {isUploading ? <Loader2 className="w-8 h-8 text-[#CCFF00] animate-spin mx-auto" /> : <Upload className="w-8 h-8 text-gray-600 mb-2 mx-auto group-hover:text-[#CCFF00] transition-colors" />}
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block">Завантажити фото</span>
              </div>
            )}
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          {photoPreview && (
            <button 
              type="button" 
              onClick={() => { setPhotoPreview(''); setValue('photo', '') }}
              className="mt-4 text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-400 flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" /> Видалити
            </button>
          )}
        </div>

        <div className="w-full md:w-2/3 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Ім'я *</label>
              <Input {...register('firstName')} className="bg-[#0a0a0a] border-gray-800 text-white focus-visible:ring-[#CCFF00]" />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Прізвище *</label>
              <Input {...register('lastName')} className="bg-[#0a0a0a] border-gray-800 text-white focus-visible:ring-[#CCFF00]" />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Позиція *</label>
              <select {...register('position')} className="flex h-10 w-full rounded-sm border border-gray-800 bg-[#0a0a0a] px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CCFF00]">
                <option value="GOALKEEPER">Воротар</option>
                <option value="DEFENDER">Захисник</option>
                <option value="MIDFIELDER">Півзахисник</option>
                <option value="FORWARD">Нападник</option>
              </select>
              {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Номер *</label>
              <Input type="number" {...register('number', { valueAsNumber: true })} className="bg-[#0a0a0a] border-gray-800 text-white focus-visible:ring-[#CCFF00]" />
              {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Вік</label>
            <Input type="number" {...register('age', { valueAsNumber: true })} className="bg-[#0a0a0a] border-gray-800 text-white focus-visible:ring-[#CCFF00]" />
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
