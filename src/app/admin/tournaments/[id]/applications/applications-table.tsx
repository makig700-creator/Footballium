"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function ApplicationsTable({ applications, tournamentId }: { applications: any[], tournamentId: string }) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const router = useRouter()

  async function handleAction(appId: string, action: "approve" | "reject") {
    setLoadingId(appId)
    try {
      const res = await fetch(`/api/tournaments/${tournamentId}/applications/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      if (!res.ok) {
        const errorMessage = await res.text()
        throw new Error(errorMessage || "Failed to process action")
      }

      toast.success(action === "approve" ? "Заявку схвалено" : "Заявку відхилено")
      router.refresh()
    } catch (e: any) {
      toast.error(e.message || "Сталася помилка")
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="bg-[#0a0a0a] border border-gray-900 rounded-lg overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-[#111111] border-b border-gray-900 text-gray-500 font-bold uppercase text-xs tracking-wider">
          <tr>
            <th className="p-4">Команда</th>
            <th className="p-4">Дата подачі</th>
            <th className="p-4">Статус</th>
            <th className="p-4 text-right">Дії</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-900">
          {applications.map((app) => (
            <tr key={app.id} className="hover:bg-[#111111]/50">
              <td className="p-4 font-medium text-white">{app.team.name}</td>
              <td className="p-4 text-gray-400">{new Date(app.appliedAt).toLocaleString()}</td>
              <td className="p-4">
                <Badge variant={app.status === "PENDING" ? "outline" : app.status === "APPROVED" ? "default" : "destructive"}>
                  {app.status}
                </Badge>
              </td>
              <td className="p-4 text-right space-x-2">
                {app.status === "PENDING" && (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-500 border-red-900/50 hover:bg-red-900/20"
                      onClick={() => handleAction(app.id, "reject")}
                      disabled={loadingId === app.id}
                    >
                      Відхилити
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-[#CCFF00] text-black hover:bg-[#b3e600]"
                      onClick={() => handleAction(app.id, "approve")}
                      disabled={loadingId === app.id}
                    >
                      Схвалити
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {applications.length === 0 && (
            <tr>
              <td colSpan={4} className="p-8 text-center text-gray-500">
                Немає заявок
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
