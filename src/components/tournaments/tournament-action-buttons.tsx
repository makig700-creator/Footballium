'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface TournamentActionButtonsProps {
  tournamentId: string
  tournamentStatus: string
  applicationStatus: string | null
  hasTeam: boolean
  isCoach: boolean
  compact?: boolean
}

export function TournamentActionButtons({
  tournamentId,
  tournamentStatus,
  applicationStatus: initialAppStatus,
  hasTeam,
  isCoach,
  compact = false
}: TournamentActionButtonsProps) {
  const router = useRouter()
  const [appStatus, setAppStatus] = useState<string | null>(initialAppStatus)
  const [isApplying, setIsApplying] = useState(false)
  const [showNoTeamDialog, setShowNoTeamDialog] = useState(false)

  const handleApply = async () => {
    if (!isCoach) {
      router.push('/auth/login')
      return
    }

    if (!hasTeam) {
      setShowNoTeamDialog(true)
      return
    }

    // Optimistic UI update
    setIsApplying(true)
    const prevStatus = appStatus
    setAppStatus('PENDING')
    toast('Заявку подано! Очікуйте підтвердження адміністратора.')

    try {
      const res = await fetch(`/api/tournaments/${tournamentId}/applications`, {
        method: 'POST'
      })

      if (!res.ok) {
        throw new Error(await res.text())
      }
      
      router.refresh()
    } catch (error: any) {
      // Revert optimistic update
      setAppStatus(prevStatus)
      toast.error('Помилка подачі заявки: ' + error.message)
    } finally {
      setIsApplying(false)
    }
  }

  // Helper for generating buttons
  const renderButtons = () => {
    if (tournamentStatus === 'DRAFT') {
      return (
        <button disabled className={`py-3 text-center bg-gray-800 text-gray-600 font-extrabold uppercase text-[11px] tracking-widest rounded-sm cursor-not-allowed ${compact ? 'flex-1' : 'w-full'}`}>
          НЕЗАБАРОМ
        </button>
      )
    }

    if (tournamentStatus === 'FINISHED') {
      return (
        <Link href={`/tournaments/${tournamentId}`} className={`py-3 text-center border border-gray-700 hover:border-white text-white font-extrabold uppercase text-[11px] tracking-widest transition-colors rounded-sm bg-[#0a0a0a] ${compact ? 'flex-1' : 'w-full block'}`}>
          ПЕРЕГЛЯНУТИ
        </Link>
      )
    }

    if (tournamentStatus === 'ONGOING') {
      if (appStatus === 'APPROVED') {
        return (
          <Link href={`/tournaments/${tournamentId}`} className={`py-3 text-center bg-[#ccff00] hover:bg-[#b3ff00] text-black font-extrabold uppercase text-[11px] tracking-widest transition-colors rounded-sm ${compact ? 'flex-1' : 'w-full block'}`}>
            ПЕРЕЙТИ ДО ТУРНІРУ
          </Link>
        )
      }
      return (
        <Link href={`/tournaments/${tournamentId}`} className={`py-3 text-center border border-gray-700 hover:border-white text-white font-extrabold uppercase text-[11px] tracking-widest transition-colors rounded-sm bg-[#0a0a0a] ${compact ? 'flex-1' : 'w-full block'}`}>
          ДЕТАЛІ
        </Link>
      )
    }

    // REGISTRATION STATUS
    if (!appStatus) {
      return (
        <>
          <button onClick={handleApply} disabled={isApplying} className={`py-3 text-center bg-[#ccff00] hover:bg-[#b3ff00] disabled:bg-gray-700 disabled:text-gray-500 text-black font-extrabold uppercase text-[11px] tracking-widest transition-colors rounded-sm ${compact ? 'flex-1' : 'w-full'}`}>
            {isApplying ? 'ОБРОБКА...' : 'ЗАЯВИТИСЯ'}
          </button>
          {compact && (
            <Link href={`/tournaments/${tournamentId}`} className="px-4 py-3 border border-gray-700 hover:border-gray-500 text-white font-extrabold uppercase text-[11px] tracking-widest transition-colors rounded-sm text-center">
              ДЕТАЛІ
            </Link>
          )}
        </>
      )
    }

    if (appStatus === 'PENDING') {
      return (
        <>
          <button disabled className={`py-3 text-center bg-gray-800 text-yellow-500 font-extrabold uppercase text-[11px] tracking-widest rounded-sm cursor-not-allowed ${compact ? 'flex-1' : 'w-full'}`}>
            ЗАЯВКА НА РОЗГЛЯДІ
          </button>
          {compact && (
            <Link href={`/tournaments/${tournamentId}`} className="px-4 py-3 border border-gray-700 hover:border-gray-500 text-white font-extrabold uppercase text-[11px] tracking-widest transition-colors rounded-sm text-center">
              ДЕТАЛІ
            </Link>
          )}
        </>
      )
    }

    if (appStatus === 'APPROVED') {
      return (
        <>
          <button disabled className={`py-3 text-center bg-green-900/40 text-green-500 border border-green-900/50 font-extrabold uppercase text-[11px] tracking-widest rounded-sm cursor-not-allowed ${compact ? 'flex-1' : 'w-full'}`}>
            ЗАЯВКУ ПРИЙНЯТО
          </button>
          {compact && (
            <Link href={`/tournaments/${tournamentId}`} className="px-4 py-3 border border-gray-700 hover:border-gray-500 text-white font-extrabold uppercase text-[11px] tracking-widest transition-colors rounded-sm text-center">
              ДЕТАЛІ
            </Link>
          )}
        </>
      )
    }

    if (appStatus === 'REJECTED') {
      return (
        <>
          <button onClick={handleApply} disabled={isApplying} className={`py-3 text-center border border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 disabled:bg-gray-700 disabled:text-gray-500 font-extrabold uppercase text-[11px] tracking-widest transition-colors rounded-sm ${compact ? 'flex-1' : 'w-full'}`}>
            ПОДАТИ ЗНОВУ
          </button>
          {compact && (
            <Link href={`/tournaments/${tournamentId}`} className="px-4 py-3 border border-gray-700 hover:border-gray-500 text-white font-extrabold uppercase text-[11px] tracking-widest transition-colors rounded-sm text-center">
              ДЕТАЛІ
            </Link>
          )}
        </>
      )
    }

    return null
  }

  return (
    <>
      <div className={`flex gap-2 ${compact ? 'w-full' : 'w-full flex-col'}`}>
        {renderButtons()}
      </div>

      <AlertDialog open={showNoTeamDialog} onOpenChange={setShowNoTeamDialog}>
        <AlertDialogContent className="bg-[#111111] border border-gray-800 text-white rounded-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black uppercase tracking-widest">Команду не знайдено</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Спочатку створіть команду щоб подати заявку на турнір. Ви будете перенаправлені на сторінку створення команди.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-gray-700 text-white hover:bg-gray-800 hover:text-white rounded-sm">Скасувати</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push('/coach/team')} className="bg-[#ccff00] text-black hover:bg-[#b3ff00] font-black uppercase tracking-widest rounded-sm">
              Створити команду
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
