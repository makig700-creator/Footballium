"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface FavoriteButtonProps {
  teamId: string;
}

export function FavoriteButton({ teamId }: FavoriteButtonProps) {
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/settings/user/favorites")
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setIsFavorite(data.some((fav: any) => fav.teamId === teamId));
          }
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [session, teamId]);

  const toggleFavorite = async () => {
    if (!session?.user) {
      toast.error("Увійдіть, щоб додавати в улюблені");
      return;
    }

    const previousState = isFavorite;
    setIsFavorite(!previousState);

    try {
      if (previousState) {
        await fetch(`/api/settings/user/favorites/${teamId}`, { method: "DELETE" });
      } else {
        await fetch("/api/settings/user/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ teamId })
        });
      }
    } catch {
      setIsFavorite(previousState);
      toast.error("Сталася помилка");
    }
  };

  if (isLoading) return null;

  return (
    <Button
      variant="outline"
      onClick={toggleFavorite}
      className={`gap-2 border-white/10 ${
        isFavorite 
          ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400" 
          : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
      }`}
    >
      <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
      {isFavorite ? "В улюблених" : "Додати в улюблені"}
    </Button>
  );
}
