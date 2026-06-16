"use client";

import { useState, useEffect } from "react";
import { Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function UserFavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = () => {
    setIsLoading(true);
    fetch("/api/settings/user/favorites")
      .then(res => res.json())
      .then(data => {
        setFavorites(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  const removeFavorite = async (teamId: string) => {
    try {
      const res = await fetch(`/api/settings/user/favorites/${teamId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Команду видалено з улюблених");
        setFavorites(favorites.filter(f => f.teamId !== teamId));
      }
    } catch {
      toast.error("Помилка мережі");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-black uppercase tracking-widest mb-6 border-b border-white/10 pb-4">
        Улюблені Команди
      </h1>

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#CCFF00]" /></div>
      ) : (
        <div className="space-y-4 max-w-2xl">
          {favorites.map((fav) => (
            <div key={fav.teamId} className="flex items-center justify-between bg-zinc-900 border border-white/10 p-4 rounded-lg">
              <Link href={`/teams/${fav.teamId}`} className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                {fav.team.logo ? (
                  <img src={fav.team.logo} alt={fav.team.name} className="w-12 h-12 object-contain" />
                ) : (
                  <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-500 font-bold">
                    {fav.team.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-white text-lg">{fav.team.name}</h3>
                  <p className="text-sm text-zinc-400">{fav.team.city}</p>
                </div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFavorite(fav.teamId)}
                className="text-zinc-500 hover:text-red-500 hover:bg-red-500/10"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          ))}

          {favorites.length === 0 && (
            <div className="text-center py-12 bg-zinc-900/50 rounded-lg border border-white/5 border-dashed">
              <p className="text-zinc-400 mb-4">У вас ще немає улюблених команд</p>
              <Link href="/teams" className="inline-flex px-4 py-2 bg-[#CCFF00] text-black font-bold uppercase tracking-wider text-sm rounded hover:bg-[#b3ff00] transition-colors">
                Знайти команду
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
