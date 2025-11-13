import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const scheduleSchema = z.object({
  text: z.string().min(1),
  mediaUrl: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  platforms: z.array(z.enum(['x', 'instagram', 'youtube'])),
  scheduledAt: z.string(),
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
    const { text, mediaUrl, type, platforms, scheduledAt } = scheduleSchema.parse(body)

    const scheduledDate = new Date(scheduledAt)
    const now = new Date()

    if (scheduledDate <= now) {
      return NextResponse.json(
        { error: 'Scheduled time must be in the future' },
        { status: 400 }
      )
    }

    // Create scheduled content items for each platform
    const contentItems = await Promise.all(
      platforms.map((platform) =>
        prisma.contentItem.create({
          data: {
            userId: session.userId,
            platform,
            status: 'scheduled',
            type: type || null,
            text,
            mediaUrl: mediaUrl || null,
            scheduledAt: scheduledDate,
          },
        })
      )
    )

    return NextResponse.json({ success: true, contentItems })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error scheduling post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
