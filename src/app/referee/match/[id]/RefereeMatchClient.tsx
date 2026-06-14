"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { EventType, MatchStatus } from "@prisma/client"
import { formatMinute, getEventIcon } from "@/lib/match-utils"
import { pusherClient } from "@/lib/pusher-client"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

export function RefereeMatchClient({ match: initialMatch }: { match: any }) {
  const router = useRouter()
  const [match, setMatch] = useState(initialMatch)
  const [minute, setMinute] = useState(initialMatch.minute || 0)
  const [eventType, setEventType] = useState<EventType | "">("")
  const [teamId, setTeamId] = useState<string>("")
  const [playerId, setPlayerId] = useState<string>("")
  const [playerOutId, setPlayerOutId] = useState<string>("")
  const [comment, setComment] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const channel = pusherClient.subscribe(`match-${match.id}`)
    channel.bind("match-updated", (data: any) => {
      setMatch((prev: any) => ({ ...prev, ...data }))
      setMinute(data.minute)
    })
    return () => {
      pusherClient.unsubscribe(`match-${match.id}`)
    }
  }, [match.id])

  async function handleStart() {
    setIsLoading(true)
    await fetch(`/api/matches/${match.id}/start`, { method: "POST" })
    setIsLoading(false)
  }

  async function handleFinish() {
    setIsLoading(true)
    await fetch(`/api/matches/${match.id}/finish`, { method: "POST" })
    setIsLoading(false)
  }

  async function updateMinute(newMinute: number) {
    if (newMinute < 0) return
    setMinute(newMinute)
    await fetch(`/api/matches/${match.id}/minute`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ minute: newMinute })
    })
  }

  async function handleAddEvent() {
    if (!eventType || !teamId) return
    setIsLoading(true)
    const res = await fetch(`/api/matches/${match.id}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: eventType,
        minute,
        teamId,
        playerId: playerId || null,
        playerOutId: playerOutId || null,
        comment,
      })
    })
    if (res.ok) {
      setEventType("")
      setPlayerId("")
      setPlayerOutId("")
      setComment("")
    }
    setIsLoading(false)
  }

  async function handleDeleteEvent(eventId: string) {
    setIsLoading(true)
    await fetch(`/api/matches/${match.id}/events/${eventId}`, { method: "DELETE" })
    setIsLoading(false)
  }

  const activeTeamPlayers = teamId === match.homeTeamId
    ? match.homeTeam.players
    : teamId === match.awayTeamId
      ? match.awayTeam.players
      : []

  return (
    <div className="max-w-2xl mx-auto pb-20">
      {/* Scoreboard */}
      <div className="bg-[#0a0a0a] border border-gray-900 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center text-center">
          <div className="flex-1">
            <div className="text-xl font-bold text-white mb-2">{match.homeTeam.name}</div>
            <div className="text-5xl font-black text-[#CCFF00]">{match.homeScore}</div>
          </div>
          <div className="flex-shrink-0 px-4">
            <div className="text-sm text-gray-500 font-bold mb-1">
              {match.status === "LIVE" ? (
                <span className="text-red-500 animate-pulse flex items-center justify-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  LIVE
                </span>
              ) : match.status}
            </div>
            <div className="text-2xl font-bold text-white bg-gray-900 rounded px-4 py-2 flex items-center justify-center gap-2">
              <button disabled={match.status !== "LIVE"} onClick={() => updateMinute(minute - 1)} className="text-gray-500 hover:text-white">-</button>
              {formatMinute(minute)}
              <button disabled={match.status !== "LIVE"} onClick={() => updateMinute(minute + 1)} className="text-gray-500 hover:text-white">+</button>
            </div>
          </div>
          <div className="flex-1">
            <div className="text-xl font-bold text-white mb-2">{match.awayTeam?.name}</div>
            <div className="text-5xl font-black text-[#CCFF00]">{match.awayScore}</div>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          {match.status === "SCHEDULED" && (
            <AlertDialog>
              <AlertDialogTrigger className="bg-[#CCFF00] text-black font-bold px-6 py-3 rounded hover:bg-[#b3ff00]">
                РОЗПОЧАТИ МАТЧ
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-[#0a0a0a] border border-gray-800 text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Почати матч?</AlertDialogTitle>
                  <AlertDialogDescription>Статус матчу зміниться на LIVE. Таймер буде запущено.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-transparent text-white border border-gray-700">Відмінити</AlertDialogCancel>
                  <AlertDialogAction onClick={handleStart} className="bg-[#CCFF00] text-black hover:bg-[#b3ff00]">Почати</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {match.status === "LIVE" && (
            <AlertDialog>
              <AlertDialogTrigger className="bg-red-500 text-white font-bold px-6 py-3 rounded hover:bg-red-600">
                ЗАВЕРШИТИ МАТЧ
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-[#0a0a0a] border border-gray-800 text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Завершити матч?</AlertDialogTitle>
                  <AlertDialogDescription>Статус матчу зміниться на FINISHED. Додавати події буде неможливо.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-transparent text-white border border-gray-700">Відмінити</AlertDialogCancel>
                  <AlertDialogAction onClick={handleFinish} className="bg-red-500 hover:bg-red-600">Завершити</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Add Event Form */}
      {match.status === "LIVE" && (
        <div className="bg-[#0a0a0a] border border-gray-900 rounded-lg p-6 mb-6">
          <h3 className="text-white font-bold mb-4">ДОДАТИ ПОДІЮ</h3>

          <div className="flex flex-wrap gap-2 mb-4">
            <button onClick={() => setEventType("GOAL")} className={`px-4 py-2 rounded text-sm font-bold ${eventType === "GOAL" ? 'bg-[#CCFF00] text-black' : 'bg-gray-900 text-gray-400'}`}>⚽ ГОЛ</button>
            <button onClick={() => setEventType("YELLOW_CARD")} className={`px-4 py-2 rounded text-sm font-bold ${eventType === "YELLOW_CARD" ? 'bg-[#CCFF00] text-black' : 'bg-gray-900 text-gray-400'}`}>🟨 КАРТКА</button>
            <button onClick={() => setEventType("RED_CARD")} className={`px-4 py-2 rounded text-sm font-bold ${eventType === "RED_CARD" ? 'bg-[#CCFF00] text-black' : 'bg-gray-900 text-gray-400'}`}>🔴 КАРТКА</button>
            <button onClick={() => setEventType("SUBSTITUTION")} className={`px-4 py-2 rounded text-sm font-bold ${eventType === "SUBSTITUTION" ? 'bg-[#CCFF00] text-black' : 'bg-gray-900 text-gray-400'}`}>🔄 ЗАМІНА</button>
            <button onClick={() => setEventType("OWN_GOAL")} className={`px-4 py-2 rounded text-sm font-bold ${eventType === "OWN_GOAL" ? 'bg-[#CCFF00] text-black' : 'bg-gray-900 text-gray-400'}`}>⚽ АВТ.ГОЛ</button>
            <button onClick={() => setEventType("PENALTY_GOAL")} className={`px-4 py-2 rounded text-sm font-bold ${eventType === "PENALTY_GOAL" ? 'bg-[#CCFF00] text-black' : 'bg-gray-900 text-gray-400'}`}>ПЕНАЛЬТІ</button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-500 text-sm mb-1">Команда</label>
              <select value={teamId} onChange={(e) => { setTeamId(e.target.value); setPlayerId(""); setPlayerOutId(""); }} className="w-full bg-black border border-gray-800 text-white rounded p-2">
                <option value="">Оберіть команду</option>
                <option value={match.homeTeamId}>{match.homeTeam.name}</option>
                {match.awayTeamId && <option value={match.awayTeamId}>{match.awayTeam.name}</option>}
              </select>
            </div>

            {teamId && (
              <div>
                <label className="block text-gray-500 text-sm mb-1">{eventType === "SUBSTITUTION" ? "Гравець (заходить)" : "Гравець"}</label>
                <select value={playerId} onChange={(e) => setPlayerId(e.target.value)} className="w-full bg-black border border-gray-800 text-white rounded p-2">
                  <option value="">Оберіть гравця</option>
                  {activeTeamPlayers.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.number} - {p.lastName} {p.firstName}</option>
                  ))}
                </select>
              </div>
            )}

            {eventType === "SUBSTITUTION" && teamId && (
              <div>
                <label className="block text-gray-500 text-sm mb-1">Гравець (виходить)</label>
                <select value={playerOutId} onChange={(e) => setPlayerOutId(e.target.value)} className="w-full bg-black border border-gray-800 text-white rounded p-2">
                  <option value="">Оберіть гравця</option>
                  {activeTeamPlayers.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.number} - {p.lastName} {p.firstName}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-gray-500 text-sm mb-1">Коментар</label>
              <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} className="w-full bg-black border border-gray-800 text-white rounded p-2" placeholder="Наприклад: 'Зі штрафного'" />
            </div>

            <button
              disabled={isLoading || !eventType || !teamId}
              onClick={handleAddEvent}
              className="w-full bg-[#CCFF00] text-black font-bold py-3 rounded disabled:opacity-50"
            >
              ЗБЕРЕГТИ ПОДІЮ
            </button>
          </div>
        </div>
      )}

      {/* Event Log */}
      <div className="bg-[#0a0a0a] border border-gray-900 rounded-lg p-6">
        <h3 className="text-white font-bold mb-4">ЛОГ ПОДІЙ</h3>
        <div className="space-y-3">
          {match.events.length === 0 ? (
            <div className="text-gray-500 text-center py-4">Подій ще немає</div>
          ) : (
            match.events.map((evt: any) => {
              const team = evt.teamId === match.homeTeamId ? match.homeTeam : match.awayTeam
              const player = team.players.find((p: any) => p.id === evt.playerId)
              const playerOut = evt.playerOutId ? team.players.find((p: any) => p.id === evt.playerOutId) : null

              return (
                <div key={evt.id} className="flex items-center justify-between border-b border-gray-900 pb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 font-bold w-8">{evt.minute}'</span>
                    <span className="text-xl">{getEventIcon(evt.type)}</span>
                    <div>
                      <div className="text-white font-medium text-sm">
                        {player ? `${player.lastName} ${player.firstName.charAt(0)}.` : 'Невідомо'}
                        {evt.type === "SUBSTITUTION" && playerOut && (
                          <span className="text-gray-500 ml-1">
                            (замість {playerOut.lastName} {playerOut.firstName.charAt(0)}.)
                          </span>
                        )}
                      </div>
                      <div className="text-gray-500 text-xs">{team.name} {evt.comment ? `- ${evt.comment}` : ''}</div>
                    </div>
                  </div>
                  {match.status === "LIVE" && (
                    <button
                      onClick={() => handleDeleteEvent(evt.id)}
                      className="text-red-500 text-xs px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20"
                    >
                      Скасувати
                    </button>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
