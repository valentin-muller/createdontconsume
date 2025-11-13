import { prisma } from './prisma'

export async function updateStreak(userId: string): Promise<void> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const streak = await prisma.streak.findUnique({
    where: { userId },
  })

  if (!streak) {
    // Create initial streak
    await prisma.streak.create({
      data: {
        userId,
        currentStreakDays: 1,
        longestStreakDays: 1,
        lastActivityDate: today,
      },
    })
    return
  }

  if (!streak.lastActivityDate) {
    // First activity
    await prisma.streak.update({
      where: { userId },
      data: {
        currentStreakDays: 1,
        longestStreakDays: 1,
        lastActivityDate: today,
      },
    })
    return
  }

  const lastActivity = new Date(streak.lastActivityDate)
  lastActivity.setHours(0, 0, 0, 0)

  const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24))

  if (daysDiff === 0) {
    // Already posted today, no change
    return
  } else if (daysDiff === 1) {
    // Consecutive day
    const newCurrentStreak = streak.currentStreakDays + 1
    const newLongestStreak = Math.max(newCurrentStreak, streak.longestStreakDays)

    await prisma.streak.update({
      where: { userId },
      data: {
        currentStreakDays: newCurrentStreak,
        longestStreakDays: newLongestStreak,
        lastActivityDate: today,
      },
    })
  } else {
    // Streak broken
    await prisma.streak.update({
      where: { userId },
      data: {
        currentStreakDays: 1,
        lastActivityDate: today,
      },
    })
  }
}

export async function hasPostedToday(userId: string): Promise<boolean> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const post = await prisma.contentItem.findFirst({
    where: {
      userId,
      status: 'published',
      publishedAt: {
        gte: today,
        lt: tomorrow,
      },
    },
  })

  return post !== null
}
