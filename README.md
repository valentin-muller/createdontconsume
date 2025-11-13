# CreateDon't Consume

A creator-only control panel for social content. This app helps you focus on creating and publishing content without the distraction of consuming feeds.

## Philosophy

**Create, don't consume.** This application is designed to help content creators stay productive by providing:

- A simple interface for drafting and publishing content
- Analytics and metrics to track your output
- Streak tracking to maintain consistency
- An idea inbox to capture inspiration
- Content templates for faster creation
- **Zero consumption features** - no feeds, no scrolling, no distractions

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite via Prisma ORM
- **Authentication**: Email/password with JWT sessions
- **Runtime**: Node.js 20+

## Features

### Core Features

1. **Authentication**
   - Email/password registration and login
   - Secure session management with httpOnly cookies
   - Protected routes with middleware

2. **Idea Inbox** (`/ideas`)
   - Capture content ideas quickly
   - Organize by type (tweet, short, reel, long video)
   - Promote ideas to drafts with one click
   - Delete unwanted ideas

3. **Create Content** (`/create`)
   - Multi-platform composer (X, Instagram, YouTube)
   - **Platform-specific character limits** with visual feedback
   - Real-time validation
   - **Content templates library** (12+ templates)
   - Save drafts or publish immediately
   - Media URL attachment

4. **Drafts Management** (`/drafts`)
   - View all saved drafts
   - Edit, publish, or delete drafts
   - Batch operations (multi-select delete)
   - One-click publishing from drafts

5. **Analytics Dashboard** (`/analytics`)
   - **Visual charts** showing growth over time
   - Follower growth tracking (30-day history)
   - Daily impressions and likes charts
   - Platform breakdown with percentages
   - Engagement rate calculation
   - Average metrics across all content

6. **Main Dashboard** (`/dashboard`)
   - Follower counts per platform (mocked)
   - 7-day growth metrics
   - Posting streak tracker
   - "Posted today" indicator
   - Recent posts table
   - **No feed previews or consumption features**

7. **Settings** (`/settings`)
   - Account information
   - Platform connection toggles (simulated)
   - Discipline mode preference
   - Clean, organized interface

### Production-Ready Features

- **Toast Notification System**: Beautiful, animated notifications for all user actions
- **Character Limits**: Platform-specific validation (X: 280, Instagram: 2200, YouTube: 5000)
- **Smart Validation**: Real-time error and warning messages
- **Content Templates**: 12 pre-made templates across 5 categories
- **Batch Operations**: Select and delete multiple drafts at once
- **Demo Data**: Seed script included with sample user and content

### Anti-Consumption Constraints

This app enforces strict anti-consumption rules:

- ❌ No content feeds
- ❌ No video/audio players
- ❌ No links to view posts in external apps
- ❌ No infinite scroll
- ✅ Only creation, analytics, and utility features

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd createdontconsume
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set:
```
JWT_SECRET=your-secure-random-secret-here
DATABASE_URL="file:./prisma/dev.db"
```

4. Initialize the database:
```bash
npm run db:push
```

5. (Optional) Seed the database with demo data:
```bash
npm run db:seed
```

