import { MessageCircle, HelpCircle } from 'lucide-react'

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-zinc-950 pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-6 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
            <MessageCircle className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 uppercase">FAQ</h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Відповіді на найпоширеніші запитання щодо користування платформою Footballium.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          
          {[
            {
              q: "Як зареєструвати свою команду на турнір?",
              a: "Для реєстрації команди вам необхідно створити акаунт тренера/менеджера на платформі, перейти в розділ 'Турніри', обрати бажаний турнір зі статусом 'Відкрито для реєстрації' та заповнити заявку."
            },
            {
              q: "Як додати нових гравців до складу?",
              a: "Гравців можна додати у вашій 'Панелі управління' в розділі 'Команда'. Зверніть увагу, що додавання гравців до заявки на конкретний турнір можливе лише під час відкритого трансферного вікна."
            },
            {
              q: "Хто оновлює результати матчів?",
              a: "Результати матчів оновлюються в режимі реального часу призначеними арбітрами або адміністраторами турніру через спеціальний інтерфейс."
            },
            {
              q: "Чи можу я використовувати Footballium для свого власного турніру?",
              a: "Так! Платформа Footballium дозволяє будь-кому створити та керувати власним турніром. Для цього потрібен акаунт Адміністратора."
            },
            {
              q: "Що робити, якщо я забув пароль?",
              a: "Скористайтеся функцією 'Забули пароль?' на сторінці входу. На ваш email буде надіслано інструкцію з відновлення доступу."
            }
          ].map((faq, i) => (
            <div key={i} className="bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors">
              <h3 className="text-xl font-bold text-white mb-3 flex items-start gap-3">
                <HelpCircle className="w-6 h-6 text-[#CCFF00] shrink-0 mt-0.5" />
                {faq.q}
              </h3>
              <p className="text-zinc-400 pl-9 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}

        </div>
      </div>
    </div>
  )
}
