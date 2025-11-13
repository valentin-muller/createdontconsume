import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const draftSchema = z.object({
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
    const { text, mediaUrl, type, platforms } = draftSchema.parse(body)

    // Create draft content items for each platform
    const contentItems = await Promise.all(
      platforms.map((platform) =>
        prisma.contentItem.create({
          data: {
            userId: session.userId,
            platform,
            status: 'draft',
            type: type || null,
            text,
            mediaUrl: mediaUrl || null,
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

    console.error('Error creating draft:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
