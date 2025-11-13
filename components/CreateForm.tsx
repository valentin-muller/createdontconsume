'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/contexts/ToastContext'
import { PLATFORM_LIMITS, getStrictestLimit, validateContent, type Platform } from '@/lib/platformLimits'
import TemplatesPicker from './TemplatesPicker'
import type { ContentTemplate } from '@/lib/contentTemplates'

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
  const { showToast } = useToast()
  const [text, setText] = useState(initialText)
  const [mediaUrl, setMediaUrl] = useState('')
  const [type, setType] = useState(initialType)
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')

  const handlePlatformToggle = (platform: Platform) => {
    setPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    )
  }

  const handleTemplateSelect = (template: ContentTemplate) => {
    setText(template.content)
    if (template.type) {
      setType(template.type)
    }
    if (template.platforms.length > 0) {
      setPlatforms(template.platforms as Platform[])
    }
    showToast('Template applied! Customize it to your needs.', 'success')
  }

  // Calculate character limit and validation
  const validation = useMemo(() => {
    return validateContent(text, platforms)
  }, [text, platforms])

  const strictestLimit = useMemo(() => {
    return platforms.length > 0 ? getStrictestLimit(platforms) : null
  }, [platforms])

  const characterColor = useMemo(() => {
    if (!strictestLimit) return 'text-gray-500'
    const percentage = (text.length / strictestLimit) * 100
    if (percentage >= 100) return 'text-red-600 font-bold'
    if (percentage >= 90) return 'text-orange-600 font-semibold'
    if (percentage >= 75) return 'text-yellow-600'
    return 'text-gray-500'
  }, [text.length, strictestLimit])

  const handleSaveDraft = async () => {
    if (!text.trim()) {
      showToast('Please enter some content', 'error')
      return
    }

    if (platforms.length === 0) {
      showToast('Please select at least one platform', 'error')
      return
    }

    setIsSubmitting(true)

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

      showToast('Draft saved successfully!', 'success')
      setText('')
      setMediaUrl('')
      setType('')
      setPlatforms([])

      setTimeout(() => {
        router.push('/drafts')
      }, 1000)
    } catch (error) {
      console.error('Error saving draft:', error)
      showToast('Failed to save draft', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePostNow = async () => {
    if (!text.trim()) {
      showToast('Please enter some content', 'error')
      return
    }

    if (platforms.length === 0) {
      showToast('Please select at least one platform', 'error')
      return
    }

    if (!validation.valid) {
      showToast(validation.errors[0], 'error')
      return
    }

    setIsSubmitting(true)

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

      showToast(`Successfully published to ${platforms.length} platform(s)!`, 'success')
      setText('')
      setMediaUrl('')
      setType('')
      setPlatforms([])
      setScheduleDate('')
      setScheduleTime('')

      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (error) {
      console.error('Error publishing:', error)
      showToast(error instanceof Error ? error.message : 'Failed to publish', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSchedulePost = async () => {
    if (!text.trim()) {
      showToast('Please enter some content', 'error')
      return
    }

    if (platforms.length === 0) {
      showToast('Please select at least one platform', 'error')
      return
    }

    if (!validation.valid) {
      showToast(validation.errors[0], 'error')
      return
    }

    if (!scheduleDate || !scheduleTime) {
      showToast('Please select a date and time to schedule', 'error')
      return
    }

    const scheduledAt = new Date(`${scheduleDate}T${scheduleTime}`)
    const now = new Date()

    if (scheduledAt <= now) {
      showToast('Scheduled time must be in the future', 'error')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/content/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          mediaUrl: mediaUrl || null,
          type: type || null,
          platforms,
          scheduledAt: scheduledAt.toISOString(),
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to schedule post')
      }

      showToast(`Post scheduled for ${scheduledAt.toLocaleString()}!`, 'success')
      setText('')
      setMediaUrl('')
      setType('')
      setPlatforms([])
      setScheduleDate('')
      setScheduleTime('')

      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (error) {
      console.error('Error scheduling post:', error)
      showToast('Failed to schedule post', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="space-y-6">
        {/* Templates */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Start with a template</h3>
            <p className="text-xs text-gray-500 mt-1">Choose from pre-made templates to save time</p>
          </div>
          <TemplatesPicker onSelect={handleTemplateSelect} />
        </div>

        {/* Platform Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Platforms
          </label>
          <div className="space-y-2">
            {(Object.keys(platformLabels) as Platform[]).map((platform) => (
              <label key={platform} className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={platforms.includes(platform)}
                    onChange={() => handlePlatformToggle(platform)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-900">
                    {platformLabels[platform]}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {PLATFORM_LIMITS[platform].characterLimit} char limit
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
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-primary-500 sm:text-sm border p-2 ${
              validation.errors.length > 0
                ? 'border-red-300 focus:border-red-500'
                : 'border-gray-300 focus:border-primary-500'
            }`}
            placeholder="What do you want to share?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="mt-1 flex items-center justify-between">
            <div>
              {validation.errors.length > 0 && (
                <p className="text-sm text-red-600">{validation.errors[0]}</p>
              )}
              {validation.errors.length === 0 && validation.warnings.length > 0 && (
                <p className="text-sm text-yellow-600">{validation.warnings[0]}</p>
              )}
            </div>
            <p className={`text-sm ${characterColor}`}>
              {text.length}
              {strictestLimit && ` / ${strictestLimit}`} characters
            </p>
          </div>
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

        {/* Schedule Options */}
        <div className="border-t pt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Schedule for Later (Optional)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="scheduleDate" className="block text-xs text-gray-600 mb-1">
                Date
              </label>
              <input
                type="date"
                id="scheduleDate"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-2"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label htmlFor="scheduleTime" className="block text-xs text-gray-600 mb-1">
                Time
              </label>
              <input
                type="time"
                id="scheduleTime"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-2"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={handleSchedulePost}
            disabled={isSubmitting || !validation.valid || !scheduleDate || !scheduleTime}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Scheduling...' : 'Schedule'}
          </button>
          <button
            onClick={handlePostNow}
            disabled={isSubmitting || !validation.valid}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Publishing...' : 'Post Now'}
          </button>
        </div>
      </div>
    </div>
  )
}
