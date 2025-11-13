import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import IdeaForm from '@/components/IdeaForm'
import IdeaList from '@/components/IdeaList'

export default async function IdeasPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const ideas = await prisma.idea.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Idea Inbox</h1>
          <p className="mt-2 text-sm text-gray-700">
            Capture your content ideas here. You can promote them to drafts when ready.
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <IdeaForm />
      </div>

      <div className="mt-8">
        <IdeaList ideas={ideas} />
      </div>
    </div>
  )
}
