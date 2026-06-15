import { PrismaClient, MatchStatus, EventType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const Position = { GK: 'GK', DEF: 'DEF', MID: 'MID', FWD: 'FWD' }
const Role = { ADMIN: 'ADMIN', COACH: 'COACH', VIEWER: 'VIEWER', REFEREE: 'REFEREE' }
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ── Teams ─────────────────────────────────────────────────────────────────
  const arsenal = await prisma.team.upsert({
    where: { id: 'team-arsenal' },
    update: {},
    create: {
      id: 'team-arsenal',
      name: 'Arsenal FC',
      shortName: 'ARS',
      logo: '/images/teams/arsenal.svg',
      primaryColor: '#EF0107',
      city: 'London',
      stadium: 'Emirates Stadium',
      founded: 1886,
      description: 'Arsenal Football Club is a professional football club based in Islington, North London.',
    },
  })

  const chelsea = await prisma.team.upsert({
    where: { id: 'team-chelsea' },
    update: {},
    create: {
      id: 'team-chelsea',
      name: 'Chelsea FC',
      shortName: 'CHE',
      logo: '/images/teams/chelsea.svg',
      primaryColor: '#034694',
      city: 'London',
      stadium: 'Stamford Bridge',
      founded: 1905,
      description: 'Chelsea Football Club is a professional football club based in Fulham, West London.',
    },
  })

  const manCity = await prisma.team.upsert({
    where: { id: 'team-mancity' },
    update: {},
    create: {
      id: 'team-mancity',
      name: 'Manchester City',
      shortName: 'MCI',
      logo: '/images/teams/mancity.svg',
      primaryColor: '#6CABDD',
      city: 'Manchester',
      stadium: 'Etihad Stadium',
      founded: 1880,
      description: 'Manchester City FC based in East Manchester, five-time Premier League champions.',
    },
  })

  const liverpool = await prisma.team.upsert({
    where: { id: 'team-liverpool' },
    update: {},
    create: {
      id: 'team-liverpool',
      name: 'Liverpool FC',
      shortName: 'LIV',
      logo: '/images/teams/liverpool.svg',
      primaryColor: '#C8102E',
      city: 'Liverpool',
      stadium: 'Anfield',
      founded: 1892,
      description: 'Liverpool FC is a professional football club based in Liverpool, Merseyside.',
    },
  })

  console.log('✅ Teams created')

  // ── Players ───────────────────────────────────────────────────────────────
  const arsenalPlayers = [
    { id: 'p-ars-1', name: 'David Raya', position: Position.GK, number: 22, nationality: 'Spain', age: 29, height: '183cm', weight: '82kg' },
    { id: 'p-ars-2', name: 'Ben White', position: Position.DEF, number: 4, nationality: 'England', age: 27, height: '186cm', weight: '76kg' },
    { id: 'p-ars-3', name: 'Gabriel Magalhães', position: Position.DEF, number: 6, nationality: 'Brazil', age: 26, height: '190cm', weight: '84kg' },
    { id: 'p-ars-4', name: 'William Saliba', position: Position.DEF, number: 12, nationality: 'France', age: 23, height: '192cm', weight: '86kg' },
    { id: 'p-ars-5', name: 'Oleksandr Zinchenko', position: Position.DEF, number: 35, nationality: 'Ukraine', age: 27, height: '175cm', weight: '64kg' },
    { id: 'p-ars-6', name: 'Thomas Partey', position: Position.MID, number: 5, nationality: 'Ghana', age: 31, height: '185cm', weight: '77kg' },
    { id: 'p-ars-7', name: 'Martin Ødegaard', position: Position.MID, number: 8, nationality: 'Norway', age: 26, height: '178cm', weight: '68kg' },
    { id: 'p-ars-8', name: 'Declan Rice', position: Position.MID, number: 41, nationality: 'England', age: 25, height: '185cm', weight: '79kg' },
    { id: 'p-ars-9', name: 'Bukayo Saka', position: Position.FWD, number: 7, nationality: 'England', age: 22, height: '178cm', weight: '70kg' },
    { id: 'p-ars-10', name: 'Gabriel Martinelli', position: Position.FWD, number: 11, nationality: 'Brazil', age: 23, height: '181cm', weight: '75kg' },
    { id: 'p-ars-11', name: 'Leandro Trossard', position: Position.FWD, number: 19, nationality: 'Belgium', age: 29, height: '173cm', weight: '68kg' },
    { id: 'p-ars-12', name: 'Kai Havertz', position: Position.FWD, number: 29, nationality: 'Germany', age: 25, height: '189cm', weight: '83kg' },
    { id: 'p-ars-13', name: 'Jurriën Timber', position: Position.DEF, number: 2, nationality: 'Netherlands', age: 23, height: '180cm', weight: '75kg' },
  ]

  const chelseaPlayers = [
    { id: 'p-che-1', name: 'Robert Sánchez', position: Position.GK, number: 1, nationality: 'Spain', age: 26, height: '197cm', weight: '89kg' },
    { id: 'p-che-2', name: 'Reece James', position: Position.DEF, number: 24, nationality: 'England', age: 24, height: '182cm', weight: '76kg' },
    { id: 'p-che-3', name: 'Levi Colwill', position: Position.DEF, number: 26, nationality: 'England', age: 21, height: '188cm', weight: '80kg' },
    { id: 'p-che-4', name: 'Malo Gusto', position: Position.DEF, number: 27, nationality: 'France', age: 21, height: '174cm', weight: '65kg' },
    { id: 'p-che-5', name: 'Ben Chilwell', position: Position.DEF, number: 21, nationality: 'England', age: 27, height: '178cm', weight: '77kg' },
    { id: 'p-che-6', name: 'Moisés Caicedo', position: Position.MID, number: 25, nationality: 'Ecuador', age: 22, height: '178cm', weight: '72kg' },
    { id: 'p-che-7', name: 'Enzo Fernández', position: Position.MID, number: 8, nationality: 'Argentina', age: 23, height: '178cm', weight: '76kg' },
    { id: 'p-che-8', name: 'Cole Palmer', position: Position.MID, number: 20, nationality: 'England', age: 22, height: '185cm', weight: '73kg' },
    { id: 'p-che-9', name: 'Nicolas Jackson', position: Position.FWD, number: 15, nationality: 'Senegal', age: 23, height: '185cm', weight: '79kg' },
    { id: 'p-che-10', name: 'Raheem Sterling', position: Position.FWD, number: 17, nationality: 'England', age: 29, height: '170cm', weight: '69kg' },
    { id: 'p-che-11', name: 'Noni Madueke', position: Position.FWD, number: 11, nationality: 'England', age: 22, height: '180cm', weight: '72kg' },
    { id: 'p-che-12', name: 'Christopher Nkunku', position: Position.FWD, number: 18, nationality: 'France', age: 26, height: '175cm', weight: '72kg' },
    { id: 'p-che-13', name: 'Marc Cucurella', position: Position.DEF, number: 32, nationality: 'Spain', age: 25, height: '172cm', weight: '68kg' },
  ]

  for (const p of arsenalPlayers) {
    const { name, ...rest } = p;
    const [firstName, ...lastNameArr] = name.split(' ');
    const lastName = lastNameArr.join(' ') || '';
    await prisma.player.upsert({
      where: { id: p.id },
      update: {},
      create: { ...rest, firstName, lastName, teamId: arsenal.id },
    })
  }

  for (const p of chelseaPlayers) {
    const { name, ...rest } = p;
    const [firstName, ...lastNameArr] = name.split(' ');
    const lastName = lastNameArr.join(' ') || '';
    await prisma.player.upsert({
      where: { id: p.id },
      update: {},
      create: { ...rest, firstName, lastName, teamId: chelsea.id },
    })
  }

  console.log('✅ Players created')

  // ── Player Stats ──────────────────────────────────────────────────────────
  const statsData = [
    { playerId: 'p-ars-1', appearances: 28, goals: 0, assists: 0, yellowCards: 1, redCards: 0, minutesPlayed: 2520, cleanSheets: 12, rating: 7.6 },
    { playerId: 'p-ars-7', appearances: 32, goals: 8, assists: 12, yellowCards: 3, redCards: 0, minutesPlayed: 2880, cleanSheets: 0, rating: 8.2 },
    { playerId: 'p-ars-8', appearances: 30, goals: 5, assists: 9, yellowCards: 5, redCards: 0, minutesPlayed: 2700, cleanSheets: 0, rating: 7.9 },
    { playerId: 'p-ars-9', appearances: 33, goals: 16, assists: 14, yellowCards: 2, redCards: 0, minutesPlayed: 2940, cleanSheets: 0, rating: 8.5 },
    { playerId: 'p-ars-10', appearances: 31, goals: 12, assists: 8, yellowCards: 3, redCards: 0, minutesPlayed: 2640, cleanSheets: 0, rating: 7.8 },
    { playerId: 'p-ars-11', appearances: 28, goals: 10, assists: 6, yellowCards: 2, redCards: 0, minutesPlayed: 2100, cleanSheets: 0, rating: 7.5 },
    { playerId: 'p-che-8', appearances: 34, goals: 22, assists: 11, yellowCards: 4, redCards: 0, minutesPlayed: 3060, cleanSheets: 0, rating: 8.7 },
    { playerId: 'p-che-9', appearances: 32, goals: 17, assists: 5, yellowCards: 5, redCards: 1, minutesPlayed: 2700, cleanSheets: 0, rating: 7.6 },
    { playerId: 'p-che-6', appearances: 30, goals: 2, assists: 4, yellowCards: 8, redCards: 0, minutesPlayed: 2520, cleanSheets: 0, rating: 7.4 },
  ]

  for (const s of statsData) {
    await prisma.playerStats.upsert({
      where: { playerId: s.playerId },
      update: {},
      create: s,
    })
  }

  console.log('✅ Player stats created')

  // ── Standings ─────────────────────────────────────────────────────────────
  const standingsData = [
    { teamId: arsenal.id, played: 33, won: 21, drawn: 6, lost: 6, gf: 78, ga: 38, points: 69, form: 'W,W,D,W,L' },
    { teamId: manCity.id, played: 33, won: 20, drawn: 5, lost: 8, gf: 71, ga: 44, points: 65, form: 'W,L,W,W,D' },
    { teamId: liverpool.id, played: 33, won: 19, drawn: 7, lost: 7, gf: 73, ga: 42, points: 64, form: 'D,W,W,L,W' },
    { teamId: chelsea.id, played: 33, won: 14, drawn: 8, lost: 11, gf: 62, ga: 55, points: 50, form: 'L,D,W,W,D' },
  ]

  for (const s of standingsData) {
    await prisma.standings.upsert({
      where: { teamId_season_leagueId: { teamId: s.teamId, season: '2024/25', leagueId: 'premier-league' } },
      update: {},
      create: { ...s, season: '2024/25', leagueId: 'premier-league' },
    })
  }

  console.log('✅ Standings created')

  // ── Matches ───────────────────────────────────────────────────────────────
  const now = new Date()
  const match1 = await prisma.match.upsert({
    where: { id: 'match-1' },
    update: {},
    create: {
      id: 'match-1',
      homeTeamId: arsenal.id,
      awayTeamId: chelsea.id,
      homeScore: 2,
      awayScore: 1,
      status: MatchStatus.FINISHED,
      kickoff: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      venue: 'Emirates Stadium',
      season: '2024/25',
      leagueId: 'premier-league',
    },
  })

  const match2 = await prisma.match.upsert({
    where: { id: 'match-2' },
    update: {},
    create: {
      id: 'match-2',
      homeTeamId: manCity.id,
      awayTeamId: liverpool.id,
      homeScore: null,
      awayScore: null,
      status: MatchStatus.SCHEDULED,
      kickoff: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      venue: 'Etihad Stadium',
      season: '2024/25',
      leagueId: 'premier-league',
    },
  })

  const match3 = await prisma.match.upsert({
    where: { id: 'match-3' },
    update: {},
    create: {
      id: 'match-3',
      homeTeamId: chelsea.id,
      awayTeamId: arsenal.id,
      homeScore: null,
      awayScore: null,
      status: MatchStatus.SCHEDULED,
      kickoff: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
      venue: 'Stamford Bridge',
      season: '2024/25',
      leagueId: 'premier-league',
    },
  })

  const liveMatch = await prisma.match.upsert({
    where: { id: 'match-live' },
    update: {},
    create: {
      id: 'match-live',
      homeTeamId: liverpool.id,
      awayTeamId: manCity.id,
      homeScore: 1,
      awayScore: 0,
      status: MatchStatus.LIVE,
      minute: 67,
      kickoff: new Date(now.getTime() - 67 * 60 * 1000),
      venue: 'Anfield',
      season: '2024/25',
      leagueId: 'premier-league',
    },
  })

  console.log('✅ Matches created')

  // ── Match Events ──────────────────────────────────────────────────────────
  const eventsData = [
    { id: 'evt-1', matchId: match1.id, type: EventType.GOAL, minute: 23, teamId: arsenal.id, playerId: 'p-ars-9', comment: 'Bukayo Saka - Right foot shot' },
    { id: 'evt-2', matchId: match1.id, type: EventType.GOAL, minute: 55, teamId: arsenal.id, playerId: 'p-ars-10', comment: 'Gabriel Martinelli - Header' },
    { id: 'evt-3', matchId: match1.id, type: EventType.YELLOW_CARD, minute: 38, teamId: chelsea.id, playerId: 'p-che-6', comment: 'Moisés Caicedo - Tactical foul' },
    { id: 'evt-4', matchId: match1.id, type: EventType.PENALTY_GOAL, minute: 78, teamId: chelsea.id, playerId: 'p-che-9', comment: 'Nicolas Jackson - Penalty' },
    { id: 'evt-5', matchId: liveMatch.id, type: EventType.GOAL, minute: 34, teamId: liverpool.id, comment: 'Mohamed Salah - Left foot finish' },
    { id: 'evt-6', matchId: liveMatch.id, type: EventType.YELLOW_CARD, minute: 52, teamId: manCity.id, comment: 'Rodri - Late challenge' },
  ]
  for (const evt of eventsData) {
    await prisma.matchEvent.upsert({ where: { id: evt.id }, update: {}, create: evt })
  }

  console.log('✅ Match events created')

  // ── News Articles ─────────────────────────────────────────────────────────
  const articles = [
    {
      id: 'news-1',
      title: 'Арсенал здобуває надважливу перемогу над Челсі в боротьбі за топ-4',
      slug: 'arsenal-victory-chelsea-top-four-battle',
      excerpt: 'Голи Сака та Мартінеллі допомогли Арсеналу здобути три очки в пульсуючому лондонському дербі.',
      content: `Арсенал продемонстрував домінуючу гру, перемігши Челсі з рахунком 2:1 на Емірейтс Стедіум, підкріпивши свої надії на титул Прем'єр-ліги вирішальною перемогою в битві за топ-4.\n\nБукайо Сака відкрив рахунок клінічним ударом на 23-й хвилині, скориставшись передачею Едегора, і пробив повз Роберта Санчеса. "Каноніри" подвоїли перевагу завдяки чудовому удару головою Габріеля Мартінеллі після подачі Сака одразу по перерві.\n\nНіколас Джексон відіграв один м'яч з пенальті за дванадцять хвилин до кінця, створивши нервову кінцівку, але підопічні Артети вистояли і здобули всі три очки.\n\n"Це був масивний результат для нас", - сказав капітан "Арсеналу" Мартін Едегор. "Ми знали, наскільки важливою була ця гра, і гравці показали фантастичний виступ."\n\nЦя перемога виводить Арсенал на три очки вперед від Челсі в турнірній таблиці Прем'єр-ліги.`,
      category: 'Огляд матчу',
      tags: 'арсенал,челсі,премєр-ліга,огляд',
      authorName: 'Джеймс Мітчелл',
    },
    {
      id: 'news-2',
      title: 'Коул Палмер: Вундеркінд, який переписує книгу рекордів Челсі',
      slug: 'cole-palmer-chelsea-record-books',
      excerpt: 'Гравець збірної Англії демонструє блискучу форму в цьому сезоні, побивши кілька клубних рекордів.',
      content: `Коул Палмер став найвидатнішим гравцем сезону Прем'єр-ліги, побивши рекорди Челсі один за одним завдяки серії захоплюючих виступів.\n\n22-річний гравець збірної Англії забив 22 голи та віддав 11 результативних передач у 34 матчах ліги, вже перевершивши рекорд Френка Лемпарда за один сезон для півзахисника Челсі.\n\nПалмер, який перейшов з Манчестер Сіті за 40 мільйонів фунтів стерлінгів минулого літа, став справжнім відкриттям на Стемфорд Брідж, поєднуючи технічну досконалість із нетиповим для свого віку спокоєм.\n\n"Коул - це талант покоління", - сказав тренер Челсі Енцо Мареска. "Те, як він читає гру і діє під тиском, є чимось дуже особливим. Нам дуже пощастило, що він у нас є."\n\nВиступи Палмера викликали порівняння з Кевіном Де Брюйне, і багато експертів пророкують йому звання Гравця сезону.`,
      category: 'Аналітика',
      tags: 'коул-палмер,челсі,премєр-ліга,аналітика',
      authorName: 'Сара Томпсон',
    },
    {
      id: 'news-3',
      title: 'Чемпіонська гонка Прем\'єр-ліги: У кого перевага перед останніми тижнями?',
      slug: 'premier-league-title-race-final-weeks',
      excerpt: 'За п\'ять матчів до кінця три команди все ще претендують на перше місце.',
      content: `Чемпіонська гонка Прем'єр-ліги вступає у свою найважливішу фазу: Арсенал, Манчестер Сіті та Ліверпуль розділяє лише п'ять очок перед останніми п'ятьма іграми.\n\nАрсенал лідирує з 69 очками, але попереду у них складна серія матчів, включаючи виїзди на Енфілд та Етіхад. Підопічним Мікеля Артети доведеться зберегти самовладання, щоб здобути перший титул ліги з 2004 року.\n\nМанчестер Сіті, постійні чемпіони, відстають на два очки, але в цьому сезоні демонструють тривожну нестабільність. Пеп Гвардіола сподіватиметься, що Ерлінг Голанд зможе віднайти свою найкращу форму у вирішальний момент.\n\nЛіверпуль під керівництвом нового тренера перевершив усі очікування завдяки захоплюючому атакуючому футболу. Їхня домашня перевага на Енфілді може стати вирішальною.\n\n"Кожна гра тепер як фінал", - сказав гравець Арсеналу Деклан Райс. "Ми зосереджуємось на кожному матчі окремо."`,
      category: 'Аналітика',
      tags: 'арсенал,манчестер-сіті,ліверпуль,премєр-ліга,чемпіонство',
      authorName: 'Девід Кларк',
    },
    {
      id: 'news-4',
      title: 'Деклан Райс отримав виклик до збірної Англії після блискучого сезону',
      slug: 'declan-rice-england-call-up-2025',
      excerpt: 'Півзахисник Арсеналу був винагороджений за свою видатну клубну форму викликом до збірної.',
      content: `Деклан Райс був включений до складу збірної Англії на майбутні міжнародні матчі після вражаючого сезону з Арсеналом, де він зарекомендував себе як один з найкращих півзахисників у Європі.\n\nРайс, який приєднався до "Канонірів" з Вест Хема за 105 мільйонів фунтів стерлінгів, став відкриттям під керівництвом Мікеля Артети, відзначившись п'ятьма голами та дев'ятьма результативними передачами переважно з позиції опорного півзахисника.\n\nТренер збірної Англії Гарет Саутгейт сказав: "Деклан був одним з найкращих гравців Прем'єр-ліги в цьому сезоні. Його енергія, лідерство та якість роботи з м'ячем були винятковими."\n\n25-річний гравець був включений до складу команди, яка готується до півфіналу Ліги націй, де Райс, як очікується, гратиме в парі з Джудом Беллінгемом у центрі півзахисту.`,
      category: 'Новини',
      tags: 'деклан-райс,арсенал,англія,ліга-націй',
      authorName: 'Майк Фостер',
    },
    {
      id: 'news-5',
      title: 'Енфілд реве: Фортеця Ліверпуля готується до чемпіонської битви',
      slug: 'anfield-liverpool-fortress-title-showdown',
      excerpt: 'Домашня статистика Ліверпуля цього сезону бездоганна напередодні вирішального візиту Арсеналу.',
      content: `Енфілд вкотре довів, що є найстрашнішим стадіоном в англійському футболі, адже Ліверпуль готується прийняти Арсенал у матчі, який може стати визначальним у сезоні Прем'єр-ліги.\n\nЛіверпуль виграв 14 зі 16 домашніх матчів ліги цього сезону, зазнавши єдиної поразки від Манчестер Сіті ще у вересні. Атмосфера, яку створює трибуна "Коп", була визнана багатьма тренерами суперників як вирішальний фактор.\n\n"У світовому футболі немає кращої атмосфери, ніж на Енфілді під час великого єврокубкового вечора, але битва за титул наближається до цього", - сказав голкіпер Арсеналу Давід Рая. "Ми добре підготувалися і готові до виклику."\n\nВраховуючи, що Арсеналу потрібне очко, щоб зберегти лідерство на вершині, а Ліверпулю потрібні всі три, щоб обійти своїх суперників, сцена готова для класичного протистояння Прем'єр-ліги.`,
      category: 'Прев\'ю',
      tags: 'ліверпуль,арсенал,енфілд,премєр-ліга,превю',
      authorName: 'Джеймс Мітчелл',
    },
  ]

  for (const article of articles) {
    await prisma.news.upsert({
      where: { id: article.id },
      update: {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        category: article.category,
        tags: article.tags,
        authorName: article.authorName,
      },
      create: { ...article, publishedAt: new Date() },
    })
  }

  console.log('✅ News articles created')
  // ── Coach User ────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('Coach123!', 12)
  await prisma.user.upsert({
    where: { email: 'coach@gmail.com' },
    update: {},
    create: {
      email: 'coach@gmail.com',
      password: hashedPassword,
      name: 'General Coach',
      role: Role.COACH,
    },
  })

  const adminPassword = await bcrypt.hash('Admin123!', 12)
  await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      email: 'admin@gmail.com',
      password: adminPassword,
      name: 'Admin User',
      role: Role.ADMIN,
    },
  })

  console.log('✅ Users created')

  // ── Zhytomyr Teams & Players ──────────────────────────────────────────────
  const zhytomyrTeamsData = [
    { name: "Енергія", shortName: "ЕНЕ", slug: "energiya" },
    { name: 'ФК "ГУНП-ІВАНКІВ" (Житомир)', shortName: "ГІВ", slug: "gunp-ivankiv" },
    { name: "ФзК Форца", shortName: "ФОР", slug: "forza" },
    { name: 'ФК "VIVAD" (Романів)', shortName: "VIV", slug: "vivad" },
    { name: 'СК "Форсаж"', shortName: "ФРС", slug: "forsazh" },
    { name: 'ФК "Рятівник"', shortName: "РЯТ", slug: "ryativnyk" },
    { name: "Житомирська політехніка", shortName: "ЖПТ", slug: "zhytomyr-polytech" },
    { name: "INVIVO", shortName: "INV", slug: "invivo" },
    { name: "QOOBIX", shortName: "QBX", slug: "qoobix" },
    { name: "ЖВІ ім. Корольова", shortName: "ЖВІ", slug: "zhvi-korolyova" },
  ];

  const createdZhytomyrTeams: Record<string, any> = {};
  for (const t of zhytomyrTeamsData) {
    const team = await prisma.team.upsert({
      where: { id: t.slug },
      update: {},
      create: {
        id: t.slug,
        name: t.name,
        shortName: t.shortName,
        city: "Житомир",
        stadium: "ФОК",
        founded: 2020,
      }
    });
    createdZhytomyrTeams[t.name] = team;

    const coachEmail = `coach_${t.slug}@gmail.com`;
    const coach = await prisma.user.upsert({
      where: { email: coachEmail },
      update: {},
      create: {
        email: coachEmail,
        password: hashedPassword,
        name: `Тренер ${t.name}`,
        role: Role.COACH,
        teamId: team.id,
      }
    });

    await prisma.team.update({
      where: { id: team.id },
      data: { coachId: coach.id }
    });
  }

  const zhytomyrPlayersData: Record<string, string[]> = {
    "Енергія": ["Яліков Олександр", "Яцковець Ігор", "Борисевич Віталій", "Мазуренко Роман", "Петренко Дмитро", "Шевчук Андрій", "Скорода Олексій", "Тарасюк Тарас", "Базь Вадим", "Нестеренко Віталій"],
    'ФК "ГУНП-ІВАНКІВ" (Житомир)': ["Біляченко Олександр", "Смагін Вадим", "Іванов Ігор", "Слободенюк Ярослав", "Войцеховський Артем", "Вакула Дмитро", "Трибель Олександр", "Розпотнюк Олександр", "Школьний Сергій", "Рибніков Микита"],
    "ФзК Форца": ["Дорош Олександр", "Лисюк Владислав", "Бовсунюк Олександр", "Ковпак Іван", "Чайківський Дмитро", "Самчик Артем", "Фудзіцький Максим", "Близнюк Назар", "Меліченко Владислав", "Левковський Олександр"],
    'ФК "VIVAD" (Романів)': ["Поліщук Ілля", "Березін Микола", "Мельниченко Владислав", "Шевчук Володимир", "Духніч Михайло", "Кучерчук Петро", "Павловський Денис", "Барановський Богдан", "Бондар Олександр", "Кужіль Юрій"],
    'СК "Форсаж"': ["Гриневич Денис", "Гаджієв Роман", "Орлик Андрій", "Чапський Іван", "Алєксєєв Роман", "Алєксєєв Нікіта", "Красовський Дмитро", "Мосійчук Богдан", "Ясинський Ярослав", "Подорожній Кирило"],
    'ФК "Рятівник"': ["Круць Роман", "Кучерчук Ілля", "Рубан Ярослав", "Сімонович Євгеній", "Федорчук Віктор", "Коваль Віталій", "Дзюба Микола", "Русецький Сергій", "Захарченко Дмитро", "Синицький Богдан"],
    "Житомирська політехніка": ["Дмитренко-Батюта Нікіта", "Нідзельський Микола", "Лозовий Артем", "Машков Денис", "Шелягін Ігор", "Білошицький Максим", "Яблонський Артем", "Березовський Дмитро", "Поліщук Ярослав", "Нестерчук Артем"],
    "INVIVO": ["Пахомов Віталій", "Литвиновський Сергій", "Кобернюк Юрій", "Поліщук Юрій", "Білошицький Олександр", "Талько Павло", "Бродський Олег", "Вдовін Олег", "Марчук Костянтин", "Дума Олександр"],
    "QOOBIX": ["Савченко Артем", "Расковалов Ярослав", "Коваль Юрій", "Вікарій Олександр", "Малинівський Олександр", "Федорук Олександр", "Прохорчук Андрій", "Ковальчук Назар", "Стрельцов Едуард", "Дубчак Ярослав"],
    "ЖВІ ім. Корольова": ["Лінов Богдан", "Тимощук Володимир", "Вальо Петро", "Паламарчук Артем", "Литвинов Назар", "Савчук Євген", "Рогаль Роман", "Серяков Іван", "Янишевський Тарас", "Валєєв Олександр"]
  };

  for (const [teamName, players] of Object.entries(zhytomyrPlayersData)) {
    const team = createdZhytomyrTeams[teamName];
    for (let i = 0; i < players.length; i++) {
      const fullName = players[i];
      const [firstName, ...lastNameArr] = fullName.split(' ');
      const lastName = lastNameArr.join(' ') || '';
      await prisma.player.upsert({
        where: { id: `p-${team.id}-${i}` },
        update: {},
        create: {
          id: `p-${team.id}-${i}`,
          firstName,
          lastName,
          position: i === 0 ? Position.GK : Position.MID,
          number: i + 1,
          nationality: 'Ukraine',
          age: 25,
          teamId: team.id
        }
      });
    }
  }

  console.log('✅ Zhytomyr Teams & Players created')

  // ── Zhytomyr Tournament ───────────────────────────────────────────────────
  const adminUser = await prisma.user.findUnique({ where: { email: 'admin@gmail.com' } });
  if (adminUser) {
    const ztTournament = await prisma.tournament.upsert({
      where: { id: 'tournament-zhytomyr' },
      update: {},
      create: {
        id: 'tournament-zhytomyr',
        name: "ЧЕМПІОНАТ ЖО м. ЖИТОМИР (ЕД)",
        description: "Чемпіонат Житомирської області з футзалу, сезон 2025/2026",
        status: "FINISHED",
        bracketType: "По колу",
        maxTeams: 10,
        minTeams: 10,
        startDate: new Date("2025-10-19"),
        endDate: new Date("2026-03-08"),
        registrationDeadline: new Date("2025-10-01"),
        createdById: adminUser.id,
      }
    });

    // Add teams to tournament
    for (const team of Object.values(createdZhytomyrTeams)) {
      await prisma.tournamentTeam.upsert({
        where: { id: `tt-${team.id}` },
        update: {},
        create: {
          id: `tt-${team.id}`,
          tournamentId: ztTournament.id,
          teamId: team.id,
          status: "APPROVED",
        }
      });
    }

    // Add standings
    const standingsRaw = [
      { team: "Енергія", played: 18, won: 15, drawn: 2, lost: 1, goalsFor: 101, goalsAgainst: 34, points: 47 },
      { team: 'ФК "ГУНП-ІВАНКІВ" (Житомир)', played: 18, won: 13, drawn: 3, lost: 2, goalsFor: 77, goalsAgainst: 35, points: 42 },
      { team: "ФзК Форца", played: 18, won: 13, drawn: 1, lost: 4, goalsFor: 53, goalsAgainst: 34, points: 40 },
      { team: 'ФК "VIVAD" (Романів)', played: 18, won: 12, drawn: 2, lost: 4, goalsFor: 76, goalsAgainst: 35, points: 38 },
      { team: 'СК "Форсаж"', played: 18, won: 9, drawn: 1, lost: 8, goalsFor: 52, goalsAgainst: 45, points: 28 },
      { team: 'ФК "Рятівник"', played: 18, won: 7, drawn: 3, lost: 8, goalsFor: 50, goalsAgainst: 52, points: 24 },
      { team: "Житомирська політехніка", played: 18, won: 3, drawn: 3, lost: 12, goalsFor: 26, goalsAgainst: 71, points: 12 },
      { team: "INVIVO", played: 18, won: 3, drawn: 1, lost: 14, goalsFor: 31, goalsAgainst: 87, points: 10 },
      { team: "QOOBIX", played: 18, won: 3, drawn: 1, lost: 14, goalsFor: 32, goalsAgainst: 72, points: 10 },
      { team: "ЖВІ ім. Корольова", played: 18, won: 3, drawn: 1, lost: 14, goalsFor: 27, goalsAgainst: 60, points: 10 },
    ];

    let position = 1;
    for (const s of standingsRaw) {
      const team = createdZhytomyrTeams[s.team];
      if (team) {
        await prisma.tournamentStanding.upsert({
          where: { tournamentId_teamId: { tournamentId: ztTournament.id, teamId: team.id } },
          update: {},
          create: {
            id: `ts-${ztTournament.id}-${team.id}`,
            tournamentId: ztTournament.id,
            teamId: team.id,
            position: position++,
            played: s.played,
            won: s.won,
            drawn: s.drawn,
            lost: s.lost,
            goalsFor: s.goalsFor,
            goalsAgainst: s.goalsAgainst,
            goalDiff: s.goalsFor - s.goalsAgainst,
            points: s.points,
            updatedAt: new Date(),
          }
        });
      }
    }

    console.log('✅ Zhytomyr Tournament & Standings created')
  }
  console.log('🎉 Database seeded successfully!')
  console.log('')
  console.log('Login credentials:')
  console.log('  Coach: coach@gmail.com / Coach123!')
  console.log('  Admin: admin@gmail.com / Admin123!')
  console.log('  Zhytomyr Coaches (Password: Coach123!):')
  for (const t of zhytomyrTeamsData) {
    console.log(`    ${t.name}: coach_${t.slug}@gmail.com`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
