import { FileText } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-6 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <FileText className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 uppercase">Умови користування</h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Правила користування платформою Footballium. Реєструючись, ви погоджуєтеся з цими умовами.
          </p>
        </div>

        {/* Content */}
        <div className="bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 prose prose-invert max-w-none">
          <h3 className="text-xl font-bold text-white mt-4 mb-4">1. Загальні положення</h3>
          <p className="text-zinc-400">
            Footballium — це веб-платформа для управління футбольними та міні-футбольними турнірами. Використовуючи наш сайт, ви зобов'язуєтесь дотримуватися чинного законодавства України та правил чесної гри.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-4">2. Реєстрація акаунту</h3>
          <p className="text-zinc-400">
            Для доступу до функцій створення команд або турнірів необхідно зареєструвати акаунт. Ви несете відповідальність за збереження конфіденційності свого пароля та всіх дій, що відбуваються під вашим акаунтом.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-4">3. Відповідальність користувачів</h3>
          <ul className="list-disc pl-6 space-y-2 text-zinc-400">
            <li>Організатори турнірів несуть повну відповідальність за достовірність інформації про матчі, результати та статистику.</li>
            <li>Забороняється використовувати платформу для розміщення образливого контенту, розпалювання ворожнечі або незаконної діяльності.</li>
            <li>Адміністрація Footballium залишає за собою право блокувати акаунти, які порушують ці правила.</li>
          </ul>

          <h3 className="text-xl font-bold text-white mt-8 mb-4">4. Відмова від відповідальності</h3>
          <p className="text-zinc-400">
            Платформа надається "як є". Ми не несемо відповідальності за прямі або непрямі збитки, пов'язані з використанням сайту, втратою даних або неточностями у статистиці турнірів, організованих третіми особами.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-4">5. Зміни до умов</h3>
          <p className="text-zinc-400">
            Ми залишаємо за собою право оновлювати ці Умови в будь-який час. Продовження використання платформи після змін означає вашу згоду з новими Умовами.
          </p>

          <div className="mt-12 p-4 bg-white/5 rounded-xl border border-white/10 text-sm text-zinc-500 text-center">
            Останнє оновлення: Червень 2026.
          </div>
        </div>

      </div>
    </div>
  )
}
