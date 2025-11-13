'use client'

import { useState } from 'react'
import CreateForm from './CreateForm'
import ThreadComposer from './ThreadComposer'
import type { Platform } from '@/lib/platformLimits'

interface CreateWrapperProps {
  initialText?: string
  initialType?: string
}

export default function CreateWrapper({ initialText, initialType }: CreateWrapperProps) {
  const [mode, setMode] = useState<'single' | 'thread'>('single')
  const [threadPlatform, setThreadPlatform] = useState<Platform>('x')

  return (
    <div>
      {/* Mode Selector */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setMode('single')}
            className={`${
              mode === 'single'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                  clipRule="evenodd"
                />
              </svg>
              Single Post
            </span>
          </button>
          <button
            onClick={() => setMode('thread')}
            className={`${
              mode === 'thread'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
              Thread
            </span>
          </button>
        </nav>
      </div>

      {/* Content */}
      {mode === 'single' ? (
        <CreateForm initialText={initialText} initialType={initialType} />
      ) : (
        <div>
          {/* Platform Selector for Thread */}
          <div className="mb-6 bg-white rounded-lg shadow p-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Platform for Thread
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="x"
                  checked={threadPlatform === 'x'}
                  onChange={(e) => setThreadPlatform(e.target.value as Platform)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">X (Twitter)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="instagram"
                  checked={threadPlatform === 'instagram'}
                  onChange={(e) => setThreadPlatform(e.target.value as Platform)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Instagram</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="youtube"
                  checked={threadPlatform === 'youtube'}
                  onChange={(e) => setThreadPlatform(e.target.value as Platform)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">YouTube</span>
              </label>
            </div>
          </div>

          <ThreadComposer platform={threadPlatform} />
        </div>
      )}
    </div>
  )
}
