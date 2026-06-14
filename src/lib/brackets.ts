import { TournamentTeam, Match } from "@prisma/client";

/**
 * Helper to generate Round Robin matches.
 * Uses the circle method.
 */
export function generateRoundRobin(
  teams: string[],
  tournamentId: string
): Omit<Match, "id" | "createdAt" | "updatedAt" | "minute" | "lineup" | "homeScore" | "awayScore" | "scheduledAt">[] {
  const matches: Omit<Match, "id" | "createdAt" | "updatedAt" | "minute" | "lineup" | "homeScore" | "awayScore" | "scheduledAt">[] = [];
  const numTeams = teams.length;

  // If odd number of teams, add a dummy team for a "bye"
  const teamsWithBye = numTeams % 2 !== 0 ? [...teams, "BYE"] : [...teams];
  const totalRounds = teamsWithBye.length - 1;
  const matchesPerRound = teamsWithBye.length / 2;

  let currentTeams = [...teamsWithBye];

  let matchNumber = 1;
  for (let round = 1; round <= totalRounds; round++) {
    for (let match = 0; match < matchesPerRound; match++) {
      const homeTeamId = currentTeams[match];
      const awayTeamId = currentTeams[currentTeams.length - 1 - match];

      if (homeTeamId !== "BYE" && awayTeamId !== "BYE") {
        matches.push({
          tournamentId,
          homeTeamId,
          awayTeamId,
          round,
          matchNumber,
          status: "SCHEDULED",
          kickoff: new Date(), // This needs to be set properly later
          venue: "TBD",
          season: "2024/25",
          leagueId: "tournament",
        });
        matchNumber++;
      }
    }
    // Rotate array: first element stays, rest rotate right
    const first = currentTeams[0];
    const last = currentTeams.pop()!;
    currentTeams = [first, last, ...currentTeams.slice(1)];
  }

  return matches;
}

/**
 * Helper to generate Single Elimination matches.
 */
export function generateSingleElimination(
  teams: string[],
  tournamentId: string
): Omit<Match, "id" | "createdAt" | "updatedAt" | "minute" | "lineup" | "homeScore" | "awayScore" | "scheduledAt">[] {
  const matches: Omit<Match, "id" | "createdAt" | "updatedAt" | "minute" | "lineup" | "homeScore" | "awayScore" | "scheduledAt">[] = [];
  const numTeams = teams.length;

  // Find next power of 2
  const nextPow2 = Math.pow(2, Math.ceil(Math.log2(numTeams)));
  const byes = nextPow2 - numTeams;

  // Add byes
  const teamsWithByes = [...teams];
  for (let i = 0; i < byes; i++) {
    teamsWithByes.push("BYE");
  }

  // Shuffle teams (optional, but let's keep it sequential for now)
  // or simple pairing

  // Generate first round matches
  const round = 1;
  let matchNumber = 1;

  // Create matches by pairing teams
  // E.g. Team 1 vs Team 16, Team 2 vs Team 15, etc.
  // We'll pair top vs bottom
  for (let i = 0; i < teamsWithByes.length / 2; i++) {
    const homeTeamId = teamsWithByes[i];
    const awayTeamId = teamsWithByes[teamsWithByes.length - 1 - i];

    matches.push({
      tournamentId,
      homeTeamId: homeTeamId === "BYE" ? null! : homeTeamId, // Handle appropriately if BYE
      awayTeamId: awayTeamId === "BYE" ? null : awayTeamId,
      round,
      matchNumber,
      status: awayTeamId === "BYE" || homeTeamId === "BYE" ? "FINISHED" : "SCHEDULED",
      kickoff: new Date(),
      venue: "TBD",
      season: "2024/25",
      leagueId: "tournament",
    });
    matchNumber++;
  }

  return matches;
}
