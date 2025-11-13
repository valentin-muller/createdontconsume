'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Platform = 'x' | 'instagram' | 'youtube'

const platformLabels: Record<Platform, string> = {
  x: 'X (Twitter)',
  instagram: 'Instagram',
  youtube: 'YouTube',
}

interface CreateFormProps {
  initialText?: string
  initialType?: string
}

export default function CreateForm({ initialText = '', initialType = '' }: CreateFormProps) {
  const router = useRouter()
  const [text, setText] = useState(initialText)
  const [mediaUrl, setMediaUrl] = useState('')
  const [type, setType] = useState(initialType)
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handlePlatformToggle = (platform: Platform) => {
    setPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    )
  }

  const handleSaveDraft = async () => {
    if (!text.trim()) {
      setMessage({ type: 'error', text: 'Please enter some content' })
      return
    }

    if (platforms.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one platform' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const res = await fetch('/api/content/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          mediaUrl: mediaUrl || null,
          type: type || null,
          platforms,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to save draft')
      }

      setMessage({ type: 'success', text: 'Draft saved successfully!' })
      setText('')
      setMediaUrl('')
      setType('')
      setPlatforms([])

      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } catch (error) {
      console.error('Error saving draft:', error)
      setMessage({ type: 'error', text: 'Failed to save draft' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePostNow = async () => {
    if (!text.trim()) {
      setMessage({ type: 'error', text: 'Please enter some content' })
      return
    }

    if (platforms.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one platform' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const res = await fetch('/api/content/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          mediaUrl: mediaUrl || null,
          type: type || null,
          platforms,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to publish')
      }

      setMessage({
        type: 'success',
        text: `Successfully published to ${platforms.length} platform(s)!`
      })
      setText('')
      setMediaUrl('')
      setType('')
      setPlatforms([])

      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (error) {
      console.error('Error publishing:', error)
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to publish'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      {message && (
        <div
          className={`mb-4 p-4 rounded-md ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Platform Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Platforms
          </label>
          <div className="space-y-2">
            {(Object.keys(platformLabels) as Platform[]).map((platform) => (
              <label key={platform} className="flex items-center">
                <input
                  type="checkbox"
                  checked={platforms.includes(platform)}
                  onChange={() => handlePlatformToggle(platform)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-900">
                  {platformLabels[platform]}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Content Text */}
        <div>
          <label htmlFor="text" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            id="text"
            rows={6}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-2"
            placeholder="What do you want to share?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <p className="mt-1 text-sm text-gray-500">{text.length} characters</p>
        </div>

        {/* Media URL */}
        <div>
          <label htmlFor="mediaUrl" className="block text-sm font-medium text-gray-700">
            Media URL (optional)
          </label>
          <input
            type="url"
            id="mediaUrl"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-2"
            placeholder="https://example.com/image.jpg"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
          />
        </div>

        {/* Post Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Post Type
          </label>
          <select
            id="type"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-2"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Select type...</option>
            <option value="short">Short Post</option>
            <option value="reel">Reel</option>
            <option value="short_video">Short Video</option>
            <option value="long_video">Long Video</option>
            <option value="generic">Generic</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="flex-1 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            onClick={handlePostNow}
            disabled={isSubmitting}
            className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Publishing...' : 'Post Now'}
          </button>
        </div>
      </div>
    </div>
  )
}
