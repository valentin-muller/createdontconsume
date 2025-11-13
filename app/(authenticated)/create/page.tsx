import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import CreateWrapper from '@/components/CreateWrapper'

export default async function CreatePage({
  searchParams,
}: {
  searchParams: { text?: string; type?: string }
}) {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Create Content</h1>
          <p className="mt-2 text-sm text-gray-700">
            Compose single posts or multi-post threads for any platform.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <CreateWrapper initialText={searchParams.text} initialType={searchParams.type} />
      </div>
    </div>
  )
}
