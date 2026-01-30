# DSA Playlist LMS

A high-end, modern Learning Management System for Kunal Kushwaha's DSA Playlist built with Next.js 16, React 19, and the latest 2026 tech stack.

## 🚀 Tech Stack

- **Framework:** Next.js 16 (LTS) with App Router
- **React:** React 19 with 'use' hook and React Compiler
- **Styling:** Tailwind CSS v4 + Shadcn UI (React 19 compatible)
- **Auth:** Clerk (Next.js 15+ compatible middleware)
- **Database:** Prisma ORM with PostgreSQL (Supabase/Neon)
- **Animations:** Framer Motion
- **Build:** Turbopack enabled

## ✨ Features

- **Dark Mode UI:** Midnight theme with Cyan/Emerald accents
- **Smart Progress Tracking:** Track video completion and module progress
- **Streak System:** Build daily learning streaks with automatic calculation
- **Video Player:** Integrated YouTube player with notes interface
- **Rich Notes:** Auto-saving notes per video with debounced saves
- **Gamification:** Progress rings for different DSA modules
- **Performance:** Server Components for data fetching, optimized with caching

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
│   ├── api/              # API routes
│   ├── dashboard/        # Dashboard pages
│   └── layout.tsx        # Root layout with ClerkProvider
├── components/
│   ├── dashboard/        # Dashboard components
│   ├── video/            # Video player components
│   └── ui/               # Shadcn UI components
├── lib/
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Utility functions
└── prisma/
    └── schema.prisma     # Database schema
```

## 🎯 Key Features Implementation

### Streak Calculation
Uses Next.js 16 `after()` API to handle streak calculations in the background without blocking the UI response.

### Server Components
Data fetching is done in Server Components for optimal performance, with `use cache` directives for instant dashboard loads.

### Video Progress
Each video tracks:
- Completion status
- Last watched timestamp
- User notes
- Progress per module

## 🔐 Authentication

The app uses Clerk for authentication. Make sure to:
1. Create a Clerk account
2. Set up your application
3. Add the keys to your `.env` file

## 🎥 YouTube Integration

The app fetches playlist data from YouTube Data API v3:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project and enable YouTube Data API v3
3. Create an API key credential
4. Add `YOUTUBE_API_KEY` to your `.env` file

The playlist ID is hardcoded: `PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ` (Kunal Kushwaha's DSA Playlist)

## 📊 Database Schema

- **User:** Tracks user streaks, progress, and activity
- **VideoProgress:** Tracks individual video completion, notes, and watch history

## 🚧 Next Steps

- [x] Integrate YouTube API to fetch actual playlist data
- [ ] Add video timeline/bookmarking feature
- [ ] Implement module categorization
- [ ] Add achievement system
- [ ] Add social features (leaderboard, sharing)

## 📝 License

MIT
