"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
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

export function DeleteTournamentButton({ id, name }: { id: string, name: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/tournaments/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error(await res.text() || "Помилка при видаленні")
      }

      toast.success("Турнір успішно видалено")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger 
        render={<Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500" />}
      >
        <Trash2 className="w-4 h-4" />
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-zinc-950 border border-zinc-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Видалити турнір?</AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400">
            Ви впевнені, що хочете видалити турнір &quot;{name}&quot;? Ця дія є незворотною і призведе до видалення всіх пов'язаних команд, матчів, подій та статистики.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent text-white border-zinc-800 hover:bg-zinc-900">Скасувати</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Видалити
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
