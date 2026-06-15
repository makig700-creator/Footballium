"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateTournamentSchema } from "@/lib/validations/tournament"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
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
import { uk } from "date-fns/locale"
import { CalendarIcon, Loader2, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function EditTournamentForm({ tournament }: { tournament: any }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const form = useForm<z.infer<typeof updateTournamentSchema>>({
    resolver: zodResolver(updateTournamentSchema) as any,
    defaultValues: {
      name: tournament.name,
      description: tournament.description || "",
      status: tournament.status as any,
      registrationDeadline: new Date(tournament.registrationDeadline),
      startDate: new Date(tournament.startDate),
      endDate: new Date(tournament.endDate),
    } as any,
  })

  async function onSubmit(values: z.infer<typeof updateTournamentSchema>) {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/tournaments/${tournament.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Failed to update tournament")
      }

      toast.success("Турнір успішно оновлено")
      router.push(`/admin/tournaments/${tournament.id}`)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete() {
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/tournaments/${tournament.id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const error = await res.text()
        throw new Error(error || "Failed to delete tournament")
      }

      toast.success("Турнір видалено")
      router.push("/admin/tournaments")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-300 text-xs font-bold uppercase tracking-wider">Назва турніру</FormLabel>
                <FormControl>
                  <Input className="bg-[#111111] border-gray-800 text-white placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-white/20 rounded-lg transition-colors" {...field} />
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
                <FormLabel className="text-zinc-300 text-xs font-bold uppercase tracking-wider">Опис</FormLabel>
                <FormControl>
                  <Input className="bg-[#111111] border-gray-800 text-white placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-white/20 rounded-lg transition-colors" {...field} />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-300 text-xs font-bold uppercase tracking-wider">Статус турніру</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value as string}>
                  <FormControl>
                    <SelectTrigger className="bg-[#111111] border-gray-800 text-white focus:ring-1 focus:ring-white/20 rounded-lg transition-colors">
                      <SelectValue placeholder="Виберіть статус">
                        {field.value === "DRAFT" && "Чорнетка"}
                        {field.value === "REGISTRATION" && "Реєстрація"}
                        {field.value === "ONGOING" && "В процесі"}
                        {field.value === "FINISHED" && "Завершено"}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-[#111111] border-gray-800 text-white rounded-lg shadow-xl">
                    <SelectItem value="DRAFT" className="focus:bg-gray-800 focus:text-white cursor-pointer">Чорнетка</SelectItem>
                    <SelectItem value="REGISTRATION" className="focus:bg-gray-800 focus:text-white cursor-pointer">Реєстрація</SelectItem>
                    <SelectItem value="ONGOING" className="focus:bg-gray-800 focus:text-white cursor-pointer">В процесі</SelectItem>
                    <SelectItem value="FINISHED" className="focus:bg-gray-800 focus:text-white cursor-pointer">Завершено</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="registrationDeadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-zinc-300 text-xs font-bold uppercase tracking-wider">Кінець реєстрації</FormLabel>
                  <Popover>
                    <FormControl>
                      <PopoverTrigger render={
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal bg-[#111111] border-gray-800 text-white hover:bg-gray-900 hover:text-white transition-colors rounded-lg",
                            !field.value && "text-muted-foreground"
                          )}
                        />
                      }>
                        {field.value ? format(field.value, "PPP", { locale: uk }) : <span>Оберіть дату</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </PopoverTrigger>
                    </FormControl>
                    <PopoverContent className="w-auto p-0 bg-[#111111] border-gray-800 text-white rounded-lg shadow-xl" align="start">
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
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-zinc-300 text-xs font-bold uppercase tracking-wider">Початок турніру</FormLabel>
                  <Popover>
                    <FormControl>
                      <PopoverTrigger render={
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal bg-[#111111] border-gray-800 text-white hover:bg-gray-900 hover:text-white transition-colors rounded-lg",
                            !field.value && "text-muted-foreground"
                          )}
                        />
                      }>
                        {field.value ? format(field.value, "PPP", { locale: uk }) : <span>Оберіть дату</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </PopoverTrigger>
                    </FormControl>
                    <PopoverContent className="w-auto p-0 bg-[#111111] border-gray-800 text-white rounded-lg shadow-xl" align="start">
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
                  <FormLabel className="text-zinc-300 text-xs font-bold uppercase tracking-wider">Кінець турніру</FormLabel>
                  <Popover>
                    <FormControl>
                      <PopoverTrigger render={
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal bg-[#111111] border-gray-800 text-white hover:bg-gray-900 hover:text-white transition-colors rounded-lg",
                            !field.value && "text-muted-foreground"
                          )}
                        />
                      }>
                        {field.value ? format(field.value, "PPP", { locale: uk }) : <span>Оберіть дату</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </PopoverTrigger>
                    </FormControl>
                    <PopoverContent className="w-auto p-0 bg-[#111111] border-gray-800 text-white rounded-lg shadow-xl" align="start">
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
            className="w-full bg-[#CCFF00] text-black hover:bg-[#b3e600] font-bold rounded-lg uppercase tracking-wider transition-colors h-12"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Зберегти зміни
          </Button>
        </form>
      </Form>

      {tournament.status === "DRAFT" && (
        <div className="pt-6 border-t border-gray-900 mt-6">
          <AlertDialog>
            <AlertDialogTrigger render={
              <Button variant="destructive" className="w-full bg-red-900/20 text-red-500 border border-red-900/50 hover:bg-red-900/40 hover:text-red-400 font-bold rounded-lg uppercase tracking-wider transition-colors h-12" />
            }>
              <Trash2 className="w-4 h-4 mr-2" />
              Видалити турнір
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#111111] border-gray-800 text-white rounded-xl shadow-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl font-bold tracking-tight text-white">Ви впевнені?</AlertDialogTitle>
                <AlertDialogDescription className="text-zinc-400">
                  Ця дія не може бути скасована. Це назавжди видалить турнір.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-4">
                <AlertDialogCancel className="bg-transparent border-gray-800 text-white hover:bg-gray-900 hover:text-white rounded-lg transition-colors">Скасувати</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Видалити
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  )
}
