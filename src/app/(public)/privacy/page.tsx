import { Shield } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 mb-6 shadow-[0_0_30px_rgba(244,63,94,0.15)]">
            <Shield className="w-8 h-8 text-rose-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 uppercase">Політика конфіденційності</h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Ваша конфіденційність є пріоритетом для Footballium. Ознайомтеся з тим, як ми обробляємо ваші дані.
          </p>
        </div>

        {/* Content */}
        <div className="bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 prose prose-invert max-w-none">
          <p className="text-zinc-300 leading-relaxed text-lg">
            Ця Політика конфіденційності описує, як ми збираємо, використовуємо та захищаємо вашу особисту інформацію під час користування платформою Footballium.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-4">1. Збір інформації</h3>
          <p className="text-zinc-400">
            Ми збираємо особисту інформацію, яку ви надаєте під час реєстрації акаунту: ім'я, адресу електронної пошти, роль у системі (гравець, тренер, арбітр, адміністратор). Крім того, для гравців можуть збиратися статистичні дані (голи, асисти, картки), які є публічними в рамках турніру.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-4">2. Використання інформації</h3>
          <p className="text-zinc-400">
            Зібрана інформація використовується для:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-400">
            <li>Забезпечення функціонування платформи та доступу до вашого акаунту.</li>
            <li>Відображення публічної статистики турнірів та профілів гравців.</li>
            <li>Надсилання транзакційних листів (наприклад, скидання пароля).</li>
          </ul>

          <h3 className="text-xl font-bold text-white mt-8 mb-4">3. Захист даних</h3>
          <p className="text-zinc-400">
            Ми застосовуємо сучасні методи шифрування (зокрема, хешування паролів) та безпечні протоколи передачі даних для захисту вашої інформації від несанкціонованого доступу.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-4">4. Передача третім особам</h3>
          <p className="text-zinc-400">
            Ми не продаємо і не передаємо ваші особисті дані стороннім маркетинговим компаніям. Ваша публічна статистика (голи, матчі) є доступною для перегляду всім відвідувачам платформи згідно з метою її створення.
          </p>
          
          <div className="mt-12 p-4 bg-white/5 rounded-xl border border-white/10 text-sm text-zinc-500 text-center">
            Останнє оновлення: Червень 2026. Якщо у вас є питання, зв'яжіться з нами.
          </div>
        </div>

      </div>
    </div>
  )
}
