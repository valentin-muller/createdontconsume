'use client'

import { useRouter } from 'next/navigation'

interface Idea {
  id: string
  text: string
  type: string | null
  createdAt: Date
}

export default function IdeaList({ ideas }: { ideas: Idea[] }) {
  const router = useRouter()

  const handleUseAsDraft = (idea: Idea) => {
    const params = new URLSearchParams({
      text: idea.text,
      type: idea.type || '',
    })
    router.push(`/create?${params.toString()}`)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this idea?')) return

    try {
      const res = await fetch(`/api/ideas/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to delete idea')
      }

      router.refresh()
    } catch (error) {
      console.error('Error deleting idea:', error)
      alert('Failed to delete idea')
    }
  }

  if (ideas.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500">No ideas yet. Start by adding one above.</p>
      </div>
    )
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {ideas.map((idea) => (
          <li key={idea.id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {idea.text}
                  </p>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    {idea.type && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mr-2">
                        {idea.type}
                      </span>
                    )}
                    <span>
                      {new Date(idea.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0 flex space-x-2">
                  <button
                    onClick={() => handleUseAsDraft(idea)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
                  >
                    Use as Draft
                  </button>
                  <button
                    onClick={() => handleDelete(idea.id)}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
