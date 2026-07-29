import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MinecraftTag } from '#/components/ui/minecraft-menu'
import { SectionHeading } from '#/components/site/section-heading'
import { Stagger, StaggerItem } from '#/components/site/motion-primitives'
import { NEWS_ITEMS } from '#/lib/site-content'

function NewsCard({ item }: { item: (typeof NEWS_ITEMS)[number] }) {
  return (
    <Card
      size="sm"
      className="group h-full gap-0 p-0 transition-all hover:-translate-y-1 hover:ring-primary/50"
      render={<a href="#" />}
    >
      <div className={`relative aspect-video bg-gradient-to-br ${item.gradient}`}>
        <MinecraftTag className="absolute bottom-2 left-2 font-mc text-[10px]">
          {item.category}
        </MinecraftTag>
      </div>
      <CardContent className="py-4">
        <h3 className="text-sm leading-snug font-medium text-foreground group-hover:text-primary">
          {item.title}
        </h3>
      </CardContent>
    </Card>
  )
}

export function NewsGrid() {
  return (
    <section id="news" className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          label="NEWS"
          title="ข่าวสารและอัปเดต"
          subtitle="ติดตามประกาศและกิจกรรมล่าสุดจากทีมงาน"
        />
        <Stagger className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {NEWS_ITEMS.map((item) => (
            <StaggerItem key={item.id}>
              <NewsCard item={item} />
            </StaggerItem>
          ))}
        </Stagger>
        <div className="mt-8 text-center">
          <Button variant="link" render={<a href="#" />} className="text-primary">
            ดูข่าวทั้งหมด &#8599;
          </Button>
        </div>
      </div>
    </section>
  )
}
