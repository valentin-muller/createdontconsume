import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import DraftsList from '@/components/DraftsList'

export default async function DraftsPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const drafts = await prisma.contentItem.findMany({
    where: {
      userId: session.userId,
      status: 'draft',
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Drafts</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your saved drafts. Edit, publish, or delete them.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <DraftsList drafts={drafts} />
      </div>
    </div>
  )
}
