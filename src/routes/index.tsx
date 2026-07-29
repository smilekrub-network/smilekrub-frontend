import { createFileRoute } from '@tanstack/react-router'

import { Community } from '#/components/site/community'
import { Features } from '#/components/site/features'
import { Footer } from '#/components/site/footer'
import { GameModes } from '#/components/site/game-modes'
import { Hero } from '#/components/site/hero'
import { HowToJoin } from '#/components/site/how-to-join'
import { NavBar } from '#/components/site/nav-bar'
import { NewsGrid } from '#/components/site/news-grid'
import { getServerStatus } from '#/lib/server-status'
import { useServerStatus } from '#/lib/use-server-status'

export const Route = createFileRoute('/')({
  component: Home,
  loader: () => getServerStatus(),
})

function Home() {
  const status = useServerStatus(Route.useLoaderData())

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar status={status} />
      <Hero status={status} />
      <Features />
      <GameModes />
      <HowToJoin />
      <NewsGrid />
      <Community />
      <Footer />
    </div>
  )
}
