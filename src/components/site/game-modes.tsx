import { Card, CardContent } from '@/components/ui/card'
import { MinecraftTag } from '#/components/ui/minecraft-menu'
import { SectionHeading } from '#/components/site/section-heading'
import { Reveal } from '#/components/site/motion-primitives'
import { GAME_MODES } from '#/lib/site-content'
import { cn } from '@/lib/utils'

export function GameModes() {
  return (
    <section id="modes" className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          label="GAME MODES"
          title="โหมดเกมทั้งหมด"
          subtitle="เลือกสไตล์การเล่นที่ใช่สำหรับคุณ"
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {GAME_MODES.map((mode, i) => (
            <Reveal key={mode.tag} delay={i * 0.1} className={cn(i === 0 && 'lg:col-span-2')}>
              <Card size="sm" className="group h-full p-0">
                <div
                  className={cn(
                    'relative overflow-hidden bg-gradient-to-br',
                    mode.gradient,
                    i === 0 ? 'aspect-[2/1] lg:aspect-[2.4/1]' : 'aspect-[2/1]',
                  )}
                >
                  {mode.image ? (
                    <img
                      src={mode.image}
                      alt=""
                      aria-hidden
                      className="absolute inset-0 size-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <MinecraftTag className="absolute bottom-3 left-3 font-mc text-xs">
                    {mode.tag}
                  </MinecraftTag>
                </div>
                <CardContent className="flex flex-col gap-1.5 py-4">
                  <h3 className="text-lg font-semibold text-foreground">{mode.title}</h3>
                  <p className="text-sm text-muted-foreground">{mode.body}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
