'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CalendarPost {
  id: string
  platform: string
  status: string
  text: string
  publishedAt?: Date | null
  scheduledAt?: Date | null
}

interface ContentCalendarProps {
  posts: CalendarPost[]
}

const platformColors: Record<string, string> = {
  x: 'bg-blue-100 text-blue-800 border-blue-300',
  instagram: 'bg-pink-100 text-pink-800 border-pink-300',
  youtube: 'bg-red-100 text-red-800 border-red-300',
}

const platformNames: Record<string, string> = {
  x: 'X',
  instagram: 'IG',
  youtube: 'YT',
}

export default function ContentCalendar({ posts }: ContentCalendarProps) {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())

  // Get first day of month and total days
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  // Navigate months
  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Group posts by date
  const postsByDate: Record<string, CalendarPost[]> = {}
  posts.forEach((post) => {
    const date = post.scheduledAt || post.publishedAt
    if (date) {
      const dateObj = new Date(date)
      if (dateObj.getMonth() === month && dateObj.getFullYear() === year) {
        const dateKey = dateObj.getDate().toString()
        if (!postsByDate[dateKey]) {
          postsByDate[dateKey] = []
        }
        postsByDate[dateKey].push(post)
      }
    }
  })

  // Build calendar grid
  const calendarDays = []
  const totalSlots = Math.ceil((daysInMonth + startingDayOfWeek) / 7) * 7

  for (let i = 0; i < totalSlots; i++) {
    const dayNumber = i - startingDayOfWeek + 1
    const isCurrentMonth = dayNumber >= 1 && dayNumber <= daysInMonth
    const date = isCurrentMonth ? new Date(year, month, dayNumber) : null
    const isToday =
      date &&
      date.getDate() === new Date().getDate() &&
      date.getMonth() === new Date().getMonth() &&
      date.getFullYear() === new Date().getFullYear()

    const dayPosts = isCurrentMonth ? postsByDate[dayNumber.toString()] || [] : []

    calendarDays.push({
      dayNumber: isCurrentMonth ? dayNumber : null,
      isToday,
      posts: dayPosts,
    })
  }

  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(
    currentDate
  )

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Calendar Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">{monthName}</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={goToToday}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Today
          </button>
          <button
            onClick={previousMonth}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            onClick={nextMonth}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="px-2 py-3 text-xs font-semibold text-center text-gray-700 uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`min-h-[120px] border-r border-b border-gray-200 p-2 ${
              day.dayNumber ? 'bg-white' : 'bg-gray-50'
            } ${day.isToday ? 'bg-blue-50' : ''}`}
          >
            {day.dayNumber && (
              <>
                <div
                  className={`text-sm font-semibold mb-1 ${
                    day.isToday
                      ? 'inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-600 text-white'
                      : 'text-gray-900'
                  }`}
                >
                  {day.dayNumber}
                </div>

                {/* Posts for this day */}
                <div className="space-y-1">
                  {day.posts.slice(0, 3).map((post) => (
                    <div
                      key={post.id}
                      onClick={() => {
                        if (post.status === 'draft' || post.status === 'scheduled') {
                          router.push(`/drafts`)
                        }
                      }}
                      className={`text-xs p-1.5 rounded border cursor-pointer hover:shadow-sm transition-shadow ${
                        platformColors[post.platform] || 'bg-gray-100 text-gray-800 border-gray-300'
                      }`}
                    >
                      <div className="font-medium">
                        {platformNames[post.platform] || post.platform}
                        {post.status === 'scheduled' && (
                          <span className="ml-1 text-[10px] opacity-75">⏰</span>
                        )}
                        {post.status === 'published' && (
                          <span className="ml-1 text-[10px] opacity-75">✓</span>
                        )}
                      </div>
                      <div className="truncate opacity-75 mt-0.5">
                        {post.text.substring(0, 30)}...
                      </div>
                    </div>
                  ))}

                  {day.posts.length > 3 && (
                    <div className="text-xs text-gray-500 pl-1.5 pt-0.5">
                      +{day.posts.length - 3} more
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <span className="inline-block w-3 h-3 mr-1.5 rounded bg-blue-100 border border-blue-300"></span>
              X (Twitter)
            </span>
            <span className="flex items-center">
              <span className="inline-block w-3 h-3 mr-1.5 rounded bg-pink-100 border border-pink-300"></span>
              Instagram
            </span>
            <span className="flex items-center">
              <span className="inline-block w-3 h-3 mr-1.5 rounded bg-red-100 border border-red-300"></span>
              YouTube
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span>⏰ Scheduled</span>
            <span>✓ Published</span>
          </div>
        </div>
      </div>
    </div>
  )
}
