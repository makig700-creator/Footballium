"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

export default function PendingApplicationsWidget({ applications }: { applications: any[] }) {
  const [apps, setApps] = useState(applications);
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (appId: string, tournamentId: string, action: "approve" | "reject") => {
    setLoading(appId);
    try {
      const res = await fetch(`/api/tournaments/${tournamentId}/applications/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      toast.success(`Заявку ${action === "approve" ? "прийнято" : "відхилено"}`);
      setApps(prev => prev.filter(app => app.appId !== appId));
    } catch (error) {
      toast.error("Помилка при оновленні заявки");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-[#111111] border border-gray-800 rounded-2xl p-5 hover:border-gray-600 transition-colors h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-black text-white uppercase tracking-widest">Заявки на розгляді</h3>
        <span className="text-xs font-bold bg-gray-800 text-white px-2 py-1 rounded-full">{apps.length}</span>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {apps.length === 0 ? (
          <div className="text-center text-sm text-gray-500 py-6 h-full flex items-center justify-center">
            Немає нових заявок
          </div>
        ) : (
          apps.map((app) => (
            <div key={app.id} className="bg-[#1a1a1a] rounded-xl p-3 border border-gray-800">
              <div className="mb-2">
                <div className="text-xs font-bold text-gray-300 line-clamp-1">{app.teamName}</div>
                <div className="text-[10px] text-gray-500 mt-1">→ {app.tournamentName}</div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleAction(app.appId, app.tournamentId, "approve")}
                  disabled={loading === app.appId}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-[#ccff00]/10 text-[#ccff00] hover:bg-[#ccff00]/20 text-[10px] font-bold uppercase tracking-widest disabled:opacity-50 transition-colors"
                >
                  <Check className="w-3 h-3" /> Прийняти
                </button>
                <button
                  onClick={() => handleAction(app.appId, app.tournamentId, "reject")}
                  disabled={loading === app.appId}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 text-[10px] font-bold uppercase tracking-widest disabled:opacity-50 transition-colors"
                >
                  <X className="w-3 h-3" /> Відхилити
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
