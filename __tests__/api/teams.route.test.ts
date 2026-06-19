import { GET } from '@/app/api/teams/route';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    team: {
      findMany: jest.fn(),
      count: jest.fn(),
    }
  }
}));

jest.mock('@/lib/auth', () => ({
  auth: jest.fn(() => ({ user: { id: 'test-user' } })),
}));

describe('Teams API Route', () => {
  it('Should fetch and return teams list successfully', async () => {
    const mockTeams = [
      { id: '1', name: 'Arsenal' },
      { id: '2', name: 'Real Madrid' }
    ];

    (prisma.team.findMany as jest.Mock).mockResolvedValue(mockTeams);
    (prisma.team.count as jest.Mock).mockResolvedValue(2);

    const req = {
      url: 'http://localhost/api/teams?page=1',
      nextUrl: { searchParams: new URLSearchParams() },
    } as any;

    const { NextResponse } = require('next/server');
    jest.spyOn(NextResponse, 'json').mockImplementation((data) => ({
      status: 200,
      json: async () => data
    }));

    const response = await GET(req);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.teams).toEqual(mockTeams);
    expect(json.total).toBe(2);
  });
});
