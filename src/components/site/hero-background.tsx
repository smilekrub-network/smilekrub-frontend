import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

import { cn } from '@/lib/utils'

const FLOATING_BLOCKS = [
  { size: 14, color: 'bg-grass', top: '18%', left: '8%', duration: 7, delay: 0 },
  { size: 10, color: 'bg-dirt', top: '30%', left: '85%', duration: 9, delay: 1.2 },
  { size: 18, color: 'bg-stone', top: '62%', left: '12%', duration: 8, delay: 0.6 },
  { size: 8, color: 'bg-gold', top: '22%', left: '72%', duration: 6, delay: 2 },
  { size: 12, color: 'bg-grass-deep', top: '70%', left: '80%', duration: 10, delay: 0.3 },
  { size: 9, color: 'bg-dirt-deep', top: '48%', left: '92%', duration: 7.5, delay: 1.8 },
  { size: 16, color: 'bg-stone-deep', top: '78%', left: '28%', duration: 9.5, delay: 0.9 },
  { size: 7, color: 'bg-gold', top: '40%', left: '4%', duration: 6.5, delay: 2.4 },
] as const

const EMBERS = [
  { top: '55%', left: '20%', delay: 0 },
  { top: '35%', left: '60%', delay: 1.5 },
  { top: '65%', left: '65%', delay: 0.8 },
  { top: '25%', left: '40%', delay: 2.2 },
] as const

export function HeroBackground({
  scrollTargetRef,
}: {
  scrollTargetRef: React.RefObject<HTMLElement | null>
}) {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: scrollTargetRef,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '18%'])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.img
        src="/wallpaper/campfire_site_dusk.webp"
        alt=""
        aria-hidden
        style={{ y, scale: 1.1, willChange: 'transform' }}
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 55% at 50% 45%, rgba(0,0,0,0.55) 0%, transparent 70%)',
        }}
      />

      {FLOATING_BLOCKS.map((block, i) => (
        <div
          key={i}
          className={cn('animate-float-y absolute border-2 border-black/40', block.color)}
          style={{
            width: block.size,
            height: block.size,
            top: block.top,
            left: block.left,
            animationDuration: `${block.duration}s`,
            animationDelay: `${block.delay}s`,
            imageRendering: 'pixelated',
            opacity: 0.75,
          }}
        />
      ))}

      {EMBERS.map((ember, i) => (
        <div
          key={i}
          className="animate-float-y absolute size-[3px] rounded-full bg-gold"
          style={{
            top: ember.top,
            left: ember.left,
            animationDuration: '5s',
            animationDelay: `${ember.delay}s`,
            boxShadow: '0 0 6px 1px oklch(0.8 0.14 85 / 60%)',
          }}
        />
      ))}
    </div>
  )
}
