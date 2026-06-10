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
                <FormLabel className="text-gray-300">Назва турніру</FormLabel>
                <FormControl>
                  <Input className="bg-[#111111] border-gray-800 text-white" {...field} />
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
                <FormLabel className="text-gray-300">Опис</FormLabel>
                <FormControl>
                  <Input className="bg-[#111111] border-gray-800 text-white" {...field} />
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
                <FormLabel className="text-gray-300">Статус турніру</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value as string}>
                  <FormControl>
                    <SelectTrigger className="bg-[#111111] border-gray-800 text-white">
                      <SelectValue placeholder="Виберіть статус" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-[#111111] border-gray-800 text-white">
                    <SelectItem value="DRAFT">Чорнетка (DRAFT)</SelectItem>
                    <SelectItem value="REGISTRATION">Реєстрація (REGISTRATION)</SelectItem>
                    <SelectItem value="ONGOING">В процесі (ONGOING)</SelectItem>
                    <SelectItem value="FINISHED">Завершено (FINISHED)</SelectItem>
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
                  <FormLabel className="text-gray-300">Кінець реєстрації</FormLabel>
                  <Popover>
                    <FormControl>
                      <PopoverTrigger render={
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal bg-[#111111] border-gray-800 text-white",
                            !field.value && "text-muted-foreground"
                          )}
                        />
                      }>
                        {field.value ? format(field.value, "PPP") : <span>Оберіть дату</span>}
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
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-gray-300">Початок турніру</FormLabel>
                  <Popover>
                    <FormControl>
                      <PopoverTrigger render={
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal bg-[#111111] border-gray-800 text-white",
                            !field.value && "text-muted-foreground"
                          )}
                        />
                      }>
                        {field.value ? format(field.value, "PPP") : <span>Оберіть дату</span>}
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
                  <FormLabel className="text-gray-300">Кінець турніру</FormLabel>
                  <Popover>
                    <FormControl>
                      <PopoverTrigger render={
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal bg-[#111111] border-gray-800 text-white",
                            !field.value && "text-muted-foreground"
                          )}
                        />
                      }>
                        {field.value ? format(field.value, "PPP") : <span>Оберіть дату</span>}
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
            className="w-full bg-[#CCFF00] text-black hover:bg-[#b3e600] font-bold rounded-sm uppercase tracking-wider"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Зберегти зміни
          </Button>
        </form>
      </Form>

      {tournament.status === "DRAFT" && (
        <div className="pt-6 border-t border-gray-900">
          <AlertDialog>
            <AlertDialogTrigger render={
              <Button variant="destructive" className="w-full bg-red-900/20 text-red-500 border border-red-900 hover:bg-red-900/40 font-bold rounded-sm uppercase tracking-wider" />
            }>
              <Trash2 className="w-4 h-4 mr-2" />
              Видалити турнір
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#111111] border-gray-800 text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Ви впевнені?</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  Ця дія не може бути скасована. Це назавжди видалить турнір.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-transparent border-gray-800 text-white hover:bg-gray-900 hover:text-white">Скасувати</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Видалити"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  )
}
