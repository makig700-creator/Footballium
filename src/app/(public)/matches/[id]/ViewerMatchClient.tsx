"use client"

import { useState, useEffect } from "react"
import { pusherClient } from "@/lib/pusher-client"
import { formatMinute, getEventIcon } from "@/lib/match-utils"

export function ViewerMatchClient({ initialMatch }: { initialMatch: any }) {
  const [match, setMatch] = useState(initialMatch)
  const [lastGoalTime, setLastGoalTime] = useState<number>(0)

  useEffect(() => {
    const channel = pusherClient.subscribe(`match-${match.id}`)
    
    channel.bind("match-updated", (data: any) => {
      setMatch((prev: any) => {
        // Check if a goal was scored
        if (data.homeScore > prev.homeScore || data.awayScore > prev.awayScore) {
          setLastGoalTime(Date.now())
        }
        return { ...prev, ...data }
      })
    })

    return () => {
      pusherClient.unsubscribe(`match-${match.id}`)
    }
  }, [match.id])

  const isGoalAnim = Date.now() - lastGoalTime < 2000

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Scoreboard */}
      <div className={`bg-[#0a0a0a] border border-gray-900 rounded-lg p-6 mb-8 transition-colors duration-500 ${isGoalAnim ? 'bg-[#CCFF00]/20 border-[#CCFF00]' : ''}`}>
        <div className="flex justify-between items-center text-center">
          <div className="flex-1">
            <div className="text-xl font-bold text-white mb-2">{match.homeTeam.name}</div>
            <div className={`text-6xl font-black transition-all duration-300 ${isGoalAnim ? 'text-white scale-110' : 'text-[#CCFF00]'}`}>
              {match.homeScore ?? "-"}
            </div>
          </div>
          
          <div className="flex-shrink-0 px-4">
            <div className="text-sm text-gray-500 font-bold mb-2">
              {match.status === "LIVE" ? (
                <span className="text-red-500 animate-pulse flex items-center justify-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  LIVE
                </span>
              ) : match.status === "FINISHED" ? (
                <span className="text-gray-400">ЗАВЕРШЕНО</span>
              ) : (
                <span className="text-gray-400">ОЧІКУЄТЬСЯ</span>
              )}
            </div>
            
            <div className="text-3xl font-bold text-white bg-gray-900 rounded px-6 py-3">
              {match.status === "FINISHED" ? "FT" : match.status === "SCHEDULED" ? "-" : formatMinute(match.minute || 0)}
            </div>
          </div>

          <div className="flex-1">
            <div className="text-xl font-bold text-white mb-2">{match.awayTeam?.name}</div>
            <div className={`text-6xl font-black transition-all duration-300 ${isGoalAnim ? 'text-white scale-110' : 'text-[#CCFF00]'}`}>
              {match.awayScore ?? "-"}
            </div>
          </div>
        </div>
      </div>

      {/* Events Log */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-800 pb-2">Події матчу</h3>
          <div className="space-y-4">
            {match.events.length === 0 ? (
              <p className="text-gray-500 text-sm">Подій поки немає.</p>
            ) : (
              match.events.map((evt: any) => {
                const team = evt.teamId === match.homeTeamId ? match.homeTeam : match.awayTeam
                const player = team.players.find((p: any) => p.id === evt.playerId)
                const playerOut = evt.playerOutId ? team.players.find((p: any) => p.id === evt.playerOutId) : null

                return (
                  <div key={evt.id} className="flex gap-4 items-start bg-black/50 p-3 rounded">
                    <div className="text-[#CCFF00] font-bold w-10 text-right mt-0.5">{evt.minute}'</div>
                    <div className="text-xl">{getEventIcon(evt.type)}</div>
                    <div>
                      <div className="text-white font-medium text-sm">
                        {player ? `${player.firstName} ${player.lastName}` : "Невідомо"}
                        {evt.type === "SUBSTITUTION" && playerOut && (
                          <span className="text-gray-500 text-xs ml-1 block">
                            (замість {playerOut.firstName} {playerOut.lastName})
                          </span>
                        )}
                      </div>
                      <div className="text-gray-500 text-xs mt-1">
                        {team.name} {evt.comment ? `• ${evt.comment}` : ""}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-800 pb-2">Інформація</h3>
          <div className="bg-[#0a0a0a] rounded-lg p-4 space-y-3 text-sm border border-gray-900">
            <div className="flex justify-between">
              <span className="text-gray-500">Турнір</span>
              <span className="text-white font-medium">{match.tournament?.name || match.leagueId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Стадіон</span>
              <span className="text-white font-medium">{match.venue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Час початку</span>
              <span className="text-white font-medium">{new Date(match.kickoff).toLocaleString("uk-UA")}</span>
            </div>
            {match.referee && (
              <div className="flex justify-between">
                <span className="text-gray-500">Головний арбітр</span>
                <span className="text-white font-medium">{match.referee.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
