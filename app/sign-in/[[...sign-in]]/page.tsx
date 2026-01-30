"use client"

import { SignIn } from "@clerk/nextjs"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { CheckCircle2, PenLine, Zap } from "lucide-react" // Added for visual flair
import LearningTrackerIcon from "@/components/icons/learning-tracker-icon"
import { Button } from "@/components/ui/button"

function SignInContent() {
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect_url') || '/dashboard'
  
  return (
    <>
        <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1 sm:p-1.5 rounded-lg bg-gradient-to-br from-primary/10 to-chart-2/10">
                <LearningTrackerIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <span className="text-lg sm:text-xl font-extrabold bg-gradient-to-r from-primary via-chart-2 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Learning Tracker
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-xs sm:text-sm hover:bg-primary/10">Back to Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="relative min-h-screen overflow-hidden">
      <div className="relative z-10 flex min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] items-center justify-center px-4 sm:px-6 py-6 sm:py-12">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* ================= LEFT BRANDING ================= */}
          <div className="hidden lg:flex flex-col space-y-12">
            <Link href="/" className="group flex items-center gap-3 w-fit">
              <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 group-hover:scale-105 transition-transform">
                <LearningTrackerIcon className="h-8 w-8 text-primary" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Learning Tracker
              </span>
            </Link>

            <div className="space-y-6">
              <h1 className="text-5xl font-bold text-white leading-[1.1] tracking-tight">
                Master your skills, <br />
                <span className="text-primary">one playlist</span> at a time.
              </h1>
              <p className="text-xl text-muted-foreground max-w-md leading-relaxed">
                The all-in-one workspace to organize YouTube courses, take structured notes, and build lasting habits.
              </p>
            </div>

            <div className="grid gap-6 pt-4">
              <Feature
                icon={<Zap className="w-5 h-5 text-primary" />}
                title="Quick setup"
                desc="Paste a link and your course workspace is ready."
              />
              <Feature
                icon={<PenLine className="w-5 h-5 text-primary" />}
                title="Rich-text notes"
                desc="Capture insights and code snippets as you watch."
              />
              <Feature
                icon={<CheckCircle2 className="w-5 h-5 text-primary" />}
                title="Always free"
                desc="Focus on learning without worrying about costs."
              />
            </div>
          </div>

          {/* ================= RIGHT / CLERK ================= */}
          <div className="w-full flex justify-center lg:justify-start">
            <div className="w-full max-w-md lg:max-w-none">
              <SignIn
                routing="path"
                path="/sign-in"
                signUpUrl="/sign-up"
                redirectUrl={redirectUrl}
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    // Increased background brightness and added a distinct border
                    card: "bg-white  border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden",

                    headerTitle: "text-2xl font-bold text-white tracking-tight",
                    headerSubtitle: "text-slate-400 text-sm",

                    // Social buttons: Subtle but visible borders
                    socialButtonsBlockButton: "bg-white hover:bg-[#2a2a33] border border-5 border-white  text-white transition-all duration-200",
                    socialButtonsBlockButtonText: "font-medium text-white",

                    dividerLine: "bg-white/5",
                    dividerText: "text-slate-500 text-[10px] uppercase tracking-widest",

                    // Form Fields: High contrast inputs are key
                    formFieldLabel: "text-[11px] font-bold  tracking-widest text-slate-400 mb-1.5",
                    formFieldInput: "bg-[#000000] border-white/10 text-white placeholder:text-slate-600 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all h-11",
                    // Primary Button: Make it glow to draw the eye
                    formButtonPrimary: "bg-primary hover:bg-primary/90 text-white font-bold py-6 shadow-[0_10px_20px_-10px_rgba(var(--primary),0.5)] transition-transform active:scale-[0.98]",

                    footerActionLink: "text-primary hover:text-primary/80 font-semibold",
                    footer: "hidden", // If you want to keep your custom mobile footer
                  },
                  variables: {
                    borderRadius: "0.75rem",
                    colorPrimary: "#E11D48", // Ensure this matches your branding
                    colorBackground: "#16161a",
                    colorInputBackground: "#0d0d10",
                    colorText: "white",
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  )
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="mt-1 p-2 rounded-lg bg-white/5 border border-white/10">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}