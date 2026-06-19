import { recalculateMatchStats } from '@/lib/stats-calculator';
import { prisma } from '@/lib/prisma';
import { EventType } from '@prisma/client';

// Mock prisma client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    match: {
      findUnique: jest.fn(),
      update: jest.fn(),
    }
  }
}));

describe('StatsCalculator Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should calculate score correctly from match events', async () => {
    const mockMatch = {
      id: 'm1',
      homeTeamId: 't1',
      awayTeamId: 't2',
      events: [
        { type: EventType.GOAL, teamId: 't1' },
        { type: EventType.PENALTY_GOAL, teamId: 't1' },
        { type: EventType.OWN_GOAL, teamId: 't1' }, // Home own goal gives point to away
        { type: EventType.GOAL, teamId: 't2' },
      ]
    };

    (prisma.match.findUnique as jest.Mock).mockResolvedValue(mockMatch);

    await recalculateMatchStats('m1');

    // Home scored 2 goals. Away scored 1 goal + 1 own goal from home = 2 goals.
    expect(prisma.match.update).toHaveBeenCalledWith({
      where: { id: 'm1' },
      data: { homeScore: 2, awayScore: 2 }
    });
  });
});
