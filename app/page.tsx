import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { 
  PlayCircle, 
  TrendingUp, 
  BookOpen, 
  Target, 
  CheckCircle2,
  Video,
  BarChart3,
  Flame
} from "lucide-react"
import LearningTrackerIcon from "@/components/icons/learning-tracker-icon"

export default async function HomePage() {
  const { userId } = await auth()

  if (userId) {
    // Check if user has playlist configured
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })
    
    if (user && (user as any).playlistId) {
      redirect("/dashboard")
    } else {
      redirect("/setup")
    }
  }

  const features = [
    {
      icon: Video,
      title: "Track Any YouTube Playlist",
      description: "Connect your favorite YouTube playlist and track your progress automatically. Works with any learning playlist - coding, languages, skills, and more.",
    },
    {
      icon: TrendingUp,
      title: "Build Learning Streaks",
      description: "Stay motivated with daily streaks. Watch videos consistently to build your streak and see your progress grow day by day.",
    },
    {
      icon: BookOpen,
      title: "Take Notes as You Learn",
      description: "Save your insights and key takeaways directly in the app. Your notes are automatically saved and organized per video.",
    },
    {
      icon: BarChart3,
      title: "Visual Progress Tracking",
      description: "See exactly how much you've completed with beautiful progress indicators. Know where you are in your learning journey at a glance.",
    },
    {
      icon: Target,
      title: "Set Learning Goals",
      description: "Track your completion rate and set personal goals. Watch your progress percentage grow as you complete more videos.",
    },
    {
      icon: CheckCircle2,
      title: "Never Lose Your Place",
      description: "Always know which video to watch next. The app remembers where you left off and suggests the next video to continue learning.",
    },
  ]

  const steps = [
    {
      number: "1",
      title: "Sign Up",
      description: "Create your free account in seconds. No credit card required.",
    },
    {
      number: "2",
      title: "Add Your Playlist",
      description: "Paste the link to your YouTube playlist. We'll automatically load all the videos.",
    },
    {
      number: "3",
      title: "Start Learning",
      description: "Watch videos, take notes, and track your progress. Build streaks and achieve your learning goals!",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary/10 to-chart-2/10">
                <LearningTrackerIcon className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-primary via-chart-2 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Learning Tracker
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/sign-in">
                <Button variant="ghost" className="hover:bg-primary/10">Sign In</Button>
              </Link>
              <Link href="/sign-in">
                <Button className="gap-2 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all">
                  <PlayCircle className="h-4 w-4" />
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-chart-2/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(var(--primary)/0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,oklch(var(--chart-2)/0.1),transparent_50%)]" />
        
        <div className="container relative mx-auto px-6 py-32 md:py-40">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="mb-6 text-6xl font-extrabold tracking-tight md:text-7xl lg:text-8xl">
              <span className="block bg-gradient-to-r from-foreground via-foreground/95 to-foreground/80 bg-clip-text text-transparent">
                Track Your Learning
              </span>
              <span className="block mt-2 bg-gradient-to-r from-primary via-chart-2 to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Master Any Skill
              </span>
            </h1>
            <p className="mb-10 text-xl text-muted-foreground md:text-2xl max-w-2xl mx-auto leading-relaxed">
              Turn any YouTube playlist into a structured learning journey. 
              Track progress, build streaks, take notes, and never lose your place.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/sign-in">
                <Button size="default" className="gap-2">
                  <PlayCircle className="h-4 w-4" />
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tight">
              Everything You Need to Learn Better
            </h2>
            <p className="text-xl text-muted-foreground">
              Powerful features designed to help you stay consistent and track your progress
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden backdrop-blur-md bg-card/50 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-chart-2/0 group-hover:from-primary/5 group-hover:via-primary/5 group-hover:to-chart-2/5 transition-all duration-300" />
                
                <CardHeader className="relative">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex rounded-xl bg-gradient-to-br from-primary/20 to-chart-2/20 p-3 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <CardDescription className="text-base leading-relaxed text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-t border-border bg-muted/20">
        <div className="container mx-auto px-6 py-24">
          <div className="mx-auto max-w-4xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold tracking-tight">
                How It Works
              </h2>
              <p className="text-xl text-muted-foreground">
                Get started in three simple steps
              </p>
            </div>
            <div className="relative grid gap-8 md:grid-cols-3">
              {steps.map((step, index) => (
                <div key={index} className="relative z-10">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-chart-2 text-2xl font-bold text-white shadow-lg relative z-10">
                      {step.number}
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="absolute left-[calc(50%+4rem)] top-8 hidden h-0.5 w-[calc(100%-8rem)] bg-gradient-to-r from-primary to-chart-2 md:block z-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="mb-6 text-4xl font-bold tracking-tight">
                Why Learners Love Us
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/20">
                      <CheckCircle2 className="h-6 w-6 text-chart-2" />
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">Stay Consistent</h3>
                    <p className="text-muted-foreground">
                      Build daily learning habits with streak tracking. Watch your consistency improve over time.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">Never Lose Progress</h3>
                    <p className="text-muted-foreground">
                      Always know which video to watch next. Your progress is saved automatically.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/20">
                      <BookOpen className="h-6 w-6 text-chart-3" />
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">Organized Learning</h3>
                    <p className="text-muted-foreground">
                      Keep all your notes in one place. Review what you learned whenever you need.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Card className="backdrop-blur-md bg-muted/30 border-border/50 p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Streak</p>
                      <p className="text-2xl font-bold text-primary">7 days</p>
                    </div>
                    <Flame className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Videos Completed</p>
                      <p className="text-2xl font-bold text-chart-2">24 / 100</p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-chart-2" />
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">24%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full w-1/4 bg-gradient-to-r from-primary to-chart-2" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-gradient-to-br from-primary/10 via-transparent to-chart-2/10">
        <div className="container mx-auto px-6 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              Ready to Start Learning?
            </h2>
            <p className="mb-8 text-xl text-muted-foreground">
              Join thousands of learners who are tracking their progress and building consistent learning habits.
            </p>
            <Link href="/sign-in">
              <Button size="lg" className="gap-2 text-lg px-8 py-6">
                <PlayCircle className="h-5 w-5" />
                Get Started Free
              </Button>
            </Link>
            <p className="mt-6 text-sm text-muted-foreground">
              Free forever • Setup in 2 minutes
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h3 className="mb-2 text-lg font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                Learning Tracker
              </h3>
              <p className="text-sm text-muted-foreground">
                Track your learning progress with any YouTube playlist
              </p>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/sign-in" className="hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Link href="/sign-up" className="hover:text-foreground transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2026 Learning Tracker. Built for learners, by learners.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
