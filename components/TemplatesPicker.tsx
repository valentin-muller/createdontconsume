'use client'

import { useState } from 'react'
import { CONTENT_TEMPLATES, type ContentTemplate } from '@/lib/contentTemplates'

interface TemplatesPickerProps {
  onSelect: (template: ContentTemplate) => void
}

const categoryNames: Record<ContentTemplate['category'], string> = {
  engagement: 'Engagement',
  educational: 'Educational',
  promotional: 'Promotional',
  personal: 'Personal',
  thread: 'Thread',
}

const categoryColors: Record<ContentTemplate['category'], string> = {
  engagement: 'bg-blue-100 text-blue-800',
  educational: 'bg-green-100 text-green-800',
  promotional: 'bg-purple-100 text-purple-800',
  personal: 'bg-pink-100 text-pink-800',
  thread: 'bg-yellow-100 text-yellow-800',
}

export default function TemplatesPicker({ onSelect }: TemplatesPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<ContentTemplate['category'] | 'all'>('all')

  const filteredTemplates =
    selectedCategory === 'all'
      ? CONTENT_TEMPLATES
      : CONTENT_TEMPLATES.filter(t => t.category === selectedCategory)

  const handleSelect = (template: ContentTemplate) => {
    onSelect(template)
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
          />
        </svg>
        Use Template
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={() => setIsOpen(false)}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Content Templates
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Category filter */}
            <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {Object.entries(categoryNames).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key as ContentTemplate['category'])}
                  className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                    selectedCategory === key
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Templates grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleSelect(template)}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{template.name}</h4>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${categoryColors[template.category]}`}>
                      {categoryNames[template.category]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{template.description}</p>
                  <div className="text-xs text-gray-700 bg-gray-50 rounded p-2 font-mono whitespace-pre-wrap line-clamp-3">
                    {template.content}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex space-x-1">
                      {template.platforms.map((p) => (
                        <span key={p} className="text-xs text-gray-500 capitalize">
                          {p === 'x' ? 'X' : p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
