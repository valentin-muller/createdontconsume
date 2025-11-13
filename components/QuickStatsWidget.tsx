interface QuickStatsWidgetProps {
  thisWeek: {
    posts: number
    followers: number
  }
  lastWeek: {
    posts: number
    followers: number
  }
}

export default function QuickStatsWidget({ thisWeek, lastWeek }: QuickStatsWidgetProps) {
  const postsDelta = thisWeek.posts - lastWeek.posts
  const followersDelta = thisWeek.followers - lastWeek.followers

  const postsPercentChange = lastWeek.posts > 0
    ? ((postsDelta / lastWeek.posts) * 100).toFixed(1)
    : '0'

  const followersPercentChange = lastWeek.followers > 0
    ? ((followersDelta / lastWeek.followers) * 100).toFixed(1)
    : '0'

  return (
    <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-lg p-6 text-white">
      <h2 className="text-lg font-semibold mb-4">This Week's Performance</h2>

      <div className="grid grid-cols-2 gap-6">
        {/* Posts This Week */}
        <div>
          <div className="text-3xl font-bold">{thisWeek.posts}</div>
          <div className="text-sm opacity-90 mt-1">Posts Published</div>
          <div className="flex items-center mt-2">
            {postsDelta >= 0 ? (
              <>
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">
                  +{Math.abs(postsDelta)} ({postsPercentChange}%)
                </span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">
                  {postsDelta} ({postsPercentChange}%)
                </span>
              </>
            )}
            <span className="text-xs opacity-75 ml-2">vs last week</span>
          </div>
        </div>

        {/* Follower Growth */}
        <div>
          <div className="text-3xl font-bold">{followersDelta >= 0 ? '+' : ''}{followersDelta}</div>
          <div className="text-sm opacity-90 mt-1">New Followers</div>
          <div className="flex items-center mt-2">
            {followersDelta >= 0 ? (
              <>
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">
                  {followersPercentChange}% growth
                </span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">
                  {followersPercentChange}% decline
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick insight */}
      <div className="mt-4 pt-4 border-t border-white border-opacity-20">
        <p className="text-sm opacity-90">
          {thisWeek.posts > lastWeek.posts
            ? `🔥 Great job! You're posting ${postsPercentChange}% more than last week.`
            : thisWeek.posts === lastWeek.posts
            ? `📊 Consistent posting! Keep up the momentum.`
            : `💡 Try to post more this week to boost engagement.`
          }
        </p>
      </div>
    </div>
  )
}
