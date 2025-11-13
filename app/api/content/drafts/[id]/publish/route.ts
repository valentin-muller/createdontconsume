import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { socialPlatformService, type Platform } from '@/lib/socialPlatformService'
import { updateStreak } from '@/lib/streaks'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const draft = await prisma.contentItem.findUnique({
      where: { id: params.id },
    })

    if (!draft) {
      return NextResponse.json(
        { error: 'Draft not found' },
        { status: 404 }
      )
    }

    if (draft.userId !== session.userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    if (draft.status !== 'draft') {
      return NextResponse.json(
        { error: 'Content is not a draft' },
        { status: 400 }
      )
    }

    // Publish via the mock service
    const result = await socialPlatformService.publishPost({
      userId: session.userId,
      platform: draft.platform as Platform,
      text: draft.text,
      mediaUrl: draft.mediaUrl || undefined,
      type: draft.type || undefined,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to publish' },
        { status: 500 }
      )
    }

    // Update draft to published
    await prisma.contentItem.update({
      where: { id: params.id },
      data: {
        status: 'published',
        publishedAt: new Date(),
      },
    })

    // Create post metrics
    await prisma.postMetric.create({
      data: {
        contentItemId: draft.id,
        impressions: Math.floor(Math.random() * 400) + 100,
        likes: Math.floor(Math.random() * 50) + 10,
        comments: Math.floor(Math.random() * 10) + 1,
        shares: Math.floor(Math.random() * 5),
      },
    })

    // Update streak
    await updateStreak(session.userId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error publishing draft:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
