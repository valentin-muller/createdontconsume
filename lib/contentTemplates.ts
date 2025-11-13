export interface ContentTemplate {
  id: string
  name: string
  description: string
  content: string
  type?: string
  category: 'engagement' | 'educational' | 'promotional' | 'personal' | 'thread'
  platforms: ('x' | 'instagram' | 'youtube')[]
}

export const CONTENT_TEMPLATES: ContentTemplate[] = [
  {
    id: 'tip-of-day',
    name: 'Tip of the Day',
    description: 'Share a quick, actionable tip',
    content: '💡 Quick tip: [Your tip here]\n\nThis helped me [result]. Give it a try!',
    type: 'short',
    category: 'educational',
    platforms: ['x', 'instagram'],
  },
  {
    id: 'behind-scenes',
    name: 'Behind the Scenes',
    description: 'Show your creative process',
    content: '🎬 Behind the scenes:\n\n[Describe what you\'re working on]\n\nHere\'s what most people don\'t see...',
    type: 'generic',
    category: 'personal',
    platforms: ['x', 'instagram'],
  },
  {
    id: 'lesson-learned',
    name: 'Lesson Learned',
    description: 'Share a valuable insight',
    content: 'Here\'s what I learned about [topic]:\n\n• [Point 1]\n• [Point 2]\n• [Point 3]\n\nWhat\'s your experience?',
    type: 'short',
    category: 'educational',
    platforms: ['x', 'instagram'],
  },
  {
    id: 'milestone',
    name: 'Milestone Celebration',
    description: 'Celebrate an achievement',
    content: '🎉 Just hit [milestone]!\n\nThanks to everyone who supported me on this journey.\n\nHere\'s what made it possible: [brief insight]',
    type: 'generic',
    category: 'personal',
    platforms: ['x', 'instagram', 'youtube'],
  },
  {
    id: 'question',
    name: 'Community Question',
    description: 'Engage your audience with a question',
    content: '❓ Quick question for you:\n\n[Your question here]\n\nDrop your answer below! 👇',
    type: 'short',
    category: 'engagement',
    platforms: ['x', 'instagram'],
  },
  {
    id: 'myth-buster',
    name: 'Myth Buster',
    description: 'Debunk a common misconception',
    content: '❌ Myth: [Common belief]\n\n✅ Reality: [The truth]\n\nHere\'s why this matters: [explanation]',
    type: 'short',
    category: 'educational',
    platforms: ['x', 'instagram'],
  },
  {
    id: 'tutorial-intro',
    name: 'Tutorial Introduction',
    description: 'Introduce a tutorial or guide',
    content: '📚 New tutorial:\n\nHow to [achieve something]\n\nYou\'ll learn:\n✓ [Benefit 1]\n✓ [Benefit 2]\n✓ [Benefit 3]\n\nPerfect for [target audience]',
    type: 'generic',
    category: 'educational',
    platforms: ['x', 'instagram', 'youtube'],
  },
  {
    id: 'before-after',
    name: 'Before & After',
    description: 'Show transformation or progress',
    content: 'Before vs After 📊\n\nBefore: [Starting point]\nAfter: [End result]\n\nWhat changed: [key changes]\n\nTime taken: [duration]',
    type: 'generic',
    category: 'personal',
    platforms: ['x', 'instagram'],
  },
  {
    id: 'resource-share',
    name: 'Resource Recommendation',
    description: 'Share a helpful resource',
    content: '📖 Resource recommendation:\n\n[Resource name]\n\nWhy I love it:\n• [Reason 1]\n• [Reason 2]\n• [Reason 3]\n\nBest for: [who should use it]',
    type: 'generic',
    category: 'educational',
    platforms: ['x', 'instagram'],
  },
  {
    id: 'launch-announcement',
    name: 'Product Launch',
    description: 'Announce a new product or service',
    content: '🚀 Excited to announce: [Product name]\n\nIt helps you: [main benefit]\n\n[2-3 key features]\n\nAvailable now: [where/when]',
    type: 'generic',
    category: 'promotional',
    platforms: ['x', 'instagram', 'youtube'],
  },
  {
    id: 'thread-intro',
    name: 'Thread Introduction',
    description: 'Start a Twitter/X thread',
    content: '🧵 Thread: [Topic]\n\nI\'m going to share [what you\'ll share].\n\nThis will help you [benefit].\n\nLet\'s dive in 👇',
    type: 'short',
    category: 'thread',
    platforms: ['x'],
  },
  {
    id: 'weekly-recap',
    name: 'Weekly Recap',
    description: 'Summarize your week',
    content: '📅 This week:\n\n✅ [Achievement 1]\n✅ [Achievement 2]\n✅ [Achievement 3]\n\nNext week\'s focus: [upcoming plans]',
    type: 'generic',
    category: 'personal',
    platforms: ['x', 'instagram'],
  },
]

export function getTemplatesByCategory(category: ContentTemplate['category']): ContentTemplate[] {
  return CONTENT_TEMPLATES.filter(t => t.category === category)
}

export function getTemplatesByPlatform(platform: 'x' | 'instagram' | 'youtube'): ContentTemplate[] {
  return CONTENT_TEMPLATES.filter(t => t.platforms.includes(platform))
}

export function getTemplateById(id: string): ContentTemplate | undefined {
  return CONTENT_TEMPLATES.find(t => t.id === id)
}
