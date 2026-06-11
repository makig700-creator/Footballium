'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'
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
} from '@/components/ui/alert-dialog'

export function DeleteButton({ id, type, teamId }: { id: string, type: 'team' | 'player', teamId?: string }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const endpoint = type === 'team' 
        ? `/api/teams/${id}` 
        : `/api/teams/${teamId}/players/${id}`
      
      const res = await fetch(endpoint, { method: 'DELETE' })
      if (!res.ok) {
        const error = await res.json()
        alert(error.error || 'Помилка видалення')
        return
      }
      router.refresh()
      if (type === 'team') {
        router.push('/dashboard')
      }
    } catch (error) {
      alert('Помилка з\'єднання')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-sm transition-colors disabled:opacity-50">
        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[#1c1a1a] border-gray-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white uppercase font-black tracking-tight">Ви впевнені?</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400 font-medium text-sm">
            Ця дія не може бути скасована. Це призведе до остаточного видалення даних з наших серверів.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent text-white border-gray-700 hover:bg-gray-800 hover:text-white uppercase text-xs font-bold tracking-widest rounded-sm">Скасувати</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700 uppercase text-xs font-bold tracking-widest rounded-sm">Видалити</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
