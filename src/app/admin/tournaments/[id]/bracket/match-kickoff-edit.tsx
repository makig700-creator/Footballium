"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function MatchKickoffEdit({
  matchId,
  currentKickoff
}: {
  matchId: string,
  currentKickoff: Date | null
}) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Format date to datetime-local string (YYYY-MM-DDTHH:mm)
  const formatDateForInput = (date: Date | null) => {
    if (!date) return ""
    const d = new Date(date)
    return new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().slice(0, 16)
  }

  const [kickoff, setKickoff] = useState(formatDateForInput(currentKickoff))

  async function handleUpdate(newKickoff: string) {
    setKickoff(newKickoff)
    if (!newKickoff) return

    setIsLoading(true)
    try {
      const res = await fetch(`/api/matches/${matchId}/kickoff`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kickoff: new Date(newKickoff).toISOString() }),
      })

      if (res.ok) {
        router.refresh()
      } else {
        console.error("Failed to update kickoff")
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <input
      type="datetime-local"
      value={kickoff}
      onChange={(e) => handleUpdate(e.target.value)}
      disabled={isLoading}
      className="mt-2 text-xs bg-black text-gray-400 border border-gray-800 rounded px-1 py-0.5 w-full focus:outline-none focus:border-gray-600"
    />
  )
}
