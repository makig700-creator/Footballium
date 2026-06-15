"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createTournamentSchema } from "@/lib/validations/tournament"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { uk } from "date-fns/locale/uk"
import { CalendarIcon, Loader2, Trophy, FileText, Users, Calendar as CalendarIconSVG } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"

export function TournamentForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof createTournamentSchema>>({
    resolver: zodResolver(createTournamentSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      logo: "",
      bracketType: "ROUND_ROBIN",
      format: "11x11",
      maxTeams: 16,
      minTeams: 4,
    } as any,
  })

  async function onSubmit(values: z.infer<typeof createTournamentSchema>) {
    setIsLoading(true)
    try {
      const res = await fetch("/api/tournaments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Failed to create tournament")
      }

      const newTournament = await res.json()

      toast.success("Турнір успішно створено")
      router.push(`/admin/tournaments/${newTournament.id}`)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300 font-medium flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#CCFF00]" />
                Назва турніру
              </FormLabel>
              <FormControl>
                <Input placeholder="Наприклад: Ліга Чемпіонів 2024" className="bg-[#111111]/80 border-gray-800/80 text-white focus-visible:ring-1 focus-visible:ring-[#CCFF00]/50 focus-visible:border-[#CCFF00] h-12" {...field} />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300 font-medium flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#CCFF00]" />
                Опис (опціонально)
              </FormLabel>
              <FormControl>
                <Input placeholder="Короткий опис турніру" className="bg-[#111111]/80 border-gray-800/80 text-white focus-visible:ring-1 focus-visible:ring-[#CCFF00]/50 focus-visible:border-[#CCFF00] h-12" {...field} />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="bracketType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300 font-medium">Тип сітки</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-[#111111]/80 border-gray-800/80 text-white focus:ring-1 focus:ring-[#CCFF00]/50 h-12">
                      <span className="truncate">
                        {field.value === 'ROUND_ROBIN' 
                          ? 'Круговий турнір' 
                          : field.value === 'SINGLE_ELIMINATION' 
                          ? 'На вибування' 
                          : 'Виберіть тип сітки'}
                      </span>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-[#111111] border-gray-800 text-white">
                    <SelectItem value="ROUND_ROBIN" className="focus:bg-[#CCFF00]/20 focus:text-white">Круговий турнір</SelectItem>
                    <SelectItem value="SINGLE_ELIMINATION" className="focus:bg-[#CCFF00]/20 focus:text-white">На вибування</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="format"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300 font-medium">Формат турніру</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-[#111111]/80 border-gray-800/80 text-white focus:ring-1 focus:ring-[#CCFF00]/50 h-12">
                      <SelectValue placeholder="Виберіть формат" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-[#111111] border-gray-800 text-white">
                    <SelectItem value="5x5" className="focus:bg-[#CCFF00]/20 focus:text-white">5x5</SelectItem>
                    <SelectItem value="8x8" className="focus:bg-[#CCFF00]/20 focus:text-white">8x8</SelectItem>
                    <SelectItem value="11x11" className="focus:bg-[#CCFF00]/20 focus:text-white">11x11</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="minTeams"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 font-medium flex items-center gap-1"><Users className="w-3 h-3 text-gray-400" /> Мін.</FormLabel>
                  <FormControl>
                    <Input type="number" className="bg-[#111111]/80 border-gray-800/80 text-white focus-visible:ring-1 focus-visible:ring-[#CCFF00]/50 h-12 text-center" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxTeams"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 font-medium flex items-center gap-1"><Users className="w-3 h-3 text-gray-400" /> Макс.</FormLabel>
                  <FormControl>
                    <Input type="number" className="bg-[#111111]/80 border-gray-800/80 text-white focus-visible:ring-1 focus-visible:ring-[#CCFF00]/50 h-12 text-center" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="registrationDeadline"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-gray-300 font-medium flex items-center gap-2">
                  <CalendarIconSVG className="w-4 h-4 text-[#CCFF00]" />
                  Кінець реєстрації
                </FormLabel>
                <Popover>
                  <FormControl>
                    <PopoverTrigger render={
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal bg-[#111111]/80 border-gray-800/80 text-white hover:bg-[#1a1a1a] hover:text-white h-12 focus:ring-1 focus:ring-[#CCFF00]/50",
                          !field.value && "text-muted-foreground"
                        )}
                      />
                    }>
                      {field.value ? (
                        format(field.value, "PPP", { locale: uk })
                      ) : (
                        <span>Оберіть дату</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </PopoverTrigger>
                  </FormControl>
                  <PopoverContent className="w-auto p-0 bg-[#111111] border-gray-800 text-white" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-gray-300 font-medium flex items-center gap-2">
                  <CalendarIconSVG className="w-4 h-4 text-[#CCFF00]" />
                  Початок турніру
                </FormLabel>
                <Popover>
                  <FormControl>
                    <PopoverTrigger render={
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal bg-[#111111]/80 border-gray-800/80 text-white hover:bg-[#1a1a1a] hover:text-white h-12 focus:ring-1 focus:ring-[#CCFF00]/50",
                          !field.value && "text-muted-foreground"
                        )}
                      />
                    }>
                      {field.value ? (
                        format(field.value, "PPP", { locale: uk })
                      ) : (
                        <span>Оберіть дату</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </PopoverTrigger>
                  </FormControl>
                  <PopoverContent className="w-auto p-0 bg-[#111111] border-gray-800 text-white" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-gray-300 font-medium flex items-center gap-2">
                  <CalendarIconSVG className="w-4 h-4 text-[#CCFF00]" />
                  Кінець турніру
                </FormLabel>
                <Popover>
                  <FormControl>
                    <PopoverTrigger render={
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal bg-[#111111]/80 border-gray-800/80 text-white hover:bg-[#1a1a1a] hover:text-white h-12 focus:ring-1 focus:ring-[#CCFF00]/50",
                          !field.value && "text-muted-foreground"
                        )}
                      />
                    }>
                      {field.value ? (
                        format(field.value, "PPP", { locale: uk })
                      ) : (
                        <span>Оберіть дату</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </PopoverTrigger>
                  </FormControl>
                  <PopoverContent className="w-auto p-0 bg-[#111111] border-gray-800 text-white" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-[#CCFF00] text-black hover:bg-[#b3e600] font-black rounded-xl uppercase tracking-widest py-6 text-lg shadow-[0_0_15px_rgba(204,255,0,0.3)] hover:shadow-[0_0_25px_rgba(204,255,0,0.5)] transition-all mt-8"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          Створити турнір
        </Button>
      </form>
    </Form>
  )
}
