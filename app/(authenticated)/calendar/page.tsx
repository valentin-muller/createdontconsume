import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import ContentCalendar from '@/components/ContentCalendar'
import Link from 'next/link'

export default async function CalendarPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  // Fetch all posts with dates (published, scheduled, and drafts)
  const posts = await prisma.contentItem.findMany({
    where: {
      userId: session.userId,
      OR: [
        { status: 'published', publishedAt: { not: null } },
        { status: 'scheduled', scheduledAt: { not: null } },
        { status: 'draft', scheduledAt: { not: null } },
      ],
    },
    orderBy: [{ scheduledAt: 'desc' }, { publishedAt: 'desc' }],
    select: {
      id: true,
      platform: true,
      status: true,
      text: true,
      publishedAt: true,
      scheduledAt: true,
    },
  })

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Content Calendar</h1>
          <p className="mt-2 text-sm text-gray-700">
            Visual overview of your scheduled and published content across all platforms.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/create"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Create Post
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <ContentCalendar posts={posts} />
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          href="/drafts"
          className="block bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-medium text-gray-900">Drafts</h3>
          <p className="mt-2 text-sm text-gray-500">
            View and manage your draft content
          </p>
        </Link>
        <Link
          href="/create"
          className="block bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-medium text-gray-900">Schedule New Post</h3>
          <p className="mt-2 text-sm text-gray-500">
            Create and schedule content for upcoming days
          </p>
        </Link>
        <Link
          href="/analytics"
          className="block bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-medium text-gray-900">Analytics</h3>
          <p className="mt-2 text-sm text-gray-500">
            Review performance of published posts
          </p>
        </Link>
      </div>
    </div>
  )
}
