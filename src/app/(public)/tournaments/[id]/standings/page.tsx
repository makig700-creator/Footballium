import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { StandingsTable } from "@/components/stats/StandingsTable";
import { Trophy } from "lucide-react";

export const revalidate = 60;

export default async function TournamentStandingsPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const tournamentId = (await params).id;
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
  });

  if (!tournament) notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#CCFF00] rounded-sm shrink-0">
            <Trophy className="w-8 h-8 text-black" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
              Турнірна таблиця
            </h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mt-1">
              {tournament.name}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#1c1a1a] p-6 border border-gray-800 rounded-sm">
        <StandingsTable tournamentId={tournamentId} showMedals={true} compact={false} />
      </div>
    </div>
  );
}
