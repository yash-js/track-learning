# Learn - YouTube Playlist Learning Tracker

A modern, feature-rich Learning Management System for tracking progress on any YouTube playlist. Built with Next.js 16, React 19, and the latest 2026 tech stack.

## 🚀 Tech Stack

- **Framework:** Next.js 16 (LTS) with App Router
- **React:** React 19 with 'use' hook and React Compiler
- **Styling:** Tailwind CSS v4 + Shadcn UI (React 19 compatible)
- **Auth:** Clerk (Next.js 15+ compatible middleware)
- **Database:** Prisma ORM with PostgreSQL (Supabase/Neon)
- **Animations:** Framer Motion
- **Build:** Turbopack enabled

## ✨ Features

- **🎨 Modern Dark UI:** Beautiful midnight theme with glassmorphism effects
- **📊 Smart Progress Tracking:** Track video completion with visual progress indicators
- **🔥 Streak System:** Build daily learning streaks with automatic calculation
- **📝 Rich Notes:** Auto-saving notes per video with debounced saves
- **💡 Key Takeaways:** Save important concepts, formulas, and insights from each video
- **🏆 Dynamic Achievements:** Unlock achievements as you progress (First Streak, Halfway There, Master)
- **▶️ Video Player:** Integrated YouTube player with watch position tracking
- **🔄 Smart Navigation:** Next/Previous video navigation with auto-redirect on completion
- **⚙️ Playlist Management:** Easy playlist switching with validation
- **📱 Fully Responsive:** Optimized for mobile, tablet, and desktop
- **⚡ Performance:** Server Components for data fetching, optimized with caching

## 🛠️ Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your Clerk keys, database URL, and YouTube API key.

3. **Set up the database:**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── setup/playlist/    # Playlist setup endpoint
│   │   └── video/
│   │       ├── complete/       # Mark video as complete
│   │       ├── notes/          # Save/update notes
│   │       ├── position/       # Save watch position
│   │       └── takeaways/      # Key takeaways CRUD
│   ├── dashboard/
│   │   ├── achievements/      # Achievements page
│   │   ├── playlist/         # Playlist view
│   │   ├── progress/         # Progress tracking
│   │   ├── settings/         # User settings
│   │   └── video/[id]/       # Individual video page
│   ├── setup/                # Initial playlist setup
│   └── layout.tsx            # Root layout with ClerkProvider
├── components/
│   ├── dashboard/            # Dashboard components
│   ├── video/                # Video player & notes components
│   └── ui/                   # Shadcn UI components
├── lib/
│   ├── prisma.ts             # Prisma client singleton
│   ├── utils.ts              # Utility functions
│   └── youtube.ts            # YouTube API integration
└── prisma/
    ├── schema.prisma         # Database schema
    └── migrations/           # Database migrations
```

## 🎯 Key Features Implementation

### Streak Calculation
Uses Next.js 16 `after()` API to handle streak calculations in the background without blocking the UI response. Streaks are calculated based on consecutive days of video completion.

### Server Components
Data fetching is done in Server Components for optimal performance, with caching for instant dashboard loads.

### Video Progress
Each video tracks:
- Completion status
- Last watched timestamp
- Watch position (resume from where you left off)
- User notes (auto-saved with debouncing)
- Key takeaways (important concepts and insights)

### Achievements System
Dynamic achievements that unlock based on:
- **First Streak:** Complete a 3-day learning streak
- **Halfway There:** Complete 50% of your playlist
- **Master:** Complete 100% of your playlist

### Key Takeaways
Save and organize important learning points:
- Add takeaways with optional titles
- Edit and delete takeaways
- Organized per video for easy review

## 🔐 Authentication

The app uses Clerk for authentication. Make sure to:
1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Set up your application
3. Add the keys to your `.env` file:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/setup
   ```

## 🎥 YouTube Integration

The app fetches playlist data from YouTube Data API v3:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project and enable YouTube Data API v3
3. Create an API key credential
4. Add `YOUTUBE_API_KEY` to your `.env` file

**Playlist Setup:**
- Users can add any YouTube playlist URL during setup
- Playlist URL is validated to ensure it's a valid YouTube playlist
- Videos are automatically fetched and organized
- Playlist can be changed anytime from settings

## 📊 Database Schema

- **User:** Tracks user streaks, progress, playlist info, and activity
- **VideoProgress:** Tracks individual video completion, notes, watch position, and watch history
- **KeyTakeaway:** Stores key takeaways/concepts saved by users for each video

## ✅ Completed Features

- [x] Integrate YouTube API to fetch actual playlist data
- [x] Key Takeaways feature (save important concepts)
- [x] Dynamic Achievement system
- [x] Playlist management with validation
- [x] Next/Previous video navigation
- [x] Auto-redirect on video completion
- [x] Watch position tracking (resume playback)
- [x] Fully responsive design
- [x] Settings page with playlist management

## 🚧 Future Enhancements

- [ ] Module categorization
- [ ] Social features (leaderboard, sharing)
- [ ] Video search and filtering
- [ ] Export notes and takeaways
- [ ] Custom themes
- [ ] Video speed controls
- [ ] Subtitles/transcript support

## 🛠️ Development

### Running Migrations

```bash
# Create a new migration
npx prisma migrate dev --name your_migration_name

# Apply migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

### Environment Variables

Required environment variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/setup

# Database
DATABASE_URL=

# YouTube API
YOUTUBE_API_KEY=
```

### ⚠️ Important: Supabase Connection Pooling for Vercel

When deploying to Vercel with Supabase, you **must** use the **Connection Pooler** URL instead of the direct connection URL.

**For Supabase:**
1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Database**
3. Under **Connection string**, select **Connection pooling** (not Direct connection)
4. Copy the connection string (it will have port `6543` instead of `5432`)
5. Use this URL in your Vercel environment variables

**Example:**
- ❌ Direct connection: `postgresql://user:pass@db.xxx.supabase.co:5432/postgres`
- ✅ Connection pooler: `postgresql://user:pass@db.xxx.supabase.co:6543/postgres?pgbouncer=true`

The connection pooler is required for serverless environments like Vercel to prevent connection limit issues.

## 📝 License

MIT
