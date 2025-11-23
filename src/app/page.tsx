import Link from "next/link";
import { ArrowRight, Crown } from "lucide-react";

import { Button } from "~/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-zinc-50 via-zinc-100 to-zinc-200 font-sans dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800">
      <main className="flex w-full max-w-4xl flex-col items-center justify-center gap-12 px-8 py-24">
        {/* Hero section */}
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="bg-primary/10 ring-primary/20 rounded-full p-6 shadow-xl ring-1">
            <Crown className="text-primary h-16 w-16" />
          </div>
          <h1 className="max-w-2xl text-5xl leading-tight font-bold tracking-tight text-black md:text-6xl dark:text-zinc-50">
            Modular Chess Board System
          </h1>
          <p className="max-w-xl text-xl leading-8 text-zinc-600 dark:text-zinc-400">
            A production-ready, fully modular chess board built with Next.js 16,
            React, Framer Motion, and chess.js. Complete with animations,
            themes, timers, and PGN/FEN support.
          </p>
        </div>

        {/* CTA */}
        <Link href="/chess">
          <Button size="lg" className="group h-14 gap-3 px-8 text-lg">
            Launch Chess Board
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>

        {/* Features grid */}
        <div className="mt-8 grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="border-border bg-background rounded-xl border p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-3 text-3xl">♟️</div>
            <h3 className="mb-2 font-semibold">Fully Interactive</h3>
            <p className="text-muted-foreground text-sm">
              Drag & drop or click-to-move with real-time move validation using
              chess.js
            </p>
          </div>

          <div className="border-border bg-background rounded-xl border p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-3 text-3xl">🎨</div>
            <h3 className="mb-2 font-semibold">Beautiful Themes</h3>
            <p className="text-muted-foreground text-sm">
              Choose from 4 stunning board themes: Default, Wood, Marble, and
              Neon
            </p>
          </div>

          <div className="border-border bg-background rounded-xl border p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-3 text-3xl">✨</div>
            <h3 className="mb-2 font-semibold">Smooth Animations</h3>
            <p className="text-muted-foreground text-sm">
              Powered by Framer Motion for fluid piece movements and transitions
            </p>
          </div>

          <div className="border-border bg-background rounded-xl border p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-3 text-3xl">⏱️</div>
            <h3 className="mb-2 font-semibold">Chess Clocks</h3>
            <p className="text-muted-foreground text-sm">
              Built-in timers with customizable time controls and pause/resume
            </p>
          </div>

          <div className="border-border bg-background rounded-xl border p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-3 text-3xl">💾</div>
            <h3 className="mb-2 font-semibold">Import/Export</h3>
            <p className="text-muted-foreground text-sm">
              Full FEN and PGN support for loading and saving games
            </p>
          </div>

          <div className="border-border bg-background rounded-xl border p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-3 text-3xl">🧩</div>
            <h3 className="mb-2 font-semibold">Modular Design</h3>
            <p className="text-muted-foreground text-sm">
              Publishable as npm package with clean, typed, and reusable
              components
            </p>
          </div>
        </div>

        {/* Tech stack */}
        <div className="border-border bg-muted/50 mt-8 w-full rounded-xl border p-6 text-center backdrop-blur-sm">
          <p className="text-muted-foreground mb-3 text-sm font-medium">
            Built with modern technologies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-semibold">
            <span className="bg-background rounded-full px-4 py-2 shadow-sm">
              Next.js 16
            </span>
            <span className="bg-background rounded-full px-4 py-2 shadow-sm">
              React 19
            </span>
            <span className="bg-background rounded-full px-4 py-2 shadow-sm">
              Framer Motion
            </span>
            <span className="bg-background rounded-full px-4 py-2 shadow-sm">
              chess.js
            </span>
            <span className="bg-background rounded-full px-4 py-2 shadow-sm">
              Tailwind v4
            </span>
            <span className="bg-background rounded-full px-4 py-2 shadow-sm">
              shadcn/ui
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
