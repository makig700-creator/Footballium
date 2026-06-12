"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function RefereeSelect({ 
  matchId, 
  currentRefereeId, 
  referees 
}: { 
  matchId: string, 
  currentRefereeId: string | null, 
  referees: { id: string, name: string }[] 
}) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleAssign(refereeId: string) {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/matches/${matchId}/assign-referee`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refereeId: refereeId || null }),
      })

      if (res.ok) {
        router.refresh()
      } else {
        console.error("Failed to assign referee")
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <select
      value={currentRefereeId || ""}
      onChange={(e) => handleAssign(e.target.value)}
      disabled={isLoading}
      className="mt-2 text-xs bg-black text-gray-400 border border-gray-800 rounded px-1 py-0.5 w-full focus:outline-none focus:border-gray-600"
    >
      <option value="">Немає судді</option>
      {referees.map(r => (
        <option key={r.id} value={r.id}>{r.name}</option>
      ))}
    </select>
  )
}
