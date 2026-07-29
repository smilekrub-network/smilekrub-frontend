import { Card, CardContent } from '@/components/ui/card'
import { SectionHeading } from '#/components/site/section-heading'
import { Stagger, StaggerItem } from '#/components/site/motion-primitives'
import { SOCIAL_LINKS } from '#/lib/site-content'
import { cn } from '@/lib/utils'

export function Community() {
  return (
    <section id="community" className="relative overflow-hidden px-6 py-20">
      <img
        src="/wallpaper/campfire_site_dawn.webp"
        alt=""
        aria-hidden
        className="absolute inset-0 size-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/85 to-background" />

      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          label="COMMUNITY"
          title="เข้าร่วมคอมมูนิตี้"
          subtitle="พูดคุย แชร์ผลงาน และติดตามข่าวสารได้ทุกช่องทาง"
        />
        <Stagger className="flex flex-wrap justify-center gap-4">
          {SOCIAL_LINKS.map((social) => (
            <StaggerItem key={social.label} className="w-full sm:w-[calc(50%-0.5rem)] lg:w-72">
              <Card
                size="sm"
                className="group h-full bg-card/80 backdrop-blur transition-all hover:-translate-y-1 hover:ring-primary/40"
                render={
                  <a href={social.href} target="_blank" rel="noreferrer" />
                }
              >
                <CardContent className="flex flex-col gap-3">
                  <social.icon className={cn('size-8', social.accent)} />
                  <h3 className="font-semibold text-foreground">{social.label}</h3>
                  <p className="text-sm text-muted-foreground">{social.cta}</p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
