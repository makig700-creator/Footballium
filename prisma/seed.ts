import { PrismaClient, EventType, MatchStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const Position = { GK: 'GK', DEF: 'DEF', MID: 'MID', FWD: 'FWD' }
const Role = { ADMIN: 'ADMIN', COACH: 'COACH', VIEWER: 'VIEWER' }

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

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
        bracketType: "ROUND_ROBIN",
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
