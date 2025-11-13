'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function IdeaForm() {
  const router = useRouter()
  const [text, setText] = useState('')
  const [type, setType] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, type: type || null }),
      })

      if (!res.ok) {
        throw new Error('Failed to create idea')
      }

      setText('')
      setType('')
      router.refresh()
    } catch (error) {
      console.error('Error creating idea:', error)
      alert('Failed to create idea')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="text" className="block text-sm font-medium text-gray-700">
          Idea
        </label>
        <textarea
          id="text"
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-2"
          placeholder="What's your idea?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Type (optional)
        </label>
        <select
          id="type"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-2"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">Select type...</option>
          <option value="tweet">Tweet</option>
          <option value="short">Short</option>
          <option value="reel">Reel</option>
          <option value="long">Long Video</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : 'Save Idea'}
      </button>
    </form>
  )
}
