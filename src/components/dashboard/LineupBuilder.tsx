'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { lineupSchema, LineupFormData } from '@/lib/validations/lineup'
import { Save, Loader2, AlertCircle, Plus, Trash2, Shield, Users } from 'lucide-react'
import { formatPosition } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type Player = { id: string; firstName: string; lastName: string; position: string; number: number }

export function LineupBuilder({
  matchId,
  players,
  initialLineup,
}: {
  matchId: string
  players: Player[]
  initialLineup?: LineupFormData
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LineupFormData>({
    resolver: zodResolver(lineupSchema),
    defaultValues: initialLineup || {
      matchId,
      formation: '4-3-3',
      starters: Array(11).fill({ playerId: '', slotLabel: 'POS', order: 0 }).map((s, i) => ({ ...s, order: i })),
      substitutes: [],
    },
  })

  const { fields: starterFields } = useFieldArray({
    control,
    name: 'starters',
  })

  const { fields: subFields, append: appendSub, remove: removeSub } = useFieldArray({
    control,
    name: 'substitutes',
  })

  const formation = watch('formation')

  const onSubmit = async (data: LineupFormData) => {
    setError(null)
    try {
      const res = await fetch(`/api/matches/${matchId}/lineup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        setError(err.error || 'Не вдалося зберегти склад')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError('Сталася непередбачувана помилка')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-sm p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-red-400">{error}</p>
        </div>
      )}

      {/* Settings */}
      <Card className="bg-[#1c1a1a] border-gray-800 rounded-sm shadow-xl">
        <CardHeader className="pb-6 border-b border-gray-900">
          <CardTitle className="text-sm font-black text-white flex items-center gap-3 uppercase tracking-widest">
            <Shield className="w-5 h-5 text-[#CCFF00]" /> Тактика
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="max-w-xs">
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Схема (Формація)</label>
            <select
              {...register('formation')}
              className="block w-full rounded-sm border-0 bg-[#0a0a0a] py-3 px-4 text-white font-bold uppercase tracking-widest text-xs shadow-sm ring-1 ring-inset ring-gray-800 focus:ring-2 focus:ring-inset focus:ring-[#CCFF00]"
            >
              {['4-3-3', '4-4-2', '4-2-3-1', '3-5-2', '5-3-2', '4-5-1'].map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Starting XI */}
        <Card className="bg-[#1c1a1a] border-gray-800 rounded-sm shadow-xl">
          <CardHeader className="pb-6 border-b border-gray-900 mb-6 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-black text-white flex items-center gap-3 uppercase tracking-widest">
              <Users className="w-5 h-5 text-[#CCFF00]" /> Стартовий склад
            </CardTitle>
            <Badge variant="secondary" className="bg-[#CCFF00] text-black font-black uppercase tracking-widest rounded-sm">
              Потрібно 11
            </Badge>
          </CardHeader>
          
          <CardContent className="space-y-4 pt-2">
            {starterFields.map((field, index) => (
              <div key={field.id} className="flex gap-4">
                <Input
                  type="text"
                  {...register(`starters.${index}.slotLabel` as const)}
                  className="w-20 bg-[#0a0a0a] border-gray-800 text-center text-white text-[10px] tracking-widest font-black focus-visible:ring-[#CCFF00] rounded-sm uppercase"
                  placeholder="ПОЗ"
                />
                <select
                  {...register(`starters.${index}.playerId` as const)}
                  className="flex-1 rounded-sm border-0 bg-[#0a0a0a] py-3 px-4 text-white font-bold uppercase tracking-widest text-[10px] ring-1 ring-inset ring-gray-800 focus:ring-2 focus:ring-[#CCFF00]"
                >
                  <option value="">Оберіть гравця...</option>
                  {players.map((p) => (
                    <option key={p.id} value={p.id}>
                      #{p.number} {p.firstName} {p.lastName} ({formatPosition(p.position)})
                    </option>
                  ))}
                </select>
                <input type="hidden" {...register(`starters.${index}.order` as const)} value={index} />
              </div>
            ))}
            {errors.starters?.root && (
              <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 mt-4">{errors.starters.root.message}</p>
            )}
            {/* Root schema refine error for GK */}
            {errors.root && (
              <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 mt-4">{errors.root.message}</p>
            )}
          </CardContent>
        </Card>

        {/* Substitutes */}
        <Card className="bg-[#1c1a1a] border-gray-800 rounded-sm shadow-xl">
          <CardHeader className="pb-6 border-b border-gray-900 mb-6 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-black text-white flex items-center gap-3 uppercase tracking-widest">
              <Users className="w-5 h-5 text-gray-500" /> Запасні
            </CardTitle>
            <Badge variant="outline" className="bg-[#0a0a0a] text-gray-400 font-black uppercase tracking-widest border-gray-800 rounded-sm">
              Макс. 7
            </Badge>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            {subFields.map((field, index) => (
              <div key={field.id} className="flex gap-4 items-center">
                <Input
                  type="text"
                  {...register(`substitutes.${index}.slotLabel` as const)}
                  className="w-20 bg-[#0a0a0a] border-gray-800 text-center text-white text-[10px] tracking-widest font-black focus-visible:ring-[#CCFF00] rounded-sm uppercase"
                  placeholder="ЗАП"
                />
                <select
                  {...register(`substitutes.${index}.playerId` as const)}
                  className="flex-1 rounded-sm border-0 bg-[#0a0a0a] py-3 px-4 text-white font-bold uppercase tracking-widest text-[10px] ring-1 ring-inset ring-gray-800 focus:ring-2 focus:ring-[#CCFF00]"
                >
                  <option value="">Оберіть запасного...</option>
                  {players.map((p) => (
                    <option key={p.id} value={p.id}>
                      #{p.number} {p.firstName} {p.lastName} ({formatPosition(p.position)})
                    </option>
                  ))}
                </select>
                <input type="hidden" {...register(`substitutes.${index}.order` as const)} value={index + 11} />
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => removeSub(index)}
                  className="text-gray-500 hover:text-red-500 hover:bg-gray-900 rounded-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            
            {subFields.length < 7 && (
              <Button
                variant="outline"
                type="button"
                onClick={() => appendSub({ playerId: '', slotLabel: 'ЗАП', order: subFields.length + 11 })}
                className="w-full py-8 border-dashed border-gray-800 bg-transparent text-gray-500 font-black uppercase tracking-widest hover:text-[#CCFF00] hover:border-[#CCFF00] hover:bg-[#CCFF00]/10 rounded-sm"
              >
                <Plus className="w-4 h-4 mr-2" /> Додати запасного
              </Button>
            )}
            
            {errors.substitutes?.root && (
              <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 mt-4">{errors.substitutes.root.message}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end pt-8 border-t border-gray-900">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#CCFF00] hover:bg-[#b3ff00] text-black px-8 py-6 rounded-sm font-black uppercase tracking-widest text-xs"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
          {isSubmitting ? 'Збереження...' : 'Зберегти склад'}
        </Button>
      </div>
    </form>
  )
}
