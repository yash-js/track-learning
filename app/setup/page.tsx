import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import SetupForm from "./setup-form"

export default async function SetupPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-6">
      <SetupForm />
    </div>
  )
}

