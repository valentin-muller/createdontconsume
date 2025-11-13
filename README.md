# CreateDon't Consume

A creator-only control panel for social content. This app helps you focus on creating and publishing content without the distraction of consuming feeds.

## Philosophy

**Create, don't consume.** This application is designed to help content creators stay productive by providing:

- A simple interface for drafting and publishing content
- Analytics and metrics to track your output
- Streak tracking to maintain consistency
- An idea inbox to capture inspiration
- **Zero consumption features** - no feeds, no scrolling, no distractions

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite via Prisma ORM
- **Authentication**: Email/password with JWT sessions
- **Runtime**: Node.js 20+

## Features

### MVP Features

1. **Authentication**
   - Email/password registration and login
   - Secure session management with httpOnly cookies

2. **Idea Inbox** (`/ideas`)
   - Capture content ideas quickly
   - Organize by type (tweet, short, reel, long video)
   - Promote ideas to drafts

3. **Create Content** (`/create`)
   - Multi-platform composer (X, Instagram, YouTube)
   - Save drafts or publish immediately
   - Simple media URL attachment

4. **Dashboard** (`/dashboard`)
   - Follower counts per platform (mocked)
   - 7-day growth metrics
   - Posting streak tracker
   - Recent posts table
   - **No feed previews or consumption features**

5. **Settings** (`/settings`)
   - Account information
   - Platform connection toggles (simulated)
   - Discipline mode preference

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
# or
pnpm db:push
```

This will create the SQLite database and apply the schema.

5. Generate Prisma Client:
```bash
npm run db:generate
# or
pnpm db:generate
```

### Running the Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You'll be redirected to the login page. Create a new account to get started.

## Project Structure

```
createdontconsume/
├── app/
│   ├── (authenticated)/      # Protected routes with auth layout
│   │   ├── dashboard/        # Main dashboard
│   │   ├── create/           # Content composer
│   │   ├── ideas/            # Idea inbox
│   │   └── settings/         # User settings
│   ├── api/                  # API routes
│   │   ├── auth/             # Authentication endpoints
│   │   ├── content/          # Content management
│   │   ├── ideas/            # Idea management
│   │   └── settings/         # Settings management
│   ├── login/                # Login page
│   ├── register/             # Registration page
│   └── layout.tsx            # Root layout
├── components/               # Reusable React components
├── lib/                      # Utility libraries
│   ├── auth.ts              # Authentication utilities
│   ├── prisma.ts            # Prisma client
│   ├── socialPlatformService.ts  # Mock social platform service
│   └── streaks.ts           # Streak calculation logic
├── prisma/
│   └── schema.prisma        # Database schema
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

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:studio` - Open Prisma Studio (database GUI)

## Future Enhancements

- Real social media API integrations (OAuth)
- Scheduled posting
- Content calendar view
- Team collaboration features
- Advanced analytics
- Content templates
- Bulk upload and scheduling

## Philosophy & Design Principles

1. **Creation First**: Every feature prioritizes content creation over consumption
2. **No Distractions**: Deliberately excludes feeds, previews, and consumption features
3. **Metrics Matter**: Track what matters - output, consistency, growth
4. **Simple & Fast**: Minimal UI, fast interactions, no unnecessary complexity
5. **Extensible**: Clean abstractions for future platform integrations

---

**Create. Don't Consume.**
