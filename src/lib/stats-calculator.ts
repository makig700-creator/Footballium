import { prisma } from "./prisma";
import { EventType, MatchStatus } from "@prisma/client";

export async function recalculateMatchStats(matchId: string) {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: { events: true }
  });
  
  if (!match) return;

  let homeScore = 0;
  let awayScore = 0;

  for (const event of match.events) {
    if (event.type === EventType.GOAL || event.type === EventType.PENALTY_GOAL) {
      if (event.teamId === match.homeTeamId) {
        homeScore += 1;
      } else if (event.teamId === match.awayTeamId) {
        awayScore += 1;
      }
    } else if (event.type === EventType.OWN_GOAL) {
      if (event.teamId === match.homeTeamId) {
        awayScore += 1; // Own goal by home gives point to away
      } else if (event.teamId === match.awayTeamId) {
        homeScore += 1; // Own goal by away gives point to home
      }
    }
  }

  await prisma.match.update({
    where: { id: matchId },
    data: { homeScore, awayScore }
  });
}

export async function recalculateStandings(tournamentId: string) {
  const tournamentTeams = await prisma.tournamentTeam.findMany({
    where: { tournamentId, status: "APPROVED" }
  });

  const matches = await prisma.match.findMany({
    where: { 
      tournamentId, 
      status: MatchStatus.FINISHED 
    }
  });

  const teamStats = new Map<string, any>();

  for (const tt of tournamentTeams) {
    teamStats.set(tt.teamId, {
      played: 0, won: 0, drawn: 0, lost: 0,
      goalsFor: 0, goalsAgainst: 0, points: 0, goalDiff: 0
    });
  }

  for (const match of matches) {
    if (match.homeScore === null || match.awayScore === null || !match.awayTeamId) continue;
    
    // Ensure both teams are in the map
    if (!teamStats.has(match.homeTeamId)) {
      teamStats.set(match.homeTeamId, { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0, goalDiff: 0 });
    }
    if (!teamStats.has(match.awayTeamId)) {
      teamStats.set(match.awayTeamId, { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0, goalDiff: 0 });
    }

    const home = teamStats.get(match.homeTeamId);
    const away = teamStats.get(match.awayTeamId);

    if (home) {
      home.played += 1;
      home.goalsFor += match.homeScore;
      home.goalsAgainst += match.awayScore;
      home.goalDiff = home.goalsFor - home.goalsAgainst;

      if (match.homeScore > match.awayScore) {
        home.won += 1;
        home.points += 3;
      } else if (match.homeScore === match.awayScore) {
        home.drawn += 1;
        home.points += 1;
      } else {
        home.lost += 1;
      }
    }

    if (away) {
      away.played += 1;
      away.goalsFor += match.awayScore;
      away.goalsAgainst += match.homeScore;
      away.goalDiff = away.goalsFor - away.goalsAgainst;

      if (match.awayScore > match.homeScore) {
        away.won += 1;
        away.points += 3;
      } else if (match.awayScore === match.homeScore) {
        away.drawn += 1;
        away.points += 1;
      } else {
        away.lost += 1;
      }
    }
  }

  const sortedTeams = Array.from(teamStats.entries()).map(([teamId, stats]) => ({
    teamId, ...stats
  })).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
    return b.goalsFor - a.goalsFor;
  });

  // Transaction to delete old and create new
  await prisma.$transaction([
    prisma.tournamentStanding.deleteMany({
      where: { tournamentId }
    }),
    ...sortedTeams.map((team, index) => 
      prisma.tournamentStanding.create({
        data: {
          id: crypto.randomUUID(),
          tournamentId,
          teamId: team.teamId,
          position: index + 1,
          played: team.played,
          won: team.won,
          drawn: team.drawn,
          lost: team.lost,
          goalsFor: team.goalsFor,
          goalsAgainst: team.goalsAgainst,
          goalDiff: team.goalDiff,
          points: team.points,
          updatedAt: new Date()
        }
      })
    )
  ]);
}

export async function recalculatePlayerStats(playerId: string, tournamentId: string) {
  const matches = await prisma.match.findMany({
    where: { tournamentId },
    select: { id: true, status: true, lineup: { include: { slots: true } } }
  });

  const matchIds = matches.map(m => m.id);

  const events = await prisma.matchEvent.findMany({
    where: { 
      matchId: { in: matchIds },
      playerId: playerId
    }
  });

  let goals = 0;
  let ownGoals = 0;
  let yellowCards = 0;
  let redCards = 0;
  
  for (const event of events) {
    if (event.type === EventType.GOAL || event.type === EventType.PENALTY_GOAL) goals += 1;
    if (event.type === EventType.OWN_GOAL) ownGoals += 1;
    if (event.type === EventType.YELLOW_CARD) yellowCards += 1;
    if (event.type === EventType.RED_CARD) redCards += 1;
  }

  let matchesPlayed = 0;
  let minutesPlayed = 0;
  
  for (const match of matches) {
    if (match.status !== MatchStatus.FINISHED) continue;
    if (match.lineup?.slots.some(s => s.playerId === playerId)) {
      matchesPlayed += 1;
      minutesPlayed += 90; // Approximation
    }
  }

  await prisma.playerStats.upsert({
    where: {
      playerId_tournamentId: {
        playerId,
        tournamentId
      }
    },
    update: {
      goals, ownGoals, yellowCards, redCards, matchesPlayed, minutesPlayed, updatedAt: new Date()
    },
    create: {
      playerId, tournamentId, goals, ownGoals, yellowCards, redCards, matchesPlayed, minutesPlayed, updatedAt: new Date()
    }
  });
}
