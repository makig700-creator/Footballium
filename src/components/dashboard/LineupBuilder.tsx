'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getLineupSchema, LineupFormData } from '@/lib/validations/lineup'
import { Save, Loader2, AlertCircle, Plus, Trash2, Shield, Users, ListChecks } from 'lucide-react'
import { formatPosition } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type Player = { id: string; firstName: string; lastName: string; position: string; number: number }

export function LineupBuilder({
  matchId,
  players,
  initialLineup,
  format = '11x11',
}: {
  matchId: string
  players: Player[]
  initialLineup?: any
  format?: string
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  const isFutsal = format === '5x5'

  const defaultStarters = isFutsal
    ? Array.from({ length: 5 }, (_, i) => ({ playerId: '', slotLabel: '', order: i }))
    : Array.from({ length: 11 }, (_, i) => ({ playerId: '', slotLabel: '', order: i }))

  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LineupFormData>({
    resolver: zodResolver(getLineupSchema(format) as any),
    defaultValues: initialLineup || {
      matchId,
      formation: isFutsal ? '5x5' : '4-3-3',
      starters: defaultStarters,
      substitutes: [],
    },
  })

  const { fields: starterFields, append: appendStarter, remove: removeStarter } = useFieldArray({
    control,
    name: 'starters',
  })

  const { fields: subFields, append: appendSub, remove: removeSub } = useFieldArray({
    control,
    name: 'substitutes',
  })

  const onSubmit = async (data: LineupFormData) => {
    setError(null)
    setSuccess(false)
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

      setSuccess(true)
      router.refresh()
      setTimeout(() => setSuccess(false), 4000)
    } catch {
      setError('Сталася непередбачувана помилка')
    }
  }

  const validationMessages: string[] = []
  if (errors.root?.message) validationMessages.push(errors.root.message)
  if (errors.starters?.message) validationMessages.push(errors.starters.message as string)
  if ((errors.starters as any)?.root?.message) validationMessages.push((errors.starters as any).root.message)
  if (Array.isArray(errors.starters)) {
    errors.starters.forEach((err: any, i: number) => {
      if (err?.playerId?.message) validationMessages.push(`Рядок ${i + 1}: ${err.playerId.message}`)
      if (err?.slotLabel?.message) validationMessages.push(`Рядок ${i + 1}: ${err.slotLabel.message}`)
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <input type="hidden" {...register('matchId')} />
      <input type="hidden" {...register('formation')} />

      {success && (
        <div className="bg-[#CCFF00]/10 border border-[#CCFF00]/30 rounded-sm p-4 flex items-start gap-3">
          <Save className="w-5 h-5 text-[#CCFF00] shrink-0 mt-0.5" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#CCFF00]">Заявку на матч успішно збережено!</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-sm p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-red-400">{error}</p>
        </div>
      )}

      {!isFutsal && (
        <Card className="bg-[#1c1a1a] border-gray-800 rounded-sm shadow-xl">
          <CardHeader className="pb-6 border-b border-gray-900">
            <CardTitle className="text-sm font-black text-white flex items-center gap-3 uppercase tracking-widest">
              <Shield className="w-5 h-5 text-[#CCFF00]" /> Тактика
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="max-w-xs">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Схема (Формація)</label>
              <Controller
                name="formation"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="block w-full rounded-sm border-0 bg-[#0a0a0a] py-3 px-4 text-white font-bold uppercase tracking-widest text-xs shadow-sm ring-1 ring-inset ring-gray-800 focus:ring-2 focus:ring-inset focus:ring-[#CCFF00]"
                  >
                    {['4-3-3', '4-4-2', '4-2-3-1', '3-5-2', '5-3-2', '4-5-1'].map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                )}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <div className={`grid grid-cols-1 ${!isFutsal ? 'lg:grid-cols-2' : ''} gap-8`}>
        <Card className="bg-[#1c1a1a] border-gray-800 rounded-sm shadow-xl">
          <CardHeader className="pb-6 border-b border-gray-900 mb-6 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-black text-white flex items-center gap-3 uppercase tracking-widest">
              {isFutsal ? (
                <><ListChecks className="w-5 h-5 text-[#CCFF00]" /> Заявка на матч</>
              ) : (
                <><Users className="w-5 h-5 text-[#CCFF00]" /> Стартовий склад</>
              )}
            </CardTitle>
            <Badge variant="secondary" className="bg-[#CCFF00] text-black font-black uppercase tracking-widest rounded-sm">
              {isFutsal ? 'Від 5 до 14' : 'Потрібно 11'}
            </Badge>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            {starterFields.map((field, index) => (
              <div key={field.id} className="flex gap-3 items-center">
                <Controller
                  name={`starters.${index}.slotLabel`}
                  control={control}
                  render={({ field: f }) => (
                    <input
                      {...f}
                      type="text"
                      placeholder={isFutsal ? '№' : 'ПОЗ'}
                      title={isFutsal ? 'Ігровий номер на цей матч' : 'Позиція'}
                      className="w-20 bg-[#0a0a0a] border border-gray-800 rounded-sm text-center text-white text-[10px] tracking-widest font-black py-3 px-2 focus:outline-none focus:ring-2 focus:ring-[#CCFF00] uppercase"
                    />
                  )}
                />

                {/* Player select — controlled via Controller */}
                <Controller
                  name={`starters.${index}.playerId`}
                  control={control}
                  render={({ field: f }) => (
                    <select
                      value={f.value}
                      onChange={(e) => {
                        f.onChange(e.target.value)
                        if (isFutsal && !field.slotLabel) {
                          const player = players.find(p => p.id === e.target.value)
                          if (player) {
                            setValue(`starters.${index}.slotLabel`, player.number.toString())
                          }
                        }
                      }}
                      onBlur={f.onBlur}
                      name={f.name}
                      ref={f.ref}
                      className="flex-1 rounded-sm border-0 bg-[#0a0a0a] py-3 px-4 text-white font-bold uppercase tracking-widest text-[10px] ring-1 ring-inset ring-gray-800 focus:ring-2 focus:ring-[#CCFF00]"
                    >
                      <option value="">Оберіть гравця...</option>
                      {players.map((p) => (
                        <option key={p.id} value={p.id}>
                          #{p.number} {p.firstName} {p.lastName} ({formatPosition(p.position)})
                        </option>
                      ))}
                    </select>
                  )}
                />

                <Controller
                  name={`starters.${index}.order`}
                  control={control}
                  render={({ field: f }) => <input type="hidden" {...f} value={index} />}
                />

                {isFutsal && starterFields.length > 5 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => removeStarter(index)}
                    className="text-gray-500 hover:text-red-500 hover:bg-gray-900 rounded-sm flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}

            {isFutsal && starterFields.length < 14 && (
              <Button
                variant="outline"
                type="button"
                onClick={() => appendStarter({ playerId: '', slotLabel: '', order: starterFields.length })}
                className="w-full py-8 border-dashed border-gray-800 bg-transparent text-gray-500 font-black uppercase tracking-widest hover:text-[#CCFF00] hover:border-[#CCFF00] hover:bg-[#CCFF00]/10 rounded-sm"
              >
                <Plus className="w-4 h-4 mr-2" /> Додати гравця до заявки
              </Button>
            )}

            {validationMessages.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-sm p-4 flex flex-col gap-2 mt-4">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-red-400">Помилки валідації:</p>
                </div>
                {validationMessages.map((msg, i) => (
                  <p key={i} className="text-[10px] font-bold uppercase tracking-widest text-red-500">• {msg}</p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {!isFutsal && (
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
                <div key={field.id} className="flex gap-3 items-center">
                  <Controller
                    name={`substitutes.${index}.slotLabel`}
                    control={control}
                    render={({ field: f }) => (
                      <input
                        {...f}
                        type="text"
                        placeholder="ЗАП"
                        className="w-20 bg-[#0a0a0a] border border-gray-800 rounded-sm text-center text-white text-[10px] tracking-widest font-black py-3 px-2 focus:outline-none focus:ring-2 focus:ring-[#CCFF00] uppercase"
                      />
                    )}
                  />
                  <Controller
                    name={`substitutes.${index}.playerId`}
                    control={control}
                    render={({ field: f }) => (
                      <select
                        value={f.value}
                        onChange={(e) => f.onChange(e.target.value)}
                        onBlur={f.onBlur}
                        name={f.name}
                        ref={f.ref}
                        className="flex-1 rounded-sm border-0 bg-[#0a0a0a] py-3 px-4 text-white font-bold uppercase tracking-widest text-[10px] ring-1 ring-inset ring-gray-800 focus:ring-2 focus:ring-[#CCFF00]"
                      >
                        <option value="">Оберіть запасного...</option>
                        {players.map((p) => (
                          <option key={p.id} value={p.id}>
                            #{p.number} {p.firstName} {p.lastName} ({formatPosition(p.position)})
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  <Controller
                    name={`substitutes.${index}.order`}
                    control={control}
                    render={({ field: f }) => <input type="hidden" {...f} value={index + 11} />}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => removeSub(index)}
                    className="text-gray-500 hover:text-red-500 hover:bg-gray-900 rounded-sm flex-shrink-0"
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
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex justify-end pt-8 border-t border-gray-900">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#CCFF00] hover:bg-[#b3ff00] text-black px-8 py-6 rounded-sm font-black uppercase tracking-widest text-xs"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
          {isSubmitting ? 'Збереження...' : 'Зберегти заявку'}
        </Button>
      </div>
    </form>
  )
}
