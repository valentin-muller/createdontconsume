interface MetricsCardsProps {
  followerCounts: {
    x: number
    instagram: number
    youtube: number
  }
  followerDeltas: Record<string, number>
}

const platformNames: Record<string, string> = {
  x: 'X (Twitter)',
  instagram: 'Instagram',
  youtube: 'YouTube',
}

export default function MetricsCards({ followerCounts, followerDeltas }: MetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {Object.entries(followerCounts).map(([platform, count]) => {
        const delta = followerDeltas[platform] || 0
        const deltaPositive = delta >= 0

        return (
          <div key={platform} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="rounded-md bg-primary-500 p-3">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {platformNames[platform]}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {count.toLocaleString()}
                      </div>
                      <div
                        className={`ml-2 flex items-baseline text-sm font-semibold ${
                          deltaPositive ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {deltaPositive ? '+' : ''}
                        {delta.toLocaleString()}
                        <span className="ml-1 text-gray-500 font-normal">7d</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
