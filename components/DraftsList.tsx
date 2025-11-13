'use client'

import { useRouter } from 'next/navigation'
import { useToast } from '@/contexts/ToastContext'
import { useState } from 'react'

interface Draft {
  id: string
  platform: string
  type: string | null
  text: string
  mediaUrl: string | null
  createdAt: Date
}

const platformNames: Record<string, string> = {
  x: 'X',
  instagram: 'Instagram',
  youtube: 'YouTube',
}

export default function DraftsList({ drafts }: { drafts: Draft[] }) {
  const router = useRouter()
  const { showToast } = useToast()
  const [selectedDrafts, setSelectedDrafts] = useState<Set<string>>(new Set())
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = (draft: Draft) => {
    const params = new URLSearchParams({
      text: draft.text,
      type: draft.type || '',
      mediaUrl: draft.mediaUrl || '',
      platform: draft.platform,
      draftId: draft.id,
    })
    router.push(`/create?${params.toString()}`)
  }

  const handlePublish = async (draftId: string) => {
    try {
      const res = await fetch(`/api/content/drafts/${draftId}/publish`, {
        method: 'POST',
      })

      if (!res.ok) {
        throw new Error('Failed to publish draft')
      }

      showToast('Draft published successfully!', 'success')
      router.refresh()
    } catch (error) {
      console.error('Error publishing draft:', error)
      showToast('Failed to publish draft', 'error')
    }
  }

  const handleDelete = async (draftId: string) => {
    if (!confirm('Delete this draft?')) return

    try {
      const res = await fetch(`/api/content/drafts/${draftId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to delete draft')
      }

      showToast('Draft deleted', 'success')
      router.refresh()
    } catch (error) {
      console.error('Error deleting draft:', error)
      showToast('Failed to delete draft', 'error')
    }
  }

  const handleBatchDelete = async () => {
    if (selectedDrafts.size === 0) return
    if (!confirm(`Delete ${selectedDrafts.size} draft(s)?`)) return

    setIsDeleting(true)

    try {
      const res = await fetch('/api/content/drafts/batch-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draftIds: Array.from(selectedDrafts) }),
      })

      if (!res.ok) {
        throw new Error('Failed to delete drafts')
      }

      showToast(`${selectedDrafts.size} draft(s) deleted`, 'success')
      setSelectedDrafts(new Set())
      router.refresh()
    } catch (error) {
      console.error('Error deleting drafts:', error)
      showToast('Failed to delete drafts', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  const toggleSelect = (draftId: string) => {
    const newSelected = new Set(selectedDrafts)
    if (newSelected.has(draftId)) {
      newSelected.delete(draftId)
    } else {
      newSelected.add(draftId)
    }
    setSelectedDrafts(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedDrafts.size === drafts.length) {
      setSelectedDrafts(new Set())
    } else {
      setSelectedDrafts(new Set(drafts.map(d => d.id)))
    }
  }

  if (drafts.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="mt-2 text-sm text-gray-500">No drafts yet. Save content as drafts from the create page.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {selectedDrafts.size > 0 && (
        <div className="bg-white shadow rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm text-gray-700">
            {selectedDrafts.size} draft(s) selected
          </span>
          <button
            onClick={handleBatchDelete}
            disabled={isDeleting}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none disabled:opacity-50"
          >
            Delete Selected
          </button>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedDrafts.size === drafts.length && drafts.length > 0}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Platform
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Content
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {drafts.map((draft) => (
              <tr key={draft.id} className={selectedDrafts.has(draft.id) ? 'bg-primary-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedDrafts.has(draft.id)}
                    onChange={() => toggleSelect(draft.id)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(draft.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {platformNames[draft.platform] || draft.platform}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {draft.type || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">
                  {draft.text.substring(0, 80)}
                  {draft.text.length > 80 ? '...' : ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(draft)}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handlePublish(draft.id)}
                    className="text-green-600 hover:text-green-900"
                  >
                    Publish
                  </button>
                  <button
                    onClick={() => handleDelete(draft.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
