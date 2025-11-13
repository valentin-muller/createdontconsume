import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo user
  const passwordHash = await bcrypt.hash('demo123', 10)

  const user = await prisma.user.upsert({
    where: { email: 'demo@createdontconsume.com' },
    update: {},
    create: {
      email: 'demo@createdontconsume.com',
      passwordHash,
      settings: JSON.stringify({
        disciplineMode: false,
        connectedX: true,
        connectedInstagram: true,
        connectedYouTube: true,
      }),
    },
  })

  console.log('✅ Created demo user:', user.email)

  // Create streak
  await prisma.streak.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      currentStreakDays: 5,
      longestStreakDays: 12,
      lastActivityDate: new Date(),
    },
  })

  console.log('✅ Created streak')

  // Create some ideas
  const ideaTexts = [
    'Share my morning routine that increased productivity by 300%',
    'Tutorial: How to set up automated content scheduling',
    'Behind the scenes of my creative process',
    'Top 5 tools every creator needs in 2024',
    'Lessons learned from hitting 10K followers',
  ]

  for (const text of ideaTexts) {
    await prisma.idea.create({
      data: {
        userId: user.id,
        text,
        type: ['tweet', 'short', 'reel', 'long'][Math.floor(Math.random() * 4)],
      },
    })
  }

  console.log('✅ Created ideas')

  // Create published content
  const contentPosts = [
    { platform: 'x', text: '🚀 Just launched my new project! Check it out and let me know what you think.' },
    { platform: 'instagram', text: 'Behind the scenes of today\'s photoshoot 📸 #creator #behindthescenes' },
    { platform: 'youtube', text: 'New video is live! Learn how to grow your audience in 30 days 🎥' },
    { platform: 'x', text: '💡 Quick tip: Batch your content creation on Sundays to free up your week!' },
    { platform: 'instagram', text: 'Throwback to last month\'s event. What an incredible experience! 🎉' },
  ]

  for (let i = 0; i < contentPosts.length; i++) {
    const post = contentPosts[i]
    const publishedAt = new Date()
    publishedAt.setDate(publishedAt.getDate() - (contentPosts.length - i))

    const contentItem = await prisma.contentItem.create({
      data: {
        userId: user.id,
        platform: post.platform,
        status: 'published',
        type: 'short',
        text: post.text,
        publishedAt,
      },
    })

    // Create metrics for each post
    await prisma.postMetric.create({
      data: {
        contentItemId: contentItem.id,
        impressions: Math.floor(Math.random() * 1000) + 500,
        likes: Math.floor(Math.random() * 100) + 20,
        comments: Math.floor(Math.random() * 20) + 5,
        shares: Math.floor(Math.random() * 10) + 1,
      },
    })
  }

  console.log('✅ Created published content')

  // Create some drafts
  const draftPosts = [
    { platform: 'x', text: 'Working on a new series about productivity hacks. Stay tuned!' },
    { platform: 'youtube', text: 'Q&A video coming soon - drop your questions below!' },
  ]

  for (const draft of draftPosts) {
    await prisma.contentItem.create({
      data: {
        userId: user.id,
        platform: draft.platform,
        status: 'draft',
        type: 'short',
        text: draft.text,
      },
    })
  }

  console.log('✅ Created drafts')

  // Create daily metrics for the last 30 days
  for (let i = 30; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)

    for (const platform of ['x', 'instagram', 'youtube']) {
      const baseFollowers = platform === 'x' ? 1500 : platform === 'instagram' ? 2200 : 850
      const growth = Math.floor(Math.random() * 10) + 2

      await prisma.dailyMetric.create({
        data: {
          userId: user.id,
          platform,
          date,
          followers: baseFollowers + (30 - i) * growth,
          impressions: Math.floor(Math.random() * 500) + 200,
          likes: Math.floor(Math.random() * 50) + 10,
          comments: Math.floor(Math.random() * 10) + 2,
          shares: Math.floor(Math.random() * 5) + 1,
        },
      })
    }
  }

  console.log('✅ Created daily metrics for 30 days')

  console.log('🎉 Seeding complete!')
  console.log('\n📧 Demo account credentials:')
  console.log('   Email: demo@createdontconsume.com')
  console.log('   Password: demo123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
