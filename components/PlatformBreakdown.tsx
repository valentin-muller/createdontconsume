interface PlatformData {
  platform: string
  status: string
  _count: {
    id: number
  }
}

const platformNames: Record<string, string> = {
  x: 'X (Twitter)',
  instagram: 'Instagram',
  youtube: 'YouTube',
}

const platformColors: Record<string, string> = {
  x: 'bg-blue-500',
  instagram: 'bg-pink-500',
  youtube: 'bg-red-500',
}

export default function PlatformBreakdown({ postsByPlatform }: { postsByPlatform: PlatformData[] }) {
  // Aggregate by platform
  const platformTotals = postsByPlatform.reduce((acc, item) => {
    const platform = item.platform
    if (!acc[platform]) {
      acc[platform] = { published: 0, draft: 0, total: 0 }
    }
    if (item.status === 'published') {
      acc[platform].published += item._count.id
    } else if (item.status === 'draft') {
      acc[platform].draft += item._count.id
    }
    acc[platform].total += item._count.id
    return acc
  }, {} as Record<string, { published: number; draft: number; total: number }>)

  const grandTotal = Object.values(platformTotals).reduce((sum, p) => sum + p.total, 0)

  if (grandTotal === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Platform Breakdown</h2>
        <p className="text-sm text-gray-500 text-center py-8">
          No posts yet. Create content to see platform distribution.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Platform Breakdown</h2>

      {/* Platform distribution bars */}
      <div className="space-y-6 mb-8">
        {Object.entries(platformTotals).map(([platform, data]) => {
          const percentage = ((data.total / grandTotal) * 100).toFixed(1)
          return (
            <div key={platform}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{platformNames[platform] || platform}</span>
                <span className="text-gray-500">{data.total} posts ({percentage}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`${platformColors[platform] || 'bg-gray-500'} h-4 rounded-full transition-all duration-300`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{data.published} published</span>
                <span>{data.draft} drafts</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary table */}
      <div className="border-t pt-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Platform</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Published</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Drafts</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Object.entries(platformTotals).map(([platform, data]) => (
              <tr key={platform}>
                <td className="px-3 py-2 text-sm text-gray-900">{platformNames[platform] || platform}</td>
                <td className="px-3 py-2 text-sm text-gray-900 text-right">{data.published}</td>
                <td className="px-3 py-2 text-sm text-gray-500 text-right">{data.draft}</td>
                <td className="px-3 py-2 text-sm font-medium text-gray-900 text-right">{data.total}</td>
              </tr>
            ))}
            <tr className="bg-gray-50 font-medium">
              <td className="px-3 py-2 text-sm text-gray-900">Total</td>
              <td className="px-3 py-2 text-sm text-gray-900 text-right">
                {Object.values(platformTotals).reduce((sum, p) => sum + p.published, 0)}
              </td>
              <td className="px-3 py-2 text-sm text-gray-500 text-right">
                {Object.values(platformTotals).reduce((sum, p) => sum + p.draft, 0)}
              </td>
              <td className="px-3 py-2 text-sm text-gray-900 text-right">{grandTotal}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
