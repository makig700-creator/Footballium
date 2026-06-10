import { TournamentForm } from "./tournament-form"

export default function NewTournamentPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-black text-white uppercase tracking-wider">Новий турнір</h1>
        <p className="text-gray-400 mt-1">Заповніть форму для створення нового турніру</p>
      </div>

      <div className="bg-[#0a0a0a] border border-gray-900 rounded-lg p-6">
        <TournamentForm />
      </div>
    </div>
  )
}
