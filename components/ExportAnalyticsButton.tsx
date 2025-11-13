'use client'

import { exportAnalyticsToCSV } from '@/lib/csvExport'
import { useToast } from '@/contexts/ToastContext'

interface ExportAnalyticsButtonProps {
  data: {
    posts: Array<{
      id: string
      platform: string
      type: string | null
      text: string
      publishedAt: Date | null
      metrics?: {
        impressions: number
        likes: number
        shares: number
      }
    }>
    dailyMetrics: Array<{
      date: Date
      platform: string
      followers: number
      impressions: number
      likes: number
    }>
  }
}

export default function ExportAnalyticsButton({ data }: ExportAnalyticsButtonProps) {
  const { showToast } = useToast()

  const handleExport = () => {
    try {
      // Transform data for export
      const postsWithMetrics = data.posts.map((post) => ({
        id: post.id,
        platform: post.platform,
        type: post.type,
        text: post.text,
        publishedAt: post.publishedAt,
        impressions: post.metrics?.impressions || 0,
        likes: post.metrics?.likes || 0,
        shares: post.metrics?.shares || 0,
      }))

      exportAnalyticsToCSV({
        posts: postsWithMetrics,
        dailyMetrics: data.dailyMetrics,
      })

      showToast('Analytics exported to CSV files', 'success')
    } catch (error) {
      console.error('Export error:', error)
      showToast('Failed to export analytics', 'error')
    }
  }

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
    >
      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
      Export to CSV
    </button>
  )
}
