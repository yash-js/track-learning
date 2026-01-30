# Setup Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud like Supabase/Neon)
- Clerk account for authentication

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/dsa_lms?schema=public"
```

**For Clerk:**
1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Copy your publishable key and secret key to `.env`

**For YouTube API:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3
4. Create credentials (API Key) - restrict it to YouTube Data API v3 for security
5. Copy your API key to `.env` as `YOUTUBE_API_KEY`

**For Database:**
- **Local:** Install PostgreSQL and create a database
- **Cloud (Recommended):**
  - [Supabase](https://supabase.com): Free tier available
    - **⚠️ IMPORTANT for Vercel:** Use the **Connection Pooler** URL (port 6543), not the direct connection (port 5432)
    - Go to Supabase Dashboard → Settings → Database → Connection string → Select "Connection pooling"
    - Format: `postgresql://user:pass@db.xxx.supabase.co:6543/postgres?pgbouncer=true`
  - [Neon](https://neon.tech): Serverless PostgreSQL

### 3. Set Up Database Schema

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### 5. First Login

1. Navigate to the app
2. Click "Get Started"
3. Sign in with Clerk (email, Google, GitHub, etc.)
4. You'll be redirected to the dashboard

## Project Structure

```
├── app/
│   ├── api/video/        # API routes for video completion and notes
│   ├── dashboard/         # Dashboard pages
│   │   ├── [id]/         # Individual video pages
│   │   ├── playlist/     # Playlist view
│   │   └── ...           # Other dashboard pages
│   ├── layout.tsx        # Root layout with ClerkProvider
│   └── page.tsx          # Landing page
├── components/
│   ├── dashboard/        # Dashboard components (Sidebar, Header, etc.)
│   ├── video/            # Video player and notes components
│   └── ui/               # Shadcn UI components
├── lib/
│   ├── prisma.ts         # Prisma client singleton
│   └── utils.ts          # Utility functions (cn, etc.)
├── prisma/
│   └── schema.prisma     # Database schema
└── middleware.ts         # Clerk authentication middleware
```

## Key Features

✅ **Authentication:** Clerk integration with protected routes
✅ **Database:** Prisma ORM with PostgreSQL
✅ **Streak System:** Automatic streak calculation using Next.js 16 `after()` API
✅ **Video Player:** YouTube embed with completion tracking
✅ **Notes:** Auto-saving notes per video
✅ **Progress Tracking:** Module-based progress rings
✅ **Dark Theme:** Midnight theme with glassmorphism effects

## Next Steps

1. **Integrate YouTube API:** Replace mock playlist data with actual YouTube playlist fetching
2. **Add Video Timeline:** Implement bookmarking for important moments
3. **Module Categorization:** Automatically categorize videos by topic
4. **Achievement System:** Implement the achievements feature
5. **Social Features:** Add leaderboard and sharing capabilities

## Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Ensure PostgreSQL is running (if local)
- Check firewall settings (if cloud)

### Clerk Authentication Issues
- Verify your Clerk keys are correct
- Check that your Clerk app is configured for the correct domain
- Ensure middleware is properly set up

### YouTube API Issues
- Verify your `YOUTUBE_API_KEY` is set in `.env`
- Check that YouTube Data API v3 is enabled in Google Cloud Console
- Ensure your API key has proper quotas (default is 10,000 units/day)
- If you see "Loading playlist..." message, check browser console for API errors

### Build Errors
- Run `npx prisma generate` after schema changes
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

## Production Deployment

1. Set up production database (Supabase/Neon recommended)
2. Update `DATABASE_URL` in production environment
3. Configure Clerk for production domain
4. Deploy to Vercel (recommended for Next.js):
   ```bash
   vercel
   ```

