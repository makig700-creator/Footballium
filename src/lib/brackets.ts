import { TournamentTeam, Match } from "@prisma/client";

/**
 * Helper to get the base start date (next Saturday at 10:00 AM)
 */
function getBaseStartDate(): Date {
  const date = new Date();
  const day = date.getDay();
  const daysUntilSaturday = (6 - day + 7) % 7;
  const startDays = daysUntilSaturday === 0 ? 7 : daysUntilSaturday;
  date.setDate(date.getDate() + startDays);
  date.setHours(10, 0, 0, 0);
  return date;
}

/**
 * Helper to generate Round Robin matches.
 * Uses the circle method.
 */
export function generateRoundRobin(
  teams: { id: string; stadium: string }[],
  tournamentId: string,
  legs: number = 1
): Omit<Match, "id" | "createdAt" | "updatedAt" | "minute" | "lineup" | "homeScore" | "awayScore" | "scheduledAt" | "refereeId" | "startedAt" | "finishedAt">[] {
  const matches: Omit<Match, "id" | "createdAt" | "updatedAt" | "minute" | "lineup" | "homeScore" | "awayScore" | "scheduledAt" | "refereeId" | "startedAt" | "finishedAt">[] = [];
  const numTeams = teams.length;
  const stadiumMap = new Map(teams.map(t => [t.id, t.stadium]));

  // If odd number of teams, add a dummy team for a "bye"
  const teamsWithBye = numTeams % 2 !== 0 ? [...teams, { id: "BYE", stadium: "TBD" }] : [...teams];
  const totalRounds = teamsWithBye.length - 1;
  const matchesPerRound = teamsWithBye.length / 2;

  let currentTeams = [...teamsWithBye];
  const startDate = getBaseStartDate();

  let matchNumber = 1;
  for (let round = 1; round <= totalRounds; round++) {
    let matchInRound = 0;
    for (let match = 0; match < matchesPerRound; match++) {
      const homeTeam = currentTeams[match];
      const awayTeam = currentTeams[currentTeams.length - 1 - match];

      if (homeTeam.id !== "BYE" && awayTeam.id !== "BYE") {
        const matchDate = new Date(startDate);
        matchDate.setDate(matchDate.getDate() + (round - 1) * 7);
        matchDate.setHours(matchDate.getHours() + matchInRound);

        matches.push({
          tournamentId,
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          round,
          matchNumber,
          status: "SCHEDULED",
          kickoff: matchDate,
          venue: homeTeam.stadium || "TBD",
          season: "2024/25",
          leagueId: "tournament",
        });
        matchNumber++;
        matchInRound++;
      }
    }
    // Rotate array: first element stays, rest rotate right
    const first = currentTeams[0];
    const last = currentTeams.pop()!;
    currentTeams = [first, last, ...currentTeams.slice(1)];
  }

  // If 2 legs, duplicate matches with swapped home/away
  if (legs === 2) {
    const firstLegMatches = [...matches];
    for (const m of firstLegMatches) {
      matches.push({
        ...m,
        homeTeamId: m.awayTeamId as string,
        awayTeamId: m.homeTeamId,
        round: m.round! + totalRounds,
        matchNumber: matchNumber++,
        venue: stadiumMap.get(m.awayTeamId as string) || "TBD",
      });
    }
  }

  return matches;
}

/**
 * Helper to generate Single Elimination matches.
 */
export function generateSingleElimination(
  teams: { id: string; stadium: string }[],
  tournamentId: string
): Omit<Match, "id" | "createdAt" | "updatedAt" | "minute" | "lineup" | "homeScore" | "awayScore" | "scheduledAt" | "refereeId" | "startedAt" | "finishedAt">[] {
  const matches: Omit<Match, "id" | "createdAt" | "updatedAt" | "minute" | "lineup" | "homeScore" | "awayScore" | "scheduledAt" | "refereeId" | "startedAt" | "finishedAt">[] = [];
  const numTeams = teams.length;
  const stadiumMap = new Map(teams.map(t => [t.id, t.stadium]));

  // Find next power of 2
  const nextPow2 = Math.pow(2, Math.ceil(Math.log2(numTeams)));
  const byes = nextPow2 - numTeams;

  // Add byes
  const teamsWithByes = [...teams];
  for (let i = 0; i < byes; i++) {
    teamsWithByes.push({ id: "BYE", stadium: "TBD" });
  }

  // Shuffle teams (optional, but let's keep it sequential for now)
  // or simple pairing

  // Generate first round matches
  const round = 1;
  let matchNumber = 1;
  let matchInRound = 0;
  const startDate = getBaseStartDate();

  // Create matches by pairing teams
  // E.g. Team 1 vs Team 16, Team 2 vs Team 15, etc.
  // We'll pair top vs bottom
  for (let i = 0; i < teamsWithByes.length / 2; i++) {
    const homeTeam = teamsWithByes[i];
    const awayTeam = teamsWithByes[teamsWithByes.length - 1 - i];

    const matchDate = new Date(startDate);
    matchDate.setDate(matchDate.getDate() + (round - 1) * 7);
    matchDate.setHours(matchDate.getHours() + matchInRound);

    matches.push({
      tournamentId,
      homeTeamId: homeTeam.id === "BYE" ? null! : homeTeam.id, // Handle appropriately if BYE
      awayTeamId: awayTeam.id === "BYE" ? null : awayTeam.id,
      round,
      matchNumber,
      status: awayTeam.id === "BYE" || homeTeam.id === "BYE" ? "FINISHED" : "SCHEDULED",
      kickoff: matchDate,
      venue: homeTeam.id !== "BYE" ? homeTeam.stadium : "TBD",
      season: "2024/25",
      leagueId: "tournament",
    });
    matchNumber++;
    matchInRound++;
  }

  return matches;
}
