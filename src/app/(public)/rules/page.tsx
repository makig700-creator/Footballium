import { Trophy, BookOpen, AlertCircle, Users } from 'lucide-react'

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-zinc-950 pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#CCFF00]/10 border border-[#CCFF00]/20 mb-6 shadow-[0_0_30px_rgba(204,255,0,0.15)]">
            <Trophy className="w-8 h-8 text-[#CCFF00]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 uppercase">Правила Турнірів</h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Офіційний регламент проведення змагань на платформі Footballium, заснований на стандартах УАФ та FIFA.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          
          <section className="bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Users className="w-6 h-6 text-[#CCFF00]" />
              1. Формат та Реєстрація
            </h2>
            <div className="space-y-4 text-zinc-300 leading-relaxed">
              <p>1.1. До участі в турнірах допускаються аматорські та напівпрофесійні команди, які вчасно подали заявку та сплатили внесок (якщо він передбачений).</p>
              <p>1.2. Формат змагань (11х11, 8х8, 5х5) визначається організатором перед початком сезону.</p>
              <p>1.3. Заявка команди повинна містити не менше мінімальної кількості гравців для відповідного формату та не більше встановленого ліміту.</p>
              <p>1.4. Дозаявка гравців дозволяється лише у спеціально відведені трансферні вікна.</p>
            </div>
          </section>

          <section className="bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-blue-400" />
              2. Система нарахування очок
            </h2>
            <div className="space-y-4 text-zinc-300 leading-relaxed">
              <p>2.1. Перемога в основний час — <strong>3 очки</strong>.</p>
              <p>2.2. Нічия в основний час — <strong>1 очко</strong>.</p>
              <p>2.3. Поразка в основний час — <strong>0 очок</strong>.</p>
              <p>2.4. У разі рівності очок у двох або більше команд, місця визначаються за наступними критеріями:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Результати особистих зустрічей;</li>
                <li>Різниця забитих та пропущених м'ячів;</li>
                <li>Більша кількість забитих м'ячів.</li>
              </ul>
            </div>
          </section>

          <section className="bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-500" />
              3. Дисциплінарні санкції
            </h2>
            <div className="space-y-4 text-zinc-300 leading-relaxed">
              <p>3.1. Жовті та червоні картки сумуються протягом всього турніру.</p>
              <p>3.2. Гравець, який отримав червону картку (або дві жовті в одному матчі), автоматично пропускає наступний матч своєї команди.</p>
              <p>3.3. Систематичні порушення дисципліни (бійки, образи арбітрів) караються тривалою дискваліфікацією згідно з рішенням Контрольно-дисциплінарного комітету.</p>
              <p>3.4. Команді зараховується технічна поразка (0:3) у разі неявки на матч або участі незаявленого/дискваліфікованого гравця.</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
