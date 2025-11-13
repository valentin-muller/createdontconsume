export type Platform = 'x' | 'instagram' | 'youtube'

export interface PlatformLimits {
  characterLimit: number
  recommendedLength?: number
  name: string
}

export const PLATFORM_LIMITS: Record<Platform, PlatformLimits> = {
  x: {
    characterLimit: 280,
    recommendedLength: 240,
    name: 'X (Twitter)',
  },
  instagram: {
    characterLimit: 2200,
    recommendedLength: 150,
    name: 'Instagram',
  },
  youtube: {
    characterLimit: 5000,
    recommendedLength: 500,
    name: 'YouTube',
  },
}

export function getStrictestLimit(platforms: Platform[]): number {
  if (platforms.length === 0) return Infinity

  return Math.min(...platforms.map(p => PLATFORM_LIMITS[p].characterLimit))
}

export function validateContent(text: string, platforms: Platform[]): {
  valid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  if (text.trim().length === 0) {
    errors.push('Content cannot be empty')
    return { valid: false, errors, warnings }
  }

  platforms.forEach(platform => {
    const limits = PLATFORM_LIMITS[platform]
    const length = text.length

    if (length > limits.characterLimit) {
      errors.push(
        `${limits.name}: ${length} characters exceeds limit of ${limits.characterLimit}`
      )
    } else if (limits.recommendedLength && length > limits.recommendedLength) {
      warnings.push(
        `${limits.name}: ${length} characters exceeds recommended length of ${limits.recommendedLength}`
      )
    }
  })

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}
