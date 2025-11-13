export function DashboardSkeleton() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 animate-pulse">
      {/* Header */}
      <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-64 mb-8"></div>

      {/* Quick Stats Widget Skeleton */}
      <div className="bg-gray-200 rounded-lg h-48 mb-8"></div>

      {/* Metrics Cards Skeleton */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        <div className="bg-gray-200 rounded-lg h-32"></div>
        <div className="bg-gray-200 rounded-lg h-32"></div>
        <div className="bg-gray-200 rounded-lg h-32"></div>
      </div>

      {/* Streak Card Skeleton */}
      <div className="bg-gray-200 rounded-lg h-48 mb-8"></div>

      {/* Recent Posts Skeleton */}
      <div className="bg-gray-200 rounded-lg h-96"></div>
    </div>
  )
}

export function AnalyticsSkeleton() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 animate-pulse">
      {/* Header */}
      <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-64 mb-8"></div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-8">
        <div className="bg-gray-200 rounded-lg h-24"></div>
        <div className="bg-gray-200 rounded-lg h-24"></div>
        <div className="bg-gray-200 rounded-lg h-24"></div>
        <div className="bg-gray-200 rounded-lg h-24"></div>
      </div>

      {/* Charts */}
      <div className="space-y-8">
        <div className="bg-gray-200 rounded-lg h-96"></div>
        <div className="bg-gray-200 rounded-lg h-96"></div>
      </div>
    </div>
  )
}

export function DraftsListSkeleton() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 animate-pulse">
      {/* Header */}
      <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-64 mb-8"></div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="h-12 bg-gray-100 border-b"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 border-b border-gray-200 px-6 py-4 flex items-center space-x-4">
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="flex-1 h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white shadow rounded-lg p-6 animate-pulse">
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="flex space-x-2">
          <div className="h-10 bg-gray-200 rounded flex-1"></div>
          <div className="h-10 bg-gray-200 rounded flex-1"></div>
        </div>
      </div>
    </div>
  )
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="animate-pulse">
      {[...Array(columns)].map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-gray-200 rounded"></div>
        </td>
      ))}
    </tr>
  )
}
