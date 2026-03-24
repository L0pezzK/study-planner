import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Study Planner",
  description: "Organize your tasks, assignments, and study schedule.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950">
        <nav className="flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200 dark:border-zinc-800 backdrop-blur sticky top-0 z-50">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
              <span className="text-zinc-900 dark:text-white">Study</span>
              <span className="text-blue-600 dark:text-blue-500">Planner</span>
            </Link>
            <div className="hidden sm:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Home</Link>
              <Link href="/tasks" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Tasks</Link>
            </div>
          </div>
          <Link 
            href="/tasks/new" 
            className="inline-flex items-center justify-center h-9 px-4 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm active:scale-95"
          >
            <svg className="mr-1.5 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </Link>
        </nav>
        <div className="flex-1 flex flex-col">{children}</div>
      </body>
    </html>
  );
}
