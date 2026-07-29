import { Gamepad2, Palette, Pickaxe, type LucideIcon } from 'lucide-react'

import { BentoCard, BentoGrid } from '@/components/ui/bento-grid'
import { MinecraftTag } from '#/components/ui/minecraft-menu'
import { SectionHeading } from '#/components/site/section-heading'
import { Reveal } from '#/components/site/motion-primitives'
import { GAME_MODES } from '#/lib/site-content'
import { cn } from '@/lib/utils'

const ICONS: Record<string, LucideIcon> = {
  Pickaxe,
  Palette,
  Gamepad2,
}

export function GameModes() {
  return (
    <section id="modes" className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          label="GAME MODES"
          title="โหมดเกมทั้งหมด"
          subtitle="เลือกสไตล์การเล่นที่ใช่สำหรับคุณ"
        />
        <Reveal>
          <BentoGrid className="auto-rows-[16rem] lg:grid-cols-3 lg:auto-rows-[11rem]">
            {GAME_MODES.map((mode, i) => (
              <BentoCard
                key={mode.tag}
                name={mode.title}
                description={mode.body}
                href={mode.comingSoon ? undefined : mode.href}
                cta={mode.cta}
                Icon={ICONS[mode.icon]}
                badge={
                  mode.comingSoon ? (
                    <MinecraftTag className="font-mc text-[10px] tracking-wider text-gold">
                      COMING SOON
                    </MinecraftTag>
                  ) : undefined
                }
                className={cn(
                  'border-2 border-black/40',
                  i === 0
                    ? 'lg:col-span-2 lg:row-span-2'
                    : 'lg:col-span-1 lg:row-span-1',
                )}
                background={
                  <div
                    className={cn(
                      '-z-10 absolute inset-0 bg-gradient-to-br opacity-90',
                      mode.gradient,
                      mode.comingSoon && 'grayscale',
                    )}
                  >
                    {mode.image ? (
                      <img
                        src={mode.image}
                        alt=""
                        aria-hidden
                        className="absolute inset-0 size-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  </div>
                }
              />
            ))}
          </BentoGrid>
        </Reveal>
      </div>
    </section>
  )
}
