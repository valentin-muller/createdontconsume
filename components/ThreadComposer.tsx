'use client'

import { useState } from 'react'
import { useToast } from '@/contexts/ToastContext'
import { useRouter } from 'next/navigation'
import { getPlatformLimit, getCharacterCountColor } from '@/lib/platformLimits'

interface ThreadPost {
  id: string
  text: string
}

interface ThreadComposerProps {
  platform: 'x' | 'instagram' | 'youtube'
  initialThread?: ThreadPost[]
}

export default function ThreadComposer({ platform, initialThread }: ThreadComposerProps) {
  const { showToast } = useToast()
  const router = useRouter()
  const [threadPosts, setThreadPosts] = useState<ThreadPost[]>(
    initialThread || [{ id: crypto.randomUUID(), text: '' }]
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const characterLimit = getPlatformLimit(platform)
  const platformName = platform === 'x' ? 'X' : platform === 'instagram' ? 'Instagram' : 'YouTube'

  const addPost = () => {
    setThreadPosts([...threadPosts, { id: crypto.randomUUID(), text: '' }])
  }

  const removePost = (id: string) => {
    if (threadPosts.length === 1) {
      showToast('Thread must have at least one post', 'warning')
      return
    }
    setThreadPosts(threadPosts.filter((post) => post.id !== id))
  }

  const updatePost = (id: string, text: string) => {
    setThreadPosts(threadPosts.map((post) => (post.id === id ? { ...post, text } : post)))
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const newPosts = [...threadPosts]
    ;[newPosts[index - 1], newPosts[index]] = [newPosts[index], newPosts[index - 1]]
    setThreadPosts(newPosts)
  }

  const moveDown = (index: number) => {
    if (index === threadPosts.length - 1) return
    const newPosts = [...threadPosts]
    ;[newPosts[index], newPosts[index + 1]] = [newPosts[index + 1], newPosts[index]]
    setThreadPosts(newPosts)
  }

  const validateThread = (): { valid: boolean; errors: string[] } => {
    const errors: string[] = []

    // Check if any post is empty
    const emptyPosts = threadPosts.filter((post) => !post.text.trim())
    if (emptyPosts.length > 0) {
      errors.push('All posts in the thread must have content')
    }

    // Check character limits
    const overLimitPosts = threadPosts.filter((post) => post.text.length > characterLimit)
    if (overLimitPosts.length > 0) {
      errors.push(`${overLimitPosts.length} post(s) exceed the ${characterLimit} character limit for ${platformName}`)
    }

    return { valid: errors.length === 0, errors }
  }

  const handleSaveAsDraft = async () => {
    const validation = validateThread()
    if (!validation.valid) {
      validation.errors.forEach((error) => showToast(error, 'error'))
      return
    }

    setIsSubmitting(true)

    try {
      // Save each post in thread as a separate draft with thread metadata
      const threadId = crypto.randomUUID()

      const promises = threadPosts.map(async (post, index) => {
        const res = await fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: post.text,
            platform,
            type: 'thread',
            status: 'draft',
            metadata: JSON.stringify({
              threadId,
              threadPosition: index + 1,
              threadTotal: threadPosts.length,
            }),
          }),
        })

        if (!res.ok) throw new Error('Failed to save thread post')
        return res.json()
      })

      await Promise.all(promises)

      showToast(`Thread saved as draft (${threadPosts.length} posts)`, 'success')
      router.push('/drafts')
    } catch (error) {
      console.error('Error saving thread:', error)
      showToast('Failed to save thread', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePublishThread = async () => {
    const validation = validateThread()
    if (!validation.valid) {
      validation.errors.forEach((error) => showToast(error, 'error'))
      return
    }

    if (!confirm(`Publish thread with ${threadPosts.length} posts to ${platformName}?`)) {
      return
    }

    setIsSubmitting(true)

    try {
      const threadId = crypto.randomUUID()

      const promises = threadPosts.map(async (post, index) => {
        const res = await fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: post.text,
            platform,
            type: 'thread',
            status: 'published',
            metadata: JSON.stringify({
              threadId,
              threadPosition: index + 1,
              threadTotal: threadPosts.length,
            }),
          }),
        })

        if (!res.ok) throw new Error('Failed to publish thread post')
        return res.json()
      })

      await Promise.all(promises)

      showToast(`Thread published successfully (${threadPosts.length} posts)`, 'success')
      router.push('/dashboard')
    } catch (error) {
      console.error('Error publishing thread:', error)
      showToast('Failed to publish thread', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Thread Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-4 text-white">
        <h3 className="text-lg font-semibold flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
          </svg>
          Thread Composer - {platformName}
        </h3>
        <p className="text-sm opacity-90 mt-1">
          Create a multi-post thread. {threadPosts.length} post{threadPosts.length !== 1 ? 's' : ''} in thread.
        </p>
      </div>

      {/* Thread Posts */}
      <div className="space-y-3">
        {threadPosts.map((post, index) => {
          const charCount = post.text.length
          const colorClass = getCharacterCountColor(charCount, characterLimit)
          const isOverLimit = charCount > characterLimit

          return (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow border-2 border-gray-200 hover:border-purple-300 transition-colors"
            >
              <div className="p-4">
                {/* Post Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {index + 1}/{threadPosts.length}
                    </span>
                    <span className={`text-sm font-medium ${colorClass}`}>
                      {charCount}/{characterLimit}
                    </span>
                  </div>

                  {/* Move and Delete Controls */}
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDown(index)}
                      disabled={index === threadPosts.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => removePost(post.id)}
                      disabled={threadPosts.length === 1}
                      className="p-1 text-red-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Delete post"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Text Area */}
                <textarea
                  value={post.text}
                  onChange={(e) => updatePost(post.id, e.target.value)}
                  rows={3}
                  className={`block w-full rounded-md shadow-sm sm:text-sm ${
                    isOverLimit
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                  }`}
                  placeholder={`Post ${index + 1} content...`}
                />

                {isOverLimit && (
                  <p className="mt-1 text-sm text-red-600">
                    Exceeds character limit by {charCount - characterLimit} characters
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Post Button */}
      <button
        type="button"
        onClick={addPost}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-400 hover:text-purple-600 transition-colors flex items-center justify-center"
      >
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        Add Another Post
      </button>

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={handleSaveAsDraft}
          disabled={isSubmitting}
          className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          Save as Draft
        </button>
        <button
          type="button"
          onClick={handlePublishThread}
          disabled={isSubmitting}
          className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
        >
          Publish Thread
        </button>
      </div>
    </div>
  )
}
