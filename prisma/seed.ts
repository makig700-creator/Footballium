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