This creates a demo account:
- Email: `demo@createdontconsume.com`
- Password: `demo123`

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
createdontconsume/
├── app/
│   ├── (authenticated)/      # Protected routes with auth layout
│   │   ├── dashboard/        # Main dashboard
│   │   ├── create/           # Content composer
│   │   ├── ideas/            # Idea inbox
│   │   ├── drafts/           # Drafts management
│   │   ├── analytics/        # Analytics with charts
│   │   └── settings/         # User settings
│   ├── api/                  # API routes
│   │   ├── auth/             # Authentication endpoints
│   │   ├── content/          # Content management
│   │   ├── ideas/            # Idea management
│   │   └── settings/         # Settings management
│   ├── login/                # Login page
│   ├── register/             # Registration page
│   └── layout.tsx            # Root layout with providers
├── components/               # Reusable React components
│   ├── Toast.tsx            # Toast notification component
│   ├── TemplatesPicker.tsx  # Content templates modal
│   ├── AnalyticsCharts.tsx  # Chart visualizations
│   └── ...                   # Other components
├── contexts/                 # React contexts
│   └── ToastContext.tsx     # Toast notification context
├── lib/                      # Utility libraries
│   ├── auth.ts              # Authentication utilities
│   ├── prisma.ts            # Prisma client
│   ├── platformLimits.ts    # Character limit validation
│   ├── contentTemplates.ts  # Template definitions
│   ├── socialPlatformService.ts  # Mock social platform service
│   └── streaks.ts           # Streak calculation logic
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Seed script for demo data
└── middleware.ts            # Next.js middleware for auth
```

## Database Schema

The app uses SQLite with the following main models:

- **User**: User accounts with authentication
- **Idea**: Content ideas in the inbox
- **ContentItem**: Published or draft posts
- **PostMetric**: Engagement metrics per post
- **DailyMetric**: Daily aggregated metrics per platform
- **Streak**: User posting streak data

## Mock Social Platform Service

The MVP uses a mock implementation of social platform APIs (`lib/socialPlatformService.ts`). This:

- Simulates successful posts with 95% success rate
- Generates mock engagement metrics
- Updates follower counts incrementally
- Can be easily swapped with real API integrations later

To implement real integrations:
1. Create new classes implementing the `SocialPlatformService` interface
2. Replace the mock instance in `socialPlatformService.ts`
3. Add OAuth flows for each platform

## Content Templates

12 built-in templates across 5 categories:

- **Engagement**: Questions, polls, community prompts
- **Educational**: Tips, tutorials, myth-busters
- **Promotional**: Product launches, announcements
- **Personal**: Milestones, behind-the-scenes, weekly recaps
- **Thread**: Thread starters for X/Twitter

Access via the "Use Template" button on the create page.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:seed` - Seed database with demo data

## Feature Highlights

### Character Limit Validation
- Real-time character counting
- Platform-specific limits enforced
- Visual feedback (color changes at 75%, 90%, 100%)
- Prevents publishing over-limit content
- Warning for content over recommended length

### Toast Notifications
- Beautiful slide-in animations
- 4 types: success, error, info, warning
- Auto-dismiss after 5 seconds
- Manual close option
- Positioned in top-right corner

### Content Templates
- 12 pre-made templates
- Filter by category
- One-click application
- Customizable after insertion
- Platform suggestions included

### Analytics Charts
- 30-day historical data
- Horizontal bar charts
- Color-coded by metric type
- Last 14 days displayed
- Smooth animations

### Batch Operations
- Multi-select checkboxes
- Batch delete drafts
- Select all/none toggle
- Visual selection feedback

## Future Enhancements

- Real social media API integrations (OAuth)
- Scheduled posting with calendar
- Content calendar view
- Team collaboration features
- Advanced analytics with exportAbel CSV
- Content performance predictions
- Hashtag suggestions
- A/B testing for content
- Content recycling/repurposing
- Mobile app

## Philosophy & Design Principles

1. **Creation First**: Every feature prioritizes content creation over consumption
2. **No Distractions**: Deliberately excludes feeds, previews, and consumption features
3. **Metrics Matter**: Track what matters - output, consistency, growth
4. **Simple & Fast**: Minimal UI, fast interactions, no unnecessary complexity
5. **Extensible**: Clean abstractions for future platform integrations
6. **User Feedback**: Clear, immediate feedback for all actions
7. **Data-Driven**: Analytics help creators understand what works

## Development Notes

### Adding New Platforms

1. Update `lib/platformLimits.ts` with new platform limits
2. Add platform to `lib/socialPlatformService.ts`
3. Update form components with new platform option
4. Add platform-specific validation rules

### Adding New Templates

1. Add template definition to `lib/contentTemplates.ts`
2. Specify category, platforms, and default content
3. Templates automatically appear in the picker

### Customizing Analytics

1. Modify `components/AnalyticsCharts.tsx` for chart styles
2. Update aggregation logic in analytics page
3. Add new metric types to `DailyMetric` model

## Contributing

This is a personal project, but suggestions are welcome! Please open an issue to discuss major changes.

## License

Private - All rights reserved

---

**Create. Don't Consume.**

Built with ❤️ for creators who want to stay focused and productive.
