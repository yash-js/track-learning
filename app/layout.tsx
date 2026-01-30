import type { Metadata } from "next";
import { Petrona } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const petrona = Petrona({
  variable: "--font-petrona",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Learning Tracker",
  description: "Track your learning progress with any YouTube playlist",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body
          className={`${petrona.variable} antialiased bg-background text-foreground`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
