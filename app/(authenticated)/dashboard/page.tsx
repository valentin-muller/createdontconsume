import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { socialPlatformService } from '@/lib/socialPlatformService'
import { hasPostedToday } from '@/lib/streaks'
import { redirect } from 'next/navigation'
import MetricsCards from '@/components/MetricsCards'
import StreakCard from '@/components/StreakCard'
import RecentPosts from '@/components/RecentPosts'
import QuickStatsWidget from '@/components/QuickStatsWidget'

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  // Fetch follower counts
  const followerCounts = await socialPlatformService.getFollowerCounts(session.userId)

  // Calculate 7-day delta (mock for now)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const followerDeltas: Record<string, number> = {}
  for (const platform of ['x', 'instagram', 'youtube']) {
    const oldMetric = await prisma.dailyMetric.findFirst({
      where: {
        userId: session.userId,
        platform,
        date: {
          lte: sevenDaysAgo,
        },
      },
      orderBy: {
        date: 'desc',
      },
    })

    const oldCount = oldMetric?.followers || 0
    followerDeltas[platform] = followerCounts[platform as keyof typeof followerCounts] - oldCount
  }

  // Get streak
  const streak = await prisma.streak.findUnique({
    where: { userId: session.userId },
  })

  const postedToday = await hasPostedToday(session.userId)

  // Calculate this week vs last week stats
  const startOfThisWeek = new Date(today)
  startOfThisWeek.setDate(today.getDate() - today.getDay())
  startOfThisWeek.setHours(0, 0, 0, 0)

  const startOfLastWeek = new Date(startOfThisWeek)
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7)

  const endOfLastWeek = new Date(startOfThisWeek)
  endOfLastWeek.setMilliseconds(-1)

  const thisWeekPosts = await prisma.contentItem.count({
    where: {
      userId: session.userId,
      status: 'published',
      publishedAt: {
        gte: startOfThisWeek,
      },
    },
  })

  const lastWeekPosts = await prisma.contentItem.count({
    where: {
      userId: session.userId,
      status: 'published',
      publishedAt: {
        gte: startOfLastWeek,
        lte: endOfLastWeek,
      },
    },
  })

  // Get follower counts for this week and last week
  const totalFollowersThisWeek = Object.values(followerCounts).reduce((a, b) => a + b, 0)

  const lastWeekMetrics = await prisma.dailyMetric.findMany({
    where: {
      userId: session.userId,
      date: {
        gte: startOfLastWeek,
        lt: startOfThisWeek,
      },
    },
    orderBy: {
      date: 'desc',
    },
  })

  const lastWeekFollowersMap: Record<string, number> = {}
  for (const platform of ['x', 'instagram', 'youtube']) {
    const platformMetric = lastWeekMetrics.find(m => m.platform === platform)
    lastWeekFollowersMap[platform] = platformMetric?.followers || followerCounts[platform as keyof typeof followerCounts]
  }
  const totalFollowersLastWeek = Object.values(lastWeekFollowersMap).reduce((a, b) => a + b, 0)

  // Get recent posts
  const recentPosts = await prisma.contentItem.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      metrics: true,
    },
  })

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Track your creator metrics and content output.
          </p>
        </div>
      </div>

      {/* Quick Stats Widget */}
      <div className="mt-8">
        <QuickStatsWidget
          thisWeek={{
            posts: thisWeekPosts,
            followers: totalFollowersThisWeek,
          }}
          lastWeek={{
            posts: lastWeekPosts,
            followers: totalFollowersLastWeek,
          }}
        />
      </div>

      <div className="mt-8">
        <MetricsCards
          followerCounts={followerCounts}
          followerDeltas={followerDeltas}
        />
      </div>

      <div className="mt-8">
        <StreakCard
          currentStreakDays={streak?.currentStreakDays || 0}
          longestStreakDays={streak?.longestStreakDays || 0}
          postedToday={postedToday}
        />
      </div>

      <div className="mt-8">
        <RecentPosts posts={recentPosts} />
      </div>
    </div>
  )
}
