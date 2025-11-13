export interface CSVExportData {
  headers: string[]
  rows: (string | number)[][]
}

export function generateCSV(data: CSVExportData): string {
  const { headers, rows } = data

  // Escape CSV values
  const escapeCSVValue = (value: string | number): string => {
    const stringValue = String(value)
    // If value contains comma, newline, or quote, wrap in quotes and escape quotes
    if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
      return `"${stringValue.replace(/"/g, '""')}"`
    }
    return stringValue
  }

  // Generate CSV string
  const csvHeaders = headers.map(escapeCSVValue).join(',')
  const csvRows = rows.map((row) => row.map(escapeCSVValue).join(',')).join('\n')

  return `${csvHeaders}\n${csvRows}`
}

export function downloadCSV(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

export function exportAnalyticsToCSV(data: {
  posts: Array<{
    id: string
    platform: string
    type: string | null
    text: string
    publishedAt: Date | null
    impressions?: number
    likes?: number
    shares?: number
  }>
  dailyMetrics: Array<{
    date: Date
    platform: string
    followers: number
    impressions: number
    likes: number
  }>
}): void {
  // Export Posts
  const postsCSV = generateCSV({
    headers: ['ID', 'Platform', 'Type', 'Content', 'Published At', 'Impressions', 'Likes', 'Shares'],
    rows: data.posts.map((post) => [
      post.id,
      post.platform,
      post.type || 'N/A',
      post.text.substring(0, 100),
      post.publishedAt ? new Date(post.publishedAt).toISOString() : 'N/A',
      post.impressions || 0,
      post.likes || 0,
      post.shares || 0,
    ]),
  })

  const date = new Date().toISOString().split('T')[0]
  downloadCSV(`analytics-posts-${date}.csv`, postsCSV)

  // Also export daily metrics
  setTimeout(() => {
    const metricsCSV = generateCSV({
      headers: ['Date', 'Platform', 'Followers', 'Impressions', 'Likes'],
      rows: data.dailyMetrics.map((metric) => [
        new Date(metric.date).toISOString().split('T')[0],
        metric.platform,
        metric.followers,
        metric.impressions,
        metric.likes,
      ]),
    })

    downloadCSV(`analytics-daily-metrics-${date}.csv`, metricsCSV)
  }, 500)
}
