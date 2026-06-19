import { generateRoundRobin, generateSingleElimination } from '@/lib/brackets';

describe('Bracket Tests', () => {
  describe('generateRoundRobin', () => {
    it('Should correctly generate 1-leg round robin matches for 4 teams', () => {
      const teams = ['Team A', 'Team B', 'Team C', 'Team D'];
      const tournamentId = 't1';
      
      const matches = generateRoundRobin(teams, tournamentId, 1);
      
      // 4 teams -> 3 rounds -> 2 matches per round = 6 matches
      expect(matches.length).toBe(6);
      expect(matches[0].tournamentId).toBe(tournamentId);
    });

    it('Should correctly handle odd number of teams by adding a BYE', () => {
      const teams = ['Team A', 'Team B', 'Team C'];
      const tournamentId = 't2';
      
      const matches = generateRoundRobin(teams, tournamentId, 1);
      
      // 4 teams with BYE -> 6 matches total, but BYE matches are filtered out
      // Each team plays 2 matches = 3 matches total
      expect(matches.length).toBe(3);
    });
  });

  describe('generateSingleElimination', () => {
    it('Should pair top and bottom teams correctly', () => {
      const teams = ['Team A', 'Team B', 'Team C', 'Team D'];
      const matches = generateSingleElimination(teams, 't3');
      
      expect(matches.length).toBe(2);
      expect(matches[0].homeTeamId).toBe('Team A');
      expect(matches[0].awayTeamId).toBe('Team D');
    });
  });
});
