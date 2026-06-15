import { TournamentForm } from "./tournament-form"
import { Trophy } from "lucide-react"

export default function NewTournamentPage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto py-8">
      <div className="flex items-center gap-4 border-b border-gray-800/50 pb-6">
        <div className="h-16 w-16 bg-gradient-to-br from-[#CCFF00] to-[#99cc00] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(204,255,0,0.3)]">
          <Trophy className="h-8 w-8 text-black" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-wider">Новий турнір</h1>
          <p className="text-gray-400 mt-1 text-lg">Заповніть форму для створення нового турніру</p>
        </div>
      </div>

      <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-gray-800/60 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#CCFF00]/0 via-[#CCFF00] to-[#CCFF00]/0"></div>
        <TournamentForm />
      </div>
    </div>
  )
}
