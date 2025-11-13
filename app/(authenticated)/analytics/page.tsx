import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import AnalyticsCharts from '@/components/AnalyticsCharts'
import PlatformBreakdown from '@/components/PlatformBreakdown'
import ExportAnalyticsButton from '@/components/ExportAnalyticsButton'

export default async function AnalyticsPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  // Get last 30 days of metrics
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const dailyMetrics = await prisma.dailyMetric.findMany({
    where: {
      userId: session.userId,
      date: {
        gte: thirtyDaysAgo,
      },
    },
    orderBy: {
      date: 'asc',
    },
  })

  // Get total posts per platform
  const postsByPlatform = await prisma.contentItem.groupBy({
    by: ['platform', 'status'],
    where: {
      userId: session.userId,
    },
    _count: {
      id: true,
    },
  })

  // Get engagement metrics (including all data for export)
  const contentWithMetrics = await prisma.contentItem.findMany({
    where: {
      userId: session.userId,
      status: 'published',
    },
    include: {
      metrics: true,
    },
    select: {
      id: true,
      platform: true,
      type: true,
      text: true,
      publishedAt: true,
      metrics: {
        select: {
          impressions: true,
          likes: true,
          shares: true,
          comments: true,
        },
      },
    },
  })

  // Calculate averages
  const totalPosts = contentWithMetrics.length
  const totalImpressions = contentWithMetrics.reduce(
    (sum, item) => sum + (item.metrics?.impressions || 0),
    0
  )
  const totalLikes = contentWithMetrics.reduce(
    (sum, item) => sum + (item.metrics?.likes || 0),
    0
  )
  const totalComments = contentWithMetrics.reduce(
    (sum, item) => sum + (item.metrics?.comments || 0),
    0
  )

  const avgImpressions = totalPosts > 0 ? Math.round(totalImpressions / totalPosts) : 0
  const avgLikes = totalPosts > 0 ? Math.round(totalLikes / totalPosts) : 0
  const avgComments = totalPosts > 0 ? Math.round(totalComments / totalPosts) : 0
  const engagementRate =
    totalImpressions > 0
      ? ((totalLikes + totalComments) / totalImpressions * 100).toFixed(2)
      : '0.00'

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Analytics</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Track your content performance and growth over time.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <ExportAnalyticsButton
            data={{
              posts: contentWithMetrics,
              dailyMetrics: dailyMetrics,
            }}
          />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Posts</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{totalPosts}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Avg Impressions</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{avgImpressions.toLocaleString()}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Avg Likes</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{avgLikes}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Engagement Rate</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{engagementRate}%</dd>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="mt-8">
        <AnalyticsCharts dailyMetrics={dailyMetrics} />
      </div>

      {/* Platform Breakdown */}
      <div className="mt-8">
        <PlatformBreakdown postsByPlatform={postsByPlatform} />
      </div>
    </div>
  )
}
