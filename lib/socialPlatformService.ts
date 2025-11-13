import { prisma } from './prisma'

export type Platform = 'x' | 'instagram' | 'youtube'

export interface PublishResult {
  success: boolean
  externalPostId?: string
  error?: string
}

export interface SocialPlatformService {
  publishPost(params: {
    userId: string
    platform: Platform
    text: string
    mediaUrl?: string
    type?: string
  }): Promise<PublishResult>

  getFollowerCounts(userId: string): Promise<Record<Platform, number>>
}

// Mock implementation for development
class MockSocialPlatformService implements SocialPlatformService {
  async publishPost(params: {
    userId: string
    platform: Platform
    text: string
    mediaUrl?: string
    type?: string
  }): Promise<PublishResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500))

    // Simulate 95% success rate
    if (Math.random() < 0.95) {
      const externalPostId = `${params.platform}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Update follower counts (simulate growth)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const followerGrowth = Math.floor(Math.random() * 10) + 1
      const impressions = Math.floor(Math.random() * 400) + 100
      const likes = Math.floor(Math.random() * 50) + 10
      const comments = Math.floor(Math.random() * 10) + 1
      const shares = Math.floor(Math.random() * 5)

      // Upsert daily metrics
      const existingMetric = await prisma.dailyMetric.findUnique({
        where: {
          userId_platform_date: {
            userId: params.userId,
            platform: params.platform,
            date: today,
          },
        },
      })

      if (existingMetric) {
        await prisma.dailyMetric.update({
          where: { id: existingMetric.id },
          data: {
            followers: existingMetric.followers + followerGrowth,
            impressions: existingMetric.impressions + impressions,
            likes: existingMetric.likes + likes,
            comments: existingMetric.comments + comments,
            shares: existingMetric.shares + shares,
          },
        })
      } else {
        // Get previous day's follower count or start with a base
        const previousMetrics = await prisma.dailyMetric.findFirst({
          where: {
            userId: params.userId,
            platform: params.platform,
          },
          orderBy: {
            date: 'desc',
          },
        })

        const baseFollowers = previousMetrics?.followers || this.getBaseFollowers(params.platform)

        await prisma.dailyMetric.create({
          data: {
            userId: params.userId,
            platform: params.platform,
            date: today,
            followers: baseFollowers + followerGrowth,
            impressions,
            likes,
            comments,
            shares,
          },
        })
      }

      return {
        success: true,
        externalPostId,
      }
    } else {
      return {
        success: false,
        error: 'Simulated platform error',
      }
    }
  }

  async getFollowerCounts(userId: string): Promise<Record<Platform, number>> {
    const platforms: Platform[] = ['x', 'instagram', 'youtube']
    const counts: Record<Platform, number> = {
      x: 0,
      instagram: 0,
      youtube: 0,
    }

    for (const platform of platforms) {
      const latestMetric = await prisma.dailyMetric.findFirst({
        where: {
          userId,
          platform,
        },
        orderBy: {
          date: 'desc',
        },
      })

      if (latestMetric) {
        counts[platform] = latestMetric.followers
      } else {
        // Initialize with base followers if no data exists
        counts[platform] = this.getBaseFollowers(platform)
      }
    }

    return counts
  }

  private getBaseFollowers(platform: Platform): number {
    // Base follower counts for new users
    const bases: Record<Platform, number> = {
      x: 150,
      instagram: 200,
      youtube: 50,
    }
    return bases[platform]
  }
}

// Export singleton instance
export const socialPlatformService: SocialPlatformService = new MockSocialPlatformService()
