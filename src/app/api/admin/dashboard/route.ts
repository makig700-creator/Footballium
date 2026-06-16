import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { subMonths, startOfMonth, format } from "date-fns";

export async function GET() {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const thisMonthStart = startOfMonth(now);

    // Stats
    const [
      totalTournaments, newTournaments,
      totalTeams, newTeams,
      totalUsers, usersLastMonth, usersThisMonth,
      liveMatchesCount
    ] = await Promise.all([
      prisma.tournament.count(),
      prisma.tournament.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.team.count(),
      prisma.team.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: lastMonthStart, lt: thisMonthStart } } }),
      prisma.user.count({ where: { createdAt: { gte: thisMonthStart } } }),
      prisma.match.count({ where: { status: "LIVE" } })
    ]);

    let growthPercent = 0;
    if (usersLastMonth > 0) {
      growthPercent = Math.round(((usersThisMonth - usersLastMonth) / usersLastMonth) * 100);
    } else if (usersThisMonth > 0) {
      growthPercent = 100;
    }

    // Pending applications
    const pendingApplicationsRaw = await prisma.tournamentTeam.findMany({
      where: { status: "PENDING" },
      orderBy: { appliedAt: "desc" },
      take: 5,
      include: {
        team: true,
        tournament: true
      }
    });

    const pendingApplications = pendingApplicationsRaw.map(app => ({
      id: app.id,
      appId: app.id, // For the API
      tournamentId: app.tournamentId,
      teamName: app.team.name,
      tournamentName: app.tournament.name,
      appliedAt: app.appliedAt
    }));

    // Live Matches
    const liveMatchesRaw = await prisma.match.findMany({
      where: { status: "LIVE" },
      include: {
        homeTeam: true,
        awayTeam: true,
        tournament: true
      }
    });

    const liveMatches = liveMatchesRaw.map(m => ({
      id: m.id,
      tournamentId: m.tournamentId,
      homeTeam: m.homeTeam,
      awayTeam: m.awayTeam,
      homeScore: m.homeScore,
      awayScore: m.awayScore,
      minute: m.minute,
      tournamentName: m.tournament?.name || "Товариський матч"
    }));

    // Upcoming Matches
    const upcomingMatchesRaw = await prisma.match.findMany({
      where: { status: "SCHEDULED", scheduledAt: { gt: now } },
      orderBy: { scheduledAt: "asc" },
      take: 3,
      include: {
        homeTeam: true,
        awayTeam: true,
        tournament: true
      }
    });

    const upcomingMatches = upcomingMatchesRaw.map(m => ({
      id: m.id,
      tournamentId: m.tournamentId,
      homeTeam: m.homeTeam,
      awayTeam: m.awayTeam,
      scheduledAt: m.scheduledAt,
      tournamentName: m.tournament?.name || "Товариський матч"
    }));

    // Main Match
    let mainMatch = null;
    if (liveMatches.length > 0) {
      mainMatch = liveMatches[0];
    } else if (upcomingMatches.length > 0) {
      mainMatch = upcomingMatches[0];
    }

    // User Growth Chart
    const twelveMonthsAgo = startOfMonth(subMonths(now, 11));
    const usersTimeline = await prisma.user.findMany({
      where: { createdAt: { gte: twelveMonthsAgo } },
      select: { createdAt: true }
    });

    const monthlyCounts: Record<string, number> = {};
    for (let i = 11; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const monthStr = format(monthDate, 'MMM');
      monthlyCounts[monthStr] = 0;
    }

    usersTimeline.forEach(u => {
      const monthStr = format(u.createdAt, 'MMM');
      if (monthlyCounts[monthStr] !== undefined) {
        monthlyCounts[monthStr]++;
      }
    });

    const userGrowthChart = Object.entries(monthlyCounts).map(([month, count]) => ({
      month, count
    }));

    return NextResponse.json({
      stats: {
        tournaments: { total: totalTournaments, newThisMonth: newTournaments },
        teams: { total: totalTeams, newThisMonth: newTeams },
        users: { total: totalUsers, growthPercent },
        liveMatches: { count: liveMatchesCount }
      },
      pendingApplications,
      liveMatches,
      upcomingMatches,
      mainMatch,
      userGrowthChart
    });

  } catch (error) {
    console.error("[ADMIN_DASHBOARD_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
