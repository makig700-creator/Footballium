"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface GenerateBracketButtonProps {
  tournamentId: string
  status: "DRAFT" | "REGISTRATION" | "ONGOING" | "FINISHED"
  approvedCount: number
  minTeams: number
  bracketType?: string
}

export function GenerateBracketButton({ tournamentId, status, approvedCount, minTeams, bracketType = "ROUND_ROBIN" }: GenerateBracketButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [legs, setLegs] = useState<"1" | "2">("1")
  const router = useRouter()

  const canGenerate = status === "REGISTRATION" && approvedCount >= minTeams

  async function handleGenerate() {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/tournaments/${tournamentId}/generate-bracket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ legs: parseInt(legs, 10) })
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Failed to generate bracket")
      }

      toast.success("Сітку турніру успішно згенеровано")
      setIsOpen(false)
      router.push(`/admin/tournaments/${tournamentId}/bracket`)
    } catch (e: any) {
      toast.error(e.message || "Сталася помилка")
    } finally {
      setIsLoading(false)
    }
  }

  if (status !== "REGISTRATION" && status !== "DRAFT") return null

  // If not round robin, just use normal button without dialog
  if (bracketType !== "ROUND_ROBIN") {
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger 
        render={
          <Button 
            disabled={!canGenerate}
            className="bg-[#CCFF00] text-black hover:bg-[#b3e600] font-bold"
          />
        }
      >
        Згенерувати сітку
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border border-zinc-800 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-white">Генерація кругового турніру</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Виберіть кількість кіл для турніру. В одному колі команди зіграють між собою 1 раз. У двох колах - 2 рази (вдома та на виїзді).
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup value={legs} onValueChange={(val: "1" | "2") => setLegs(val)} className="flex flex-col gap-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="r1" className="border-zinc-700 text-[#CCFF00]" />
              <Label htmlFor="r1" className="text-white cursor-pointer">1 коло (Один матч)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="r2" className="border-zinc-700 text-[#CCFF00]" />
              <Label htmlFor="r2" className="text-white cursor-pointer">2 кола (Два матчі: вдома і на виїзді)</Label>
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} className="bg-transparent text-white border-zinc-800 hover:bg-zinc-900">
            Скасувати
          </Button>
          <Button onClick={handleGenerate} disabled={isLoading} className="bg-[#CCFF00] text-black hover:bg-[#b3e600]">
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Згенерувати
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
