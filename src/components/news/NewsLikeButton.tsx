"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface NewsLikeButtonProps {
  slug: string;
  initialLikes?: number;
}

export function NewsLikeButton({ slug, initialLikes = 0 }: NewsLikeButtonProps) {
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await fetch(`/api/news/${slug}/like`);
        if (res.ok) {
          const data = await res.json();
          setLikesCount(data.likesCount);
          setIsLiked(data.isLiked);
        }
      } catch (error) {
        console.error("Failed to fetch likes", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLikes();
  }, [slug]);

  const toggleLike = async () => {
    try {
      // Optimistic update
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);

      const res = await fetch(`/api/news/${slug}/like`, {
        method: "POST",
      });

      if (res.status === 401) {
        toast.error("Вам потрібно увійти, щоб поставити лайк");
        // Revert since user is not logged in
        setIsLiked(isLiked);
        setLikesCount(likesCount);
        router.push("/auth/login");
        return;
      }

      if (!res.ok) throw new Error("Failed to toggle like");
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev + 1 : prev - 1);
      toast.error("Помилка при збереженні лайка");
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={toggleLike}
        disabled={isLoading}
        className={`flex items-center justify-center p-3 rounded-full transition-all duration-300 focus:outline-none ${
          isLiked 
            ? "bg-red-500/20 text-red-500 hover:bg-red-500/30" 
            : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
        }`}
        aria-label="Вподобати"
      >
        <Heart className={`w-6 h-6 transition-transform ${isLiked ? 'fill-current scale-110' : 'scale-100'}`} />
      </button>
      <span className="font-black text-2xl text-white tracking-tighter">
        {isLoading ? "..." : likesCount}
      </span>
    </div>
  );
}
