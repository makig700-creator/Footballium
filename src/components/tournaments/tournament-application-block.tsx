'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { TournamentActionButtons } from './tournament-action-buttons'
import { CalendarDays, AlertCircle } from 'lucide-react'

interface TournamentApplicationBlockProps {
  tournamentId: string
  tournamentStatus: string
  applicationStatus: string | null
  appId: string | null
  hasTeam: boolean
  isCoach: boolean
  teamName?: string
}

export function TournamentApplicationBlock({
  tournamentId,
  tournamentStatus,
  applicationStatus,
  appId,
  hasTeam,
  isCoach,
  teamName
}: TournamentApplicationBlockProps) {
  const router = useRouter()
  const [isWithdrawing, setIsWithdrawing] = useState(false)

  const handleWithdraw = async () => {
    if (!appId) return

    if (!confirm('Ви впевнені, що хочете відкликати заявку?')) return

    setIsWithdrawing(true)
    try {
      const res = await fetch(`/api/tournaments/${tournamentId}/applications/${appId}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        throw new Error(await res.text())
      }

      toast.success('Заявку успішно відкликано')
      router.refresh()
    } catch (error: any) {
      toast.error('Помилка відкликання заявки: ' + error.message)
    } finally {
      setIsWithdrawing(false)
    }
  }

  if (tournamentStatus === 'DRAFT' || tournamentStatus === 'FINISHED') {
    return null // No applications logic shown
  }

  return (
    <div className="bg-[#111111] border border-gray-800 rounded-sm p-6 flex flex-col gap-6">
      <h3 className="text-lg font-black text-white uppercase tracking-widest border-b border-gray-800 pb-4">
        Ваша Заявка
      </h3>

      {applicationStatus ? (
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Статус вашої заявки:</p>
              {applicationStatus === 'PENDING' && (
                <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-3 py-2 rounded-sm">
                  <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                  <span className="font-black text-xs uppercase tracking-widest">На розгляді</span>
                </div>
              )}
              {applicationStatus === 'APPROVED' && (
                <div className="flex items-center gap-2 text-green-500 bg-green-500/10 border border-green-500/20 px-3 py-2 rounded-sm">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="font-black text-xs uppercase tracking-widest">Заявку прийнято</span>
                </div>
              )}
              {applicationStatus === 'REJECTED' && (
                <div className="flex items-center gap-2 text-red-500 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-sm">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  <span className="font-black text-xs uppercase tracking-widest">Відхилено</span>
                </div>
              )}
            </div>

            {hasTeam && teamName && (
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Команда:</p>
                <p className="font-bold text-white text-sm">{teamName}</p>
              </div>
            )}
          </div>

          {applicationStatus === 'PENDING' && (
            <button
              onClick={handleWithdraw}
              disabled={isWithdrawing}
              className="w-full py-3 text-center border border-red-500/50 hover:bg-red-500/10 text-red-500 disabled:opacity-50 disabled:cursor-not-allowed font-extrabold uppercase text-[11px] tracking-widest transition-colors rounded-sm"
            >
              {isWithdrawing ? 'ОБРОБКА...' : 'ВІДКЛИКАТИ ЗАЯВКУ'}
            </button>
          )}

          {applicationStatus === 'REJECTED' && (
             <TournamentActionButtons
                tournamentId={tournamentId}
                tournamentStatus={tournamentStatus}
                applicationStatus={applicationStatus}
                hasTeam={hasTeam}
                isCoach={isCoach}
                compact={false}
             />
          )}

        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 p-4 rounded-sm text-blue-400">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-xs font-medium leading-relaxed">
              Ваша команда ще не подала заявку на цей турнір. Реєстрація відкрита.
            </p>
          </div>
          
          <TournamentActionButtons
             tournamentId={tournamentId}
             tournamentStatus={tournamentStatus}
             applicationStatus={applicationStatus}
             hasTeam={hasTeam}
             isCoach={isCoach}
             compact={false}
          />
        </div>
      )}
    </div>
  )
}
