import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { socialPlatformService, type Platform } from '@/lib/socialPlatformService'
import { updateStreak } from '@/lib/streaks'
import { z } from 'zod'

const publishSchema = z.object({
  text: z.string().min(1),
  mediaUrl: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  platforms: z.array(z.enum(['x', 'instagram', 'youtube'])),
})

export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { text, mediaUrl, type, platforms } = publishSchema.parse(body)

    const results = []
    const errors = []

    // Publish to each platform
    for (const platform of platforms) {
      try {
        const result = await socialPlatformService.publishPost({
          userId: session.userId,
          platform: platform as Platform,
          text,
          mediaUrl: mediaUrl || undefined,
          type: type || undefined,
        })

        if (result.success) {
          // Create content item
          const contentItem = await prisma.contentItem.create({
            data: {
              userId: session.userId,
              platform,
              status: 'published',
              type: type || null,
              text,
              mediaUrl: mediaUrl || null,
              publishedAt: new Date(),
            },
          })

          // Create post metrics
          await prisma.postMetric.create({
            data: {
              contentItemId: contentItem.id,
              impressions: Math.floor(Math.random() * 400) + 100,
              likes: Math.floor(Math.random() * 50) + 10,
              comments: Math.floor(Math.random() * 10) + 1,
              shares: Math.floor(Math.random() * 5),
            },
          })

          results.push({ platform, success: true })
        } else {
          errors.push({ platform, error: result.error })
          results.push({ platform, success: false, error: result.error })
        }
      } catch (error) {
        console.error(`Error publishing to ${platform}:`, error)
        errors.push({ platform, error: 'Failed to publish' })
        results.push({ platform, success: false, error: 'Failed to publish' })
      }
    }

    // Update streak if at least one post was successful
    if (results.some(r => r.success)) {
      await updateStreak(session.userId)
    }

    // Return results
    if (errors.length > 0 && results.filter(r => r.success).length === 0) {
      return NextResponse.json(
        { error: 'Failed to publish to all platforms', results },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      results,
      message: errors.length > 0
        ? `Published to ${results.filter(r => r.success).length} platform(s), ${errors.length} failed`
        : 'Published successfully to all platforms',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error publishing:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
