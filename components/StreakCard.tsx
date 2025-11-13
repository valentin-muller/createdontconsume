interface StreakCardProps {
  currentStreakDays: number
  longestStreakDays: number
  postedToday: boolean
}

export default function StreakCard({
  currentStreakDays,
  longestStreakDays,
  postedToday,
}: StreakCardProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Posting Streak</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Posted Today */}
        <div className="text-center">
          <div className="text-4xl mb-2">
            {postedToday ? '✅' : '⏳'}
          </div>
          <div className="text-sm font-medium text-gray-900">
            {postedToday ? 'Posted Today' : 'Not Posted Yet'}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Current Streak */}
        <div className="text-center border-l border-r border-gray-200">
          <div className="text-4xl font-bold text-primary-600 mb-2">
            {currentStreakDays}
          </div>
          <div className="text-sm font-medium text-gray-900">
            Current Streak
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {currentStreakDays === 1 ? 'day' : 'days'}
          </div>
        </div>

        {/* Longest Streak */}
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {longestStreakDays}
          </div>
          <div className="text-sm font-medium text-gray-900">
            Longest Streak
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {longestStreakDays === 1 ? 'day' : 'days'}
          </div>
        </div>
      </div>

      {!postedToday && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-sm text-yellow-800">
            Keep your streak alive by posting today!
          </p>
        </div>
      )}
    </div>
  )
}
