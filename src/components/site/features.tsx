import {
  Briefcase,
  CalendarDays,
  Coins,
  Shield,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { SectionHeading } from '#/components/site/section-heading'
import { Stagger, StaggerItem } from '#/components/site/motion-primitives'
import { FEATURES } from '#/lib/site-content'

const ICONS: Record<string, LucideIcon> = {
  Users,
  Shield,
  Coins,
  Briefcase,
  CalendarDays,
  Zap,
}

export function Features() {
  return (
    <section id="features" className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          label="FEATURES"
          title="จุดเด่นของเซิร์ฟเวอร์"
          subtitle="ทุกอย่างที่ทำให้ Smilekrub เป็นบ้านหลังที่สองของคุณ"
        />
        <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = ICONS[feature.icon]
            return (
              <StaggerItem key={feature.title}>
                <Card
                  size="sm"
                  className="h-full transition-all hover:-translate-y-1 hover:ring-primary/40"
                >
                  <CardContent className="flex flex-col gap-3">
                    <span
                      className="flex size-11 items-center justify-center border-2 border-black/40 bg-grass/10 text-primary"
                      style={{ imageRendering: 'pixelated' }}
                    >
                      <Icon className="size-5" />
                    </span>
                    <h3 className="text-base font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{feature.body}</p>
                  </CardContent>
                </Card>
              </StaggerItem>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}
