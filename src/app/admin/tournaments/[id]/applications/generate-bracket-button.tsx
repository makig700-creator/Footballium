"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface GenerateBracketButtonProps {
  tournamentId: string
  status: "DRAFT" | "REGISTRATION" | "ONGOING" | "FINISHED"
  approvedCount: number
  minTeams: number
}

export function GenerateBracketButton({ tournamentId, status, approvedCount, minTeams }: GenerateBracketButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const canGenerate = status === "REGISTRATION" && approvedCount >= minTeams

  async function handleGenerate() {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/tournaments/${tournamentId}/generate-bracket`, {
        method: "POST",
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Failed to generate bracket")
      }

      toast.success("Сітку турніру успішно згенеровано")
      router.push(`/admin/tournaments/${tournamentId}/bracket`)
    } catch (e: any) {
      toast.error(e.message || "Сталася помилка")
    } finally {
      setIsLoading(false)
    }
  }

  if (status !== "REGISTRATION" && status !== "DRAFT") return null

  return (
    <Button 
      onClick={handleGenerate} 
      disabled={!canGenerate || isLoading}
      className="bg-[#CCFF00] text-black hover:bg-[#b3e600] font-bold"
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      Згенерувати сітку
    </Button>
  )
}
