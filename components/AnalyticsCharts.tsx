'use client'

import { useMemo } from 'react'

interface DailyMetric {
  platform: string
  date: Date
  followers: number
  impressions: number
  likes: number
  comments: number
  shares: number
}

export default function AnalyticsCharts({ dailyMetrics }: { dailyMetrics: DailyMetric[] }) {
  // Aggregate metrics by date across all platforms
  const aggregatedData = useMemo(() => {
    const dataByDate = new Map<string, {
      followers: number
      impressions: number
      likes: number
      date: string
    }>()

    dailyMetrics.forEach((metric) => {
      const dateStr = new Date(metric.date).toISOString().split('T')[0]
      const existing = dataByDate.get(dateStr) || {
        followers: 0,
        impressions: 0,
        likes: 0,
        date: dateStr,
      }

      dataByDate.set(dateStr, {
        followers: existing.followers + metric.followers,
        impressions: existing.impressions + metric.impressions,
        likes: existing.likes + metric.likes,
        date: dateStr,
      })
    })

    return Array.from(dataByDate.values()).sort((a, b) => a.date.localeCompare(b.date))
  }, [dailyMetrics])

  if (aggregatedData.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Growth Over Time</h2>
        <p className="text-sm text-gray-500 text-center py-8">
          No data yet. Start posting to see your analytics!
        </p>
      </div>
    )
  }

  const maxFollowers = Math.max(...aggregatedData.map(d => d.followers))
  const maxImpressions = Math.max(...aggregatedData.map(d => d.impressions))
  const maxLikes = Math.max(...aggregatedData.map(d => d.likes))

  return (
    <div className="space-y-8">
      {/* Followers Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Total Followers</h2>
        <div className="space-y-2">
          {aggregatedData.slice(-14).map((data, index) => {
            const heightPercent = maxFollowers > 0 ? (data.followers / maxFollowers) * 100 : 0
            return (
              <div key={index} className="flex items-center space-x-3">
                <div className="text-xs text-gray-500 w-20">
                  {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                  <div
                    className="bg-primary-600 h-6 rounded-full transition-all duration-300"
                    style={{ width: `${heightPercent}%` }}
                  />
                  <span className="absolute right-2 top-0 text-xs font-medium text-gray-700 leading-6">
                    {data.followers.toLocaleString()}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Impressions Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Daily Impressions</h2>
        <div className="space-y-2">
          {aggregatedData.slice(-14).map((data, index) => {
            const heightPercent = maxImpressions > 0 ? (data.impressions / maxImpressions) * 100 : 0
            return (
              <div key={index} className="flex items-center space-x-3">
                <div className="text-xs text-gray-500 w-20">
                  {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                  <div
                    className="bg-green-600 h-6 rounded-full transition-all duration-300"
                    style={{ width: `${heightPercent}%` }}
                  />
                  <span className="absolute right-2 top-0 text-xs font-medium text-gray-700 leading-6">
                    {data.impressions.toLocaleString()}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Engagement Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Daily Likes</h2>
        <div className="space-y-2">
          {aggregatedData.slice(-14).map((data, index) => {
            const heightPercent = maxLikes > 0 ? (data.likes / maxLikes) * 100 : 0
            return (
              <div key={index} className="flex items-center space-x-3">
                <div className="text-xs text-gray-500 w-20">
                  {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                  <div
                    className="bg-pink-600 h-6 rounded-full transition-all duration-300"
                    style={{ width: `${heightPercent}%` }}
                  />
                  <span className="absolute right-2 top-0 text-xs font-medium text-gray-700 leading-6">
                    {data.likes.toLocaleString()}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
