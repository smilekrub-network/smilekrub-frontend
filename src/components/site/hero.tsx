import { useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { FaDiscord } from 'react-icons/fa'

import { Button } from '@/components/ui/button'
import { MinecraftButton } from '#/components/ui/minecraft-menu'
import { CopyIpButton } from '#/components/site/copy-ip-button'
import { HeroBackground } from '#/components/site/hero-background'
import { ServerStatusChip } from '#/components/site/server-status-chip'
import { DISCORD_URL } from '#/lib/site-content'
import type { ServerStatus } from '#/lib/server-status'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

export function Hero({ status }: { status: ServerStatus }) {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 py-28 text-center"
    >
      <HeroBackground scrollTargetRef={sectionRef} />

      <motion.div
        initial={reduced ? false : 'hidden'}
        animate="visible"
        variants={container}
        className="relative mx-auto flex max-w-3xl flex-col items-center gap-6"
      >
        <motion.h1 variants={item}>
          <img
            src="/smilekrub_logo_white.png"
            alt="SMILEKRUB NETWORK"
            className="h-28 w-auto drop-shadow-[0_6px_16px_rgba(0,0,0,0.8)] sm:h-36 lg:h-44"
          />
        </motion.h1>

        <motion.div variants={item} className="mt-2">
          <CopyIpButton />
        </motion.div>

        {/* <motion.div
          variants={item}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <div className="h-[52px] w-52 max-w-full">
            <MinecraftButton onClick={() => {
              document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' })
            }}>
              เล่นเลย
            </MinecraftButton>
          </div>
          <Button
            variant="outline"
            size="lg"
            render={<a href={DISCORD_URL} target="_blank" rel="noreferrer" />}
            className="border-white/40 bg-white/5 text-white backdrop-blur hover:bg-white/15 hover:text-white"
          >
            <FaDiscord className="size-5" />
            Join Discord
          </Button>
        </motion.div> */}

        <motion.div variants={item}>
          <ServerStatusChip status={status} expanded />
        </motion.div>
      </motion.div>
    </section>
  )
}
